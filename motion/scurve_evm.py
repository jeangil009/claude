"""
Animación de Curva S de Valor Ganado (EVM) con Manim.

Lee el JSON que exporta la app ("Exportar Proyecto (JSON)") y anima
PV, EV y AC, las varianzas CV/SV, los índices CPI/SPI y la proyección EAC.
Las fórmulas son las mismas de src/utils/evmCalculations.ts.

Uso (desde la carpeta motion/):
    EVM_JSON=mi_proyecto.json EVM_ASOF=2024-05-01 manim -qh scurve_evm.py EVMSCurve

Variables de entorno:
    EVM_JSON   Ruta al JSON exportado (por defecto sample_project.json).
    EVM_ASOF   Fecha de corte AAAA-MM-DD (por defecto la clave "asof" del JSON,
               y si no existe, la fecha de hoy).

Nota sobre EV y AC en el tiempo: el JSON de la app solo trae el acumulado a la
fecha de corte, no la serie histórica. Si el JSON incluye "history"
([{"date": "AAAA-MM-DD", "EV": n, "AC": n}, ...]) se usa tal cual; si no, la
curva se reconstruye por actividad con una rampa lineal entre su inicio real
(o planificado) y su fin real (o la fecha de corte). Es una estimación y la
animación lo indica en pantalla.
"""

import json
import os
from datetime import date, timedelta
from pathlib import Path

from manim import (
    BLUE_C,
    DOWN,
    GREEN_C,
    GREY_B,
    LEFT,
    ORIGIN,
    RED_C,
    RIGHT,
    UP,
    WHITE,
    YELLOW_C,
    Axes,
    Create,
    DashedLine,
    Dot,
    FadeIn,
    FadeOut,
    Line,
    RoundedRectangle,
    Scene,
    Text,
    ValueTracker,
    VGroup,
    VMobject,
    Write,
    always_redraw,
    config,
    linear,
    smooth,
)

HERE = Path(__file__).resolve().parent
CURRENCY_SYMBOLS = {"PAB": "B/.", "USD": "USD", "COP": "COP", "MXN": "MXN", "EUR": "EUR"}
MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

config.background_color = "#0F172A"

C_PV, C_EV, C_AC, C_EAC = BLUE_C, GREEN_C, RED_C, YELLOW_C


# --------------------------------------------------------------------------
# Modelo EVM (mismas fórmulas que src/utils/evmCalculations.ts)
# --------------------------------------------------------------------------
def d(value: str) -> date:
    return date.fromisoformat(value[:10])


def planned_value(project: dict, when: date) -> float:
    pv = 0.0
    for a in project["activities"]:
        start, end = d(a["plannedStartDate"]), d(a["plannedEndDate"])
        if when < start:
            continue
        if when >= end:
            pv += a["plannedCost"]
        else:
            total = (end - start).days or 1
            pv += a["plannedCost"] * min((when - start).days / total, 1)
    return pv


def _ramp(final: float, start: date, end: date, when: date) -> float:
    if final == 0 or when <= start:
        return 0.0
    if when >= end:
        return final
    return final * (when - start).days / max((end - start).days, 1)


def reconstructed(project: dict, asof: date, when: date):
    """EV y AC acumulados reconstruidos a la fecha `when` (<= asof)."""
    ev = ac = 0.0
    for a in project["activities"]:
        start = d(a.get("actualStartDate") or a["plannedStartDate"])
        end = d(a["actualEndDate"]) if a.get("actualEndDate") else asof
        ev += _ramp(a["plannedCost"] * a["percentComplete"] / 100, start, end, when)
        ac += _ramp(a["actualCost"], start, end, when)
    return ev, ac


def metrics(project: dict, asof: date) -> dict:
    bac = project["budget"]
    pv = planned_value(project, asof)
    ev = sum(a["plannedCost"] * a["percentComplete"] / 100 for a in project["activities"])
    ac = sum(a["actualCost"] for a in project["activities"])
    cpi = (ev / ac) if ac else (float("inf") if ev > 0 else 1.0)
    spi = (ev / pv) if pv else (float("inf") if ev > 0 else 1.0)
    eac = bac / cpi if cpi else float("inf")
    avg = (cpi + spi) / 2
    health = "excelente" if avg >= 1.0 else "buena" if avg >= 0.9 else "en alerta" if avg >= 0.8 else "crítica"
    return dict(BAC=bac, PV=pv, EV=ev, AC=ac, CV=ev - ac, SV=ev - pv, CPI=cpi, SPI=spi,
                EAC=eac, ETC=eac - ac, VAC=bac - eac, health=health)


# --------------------------------------------------------------------------
# Utilidades de formato (Panamá: coma de miles, punto decimal)
# --------------------------------------------------------------------------
def money(value: float, cur: str) -> str:
    sign = "-" if value < 0 else ""
    return f"{cur} {sign}{abs(value):,.0f}"


def axis_label(v: float) -> str:
    if v >= 1e6:
        return f"{v / 1e6:.1f}M".replace(".0M", "M")
    return f"{v / 1e3:.0f}k"


def nice_step(top: float, ticks: int = 5) -> float:
    raw = top / ticks
    mag = 10 ** (len(str(int(raw))) - 1)
    for m in (1, 2, 2.5, 5, 10):
        if raw <= m * mag:
            return m * mag
    return 10 * mag


def load_inputs():
    path = Path(os.environ.get("EVM_JSON", HERE / "sample_project.json"))
    data = json.loads(path.read_text(encoding="utf-8"))
    project = data.get("project", data)
    asof_raw = os.environ.get("EVM_ASOF") or data.get("asof")
    asof = d(asof_raw) if asof_raw else date.today()
    return project, data.get("history"), asof


# --------------------------------------------------------------------------
# Escena
# --------------------------------------------------------------------------
class EVMSCurve(Scene):
    def construct(self):
        project, history, asof = load_inputs()
        start, end = d(project["startDate"]), d(project["plannedEndDate"])
        total_days = (end - start).days
        asof = min(max(asof, start), end)
        asof_day = (asof - start).days
        cur = CURRENCY_SYMBOLS.get(project.get("currency", ""), project.get("currency", ""))
        m = metrics(project, asof)

        if history:
            hist = sorted((d(h["date"]), h["EV"], h["AC"]) for h in history)

            def ev_ac(day: float):
                when = start + timedelta(days=day)
                pts = [h for h in hist if h[0] <= when]
                return (pts[-1][1], pts[-1][2]) if pts else (0.0, 0.0)
        else:
            def ev_ac(day: float):
                return reconstructed(project, asof, start + timedelta(days=int(day)))

        # ---- Título -------------------------------------------------------
        title = Text(project["name"], font_size=34, weight="BOLD").to_edge(UP, buff=0.35)
        subtitle = Text(
            f"Curva S · Valor Ganado · corte {asof.strftime('%d/%m/%Y')} · {total_days} días calendario",
            font_size=20, color=GREY_B,
        ).next_to(title, DOWN, buff=0.12)
        self.play(Write(title), run_time=1.2)
        self.play(FadeIn(subtitle, shift=UP * 0.1), run_time=0.6)

        # ---- Ejes ---------------------------------------------------------
        y_top = max(m["BAC"], m["EAC"] if m["EAC"] != float("inf") else m["BAC"]) * 1.1
        y_step = nice_step(y_top)
        y_max = y_step * (int(y_top / y_step) + 1)
        axes = Axes(
            x_range=[0, total_days, max(total_days // 6, 1)],
            y_range=[0, y_max, y_step],
            x_length=8.4, y_length=4.7,
            axis_config={"color": GREY_B, "include_ticks": False, "include_tip": False},
        ).to_edge(LEFT, buff=0.9).shift(DOWN * 0.55)
        self.play(Create(axes), run_time=1)

        labels = VGroup()
        cursor = date(start.year, start.month, 1)
        while cursor <= end:
            day = (cursor - start).days
            if 0 <= day <= total_days:
                lab = Text(MONTHS_ES[cursor.month - 1], font_size=16, color=GREY_B)
                labels.add(lab.next_to(axes.c2p(day, 0), DOWN, buff=0.12))
            cursor = date(cursor.year + (cursor.month == 12), cursor.month % 12 + 1, 1)
        v = y_step
        while v <= y_max:
            labels.add(Text(axis_label(v), font_size=16, color=GREY_B).next_to(axes.c2p(0, v), LEFT, buff=0.12))
            v += y_step
        unit_lbl = Text(cur, font_size=16, color=GREY_B).next_to(axes.c2p(0, y_max), UP, buff=0.1).align_to(axes, LEFT)
        self.play(FadeIn(labels), FadeIn(unit_lbl), run_time=0.6)

        def polyline(fn, upto: float, color, width=4):
            n = max(int(upto), 1)
            pts = [axes.c2p(i, fn(i)) for i in range(n + 1)]
            line = VMobject(stroke_color=color, stroke_width=width)
            line.set_points_as_corners(pts)
            return line

        # ---- BAC y PV -----------------------------------------------------
        bac_line = DashedLine(axes.c2p(0, m["BAC"]), axes.c2p(total_days, m["BAC"]),
                              color=WHITE, stroke_width=2, dash_length=0.12)
        bac_txt = Text(f"BAC {money(m['BAC'], cur)}", font_size=18).next_to(bac_line, UP, buff=0.08).align_to(bac_line, LEFT)
        self.play(Create(bac_line), FadeIn(bac_txt), run_time=0.8)

        pv_fn = lambda i: planned_value(project, start + timedelta(days=int(i)))
        pv_curve = polyline(pv_fn, total_days, C_PV)
        pv_tag = Text("PV planificado", font_size=18, color=C_PV).move_to(axes.c2p(total_days * 0.74, m["BAC"] * 0.42))
        self.play(Create(pv_curve), run_time=3, rate_func=linear)
        self.play(FadeIn(pv_tag), run_time=0.4)

        # ---- EV y AC avanzando hasta la fecha de corte --------------------
        t = ValueTracker(0)
        ev_curve = always_redraw(lambda: polyline(lambda i: ev_ac(i)[0], t.get_value(), C_EV))
        ac_curve = always_redraw(lambda: polyline(lambda i: ev_ac(i)[1], t.get_value(), C_AC))
        cut = always_redraw(lambda: DashedLine(
            axes.c2p(t.get_value(), 0), axes.c2p(t.get_value(), y_max),
            color=GREY_B, stroke_width=1.5, dash_length=0.08))
        self.add(ev_curve, ac_curve, cut)
        self.play(t.animate.set_value(max(asof_day, 1)), run_time=4, rate_func=smooth)
        self.remove(ev_curve, ac_curve, cut)
        ev_curve = polyline(lambda i: ev_ac(i)[0], asof_day, C_EV)
        ac_curve = polyline(lambda i: ev_ac(i)[1], asof_day, C_AC)
        cut = DashedLine(axes.c2p(asof_day, 0), axes.c2p(asof_day, y_max), color=GREY_B, stroke_width=1.5, dash_length=0.08)
        self.add(ev_curve, ac_curve, cut)

        # ---- Varianzas en la fecha de corte -------------------------------
        p_pv, p_ev, p_ac = (axes.c2p(asof_day, m[k]) for k in ("PV", "EV", "AC"))
        dots = VGroup(Dot(p_pv, color=C_PV), Dot(p_ev, color=C_EV), Dot(p_ac, color=C_AC))
        sv_line = Line(p_pv, p_ev, color=YELLOW_C, stroke_width=5).shift(RIGHT * 0.12)
        cv_line = Line(p_ev, p_ac, color=YELLOW_C, stroke_width=5).shift(RIGHT * 0.12)
        sv_tag = Text("SV", font_size=18, color=YELLOW_C).next_to(sv_line, RIGHT, buff=0.08)
        cv_tag = Text("CV", font_size=18, color=YELLOW_C).next_to(cv_line, RIGHT, buff=0.08)
        self.play(FadeIn(dots), Create(sv_line), Create(cv_line), FadeIn(sv_tag), FadeIn(cv_tag), run_time=1)

        # ---- Panel de indicadores ----------------------------------------
        def kpi_color(x):
            return C_EV if x >= 1 else YELLOW_C if x >= 0.9 else C_AC

        rows = [
            ("PV", money(m["PV"], cur), C_PV), ("EV", money(m["EV"], cur), C_EV),
            ("AC", money(m["AC"], cur), C_AC),
            ("SV", money(m["SV"], cur), kpi_color(m["SPI"])), ("CV", money(m["CV"], cur), kpi_color(m["CPI"])),
            ("SPI", f"{m['SPI']:.2f}", kpi_color(m["SPI"])), ("CPI", f"{m['CPI']:.2f}", kpi_color(m["CPI"])),
        ]
        panel = RoundedRectangle(corner_radius=0.15, width=4.1, height=5.3, stroke_color=GREY_B, stroke_width=1.5)
        panel.to_edge(RIGHT, buff=0.35).shift(DOWN * 0.45)
        items = VGroup()
        for i, (k, val, col) in enumerate(rows):
            key = Text(k, font_size=22, color=col, weight="BOLD")
            num = Text(val, font_size=22)
            row = VGroup(key, num)
            key.move_to(panel.get_left() + RIGHT * 0.6 + UP * (2.0 - i * 0.45))
            num.next_to(key, RIGHT, buff=0.35)
            items.add(row)
        self.play(Create(panel), run_time=0.5)
        for row in items:
            self.play(FadeIn(row, shift=LEFT * 0.15), run_time=0.35)

        # ---- Proyección EAC ------------------------------------------------
        if m["EAC"] != float("inf"):
            eac_line = DashedLine(axes.c2p(asof_day, m["AC"]), axes.c2p(total_days, m["EAC"]),
                                  color=C_EAC, stroke_width=4, dash_length=0.14)
            eac_dot = Dot(axes.c2p(total_days, m["EAC"]), color=C_EAC)
            eac_tag = Text("EAC", font_size=18, color=C_EAC).next_to(eac_dot, UP, buff=0.12)
            vac_line = Line(axes.c2p(total_days, m["BAC"]), axes.c2p(total_days, m["EAC"]),
                            color=YELLOW_C, stroke_width=5).shift(RIGHT * 0.12)
            vac_tag = Text("VAC", font_size=16, color=YELLOW_C).next_to(vac_line, RIGHT, buff=0.06).shift(DOWN * 0.25)
            self.play(Create(eac_line), run_time=1.6)
            self.play(FadeIn(eac_dot), FadeIn(eac_tag), Create(vac_line), FadeIn(vac_tag), run_time=0.8)
            extra = [("EAC", money(m["EAC"], cur), C_EAC),
                     ("VAC", money(m["VAC"], cur), C_EV if m["VAC"] >= 0 else C_AC)]
            for i, (k, val, col) in enumerate(extra):
                key = Text(k, font_size=22, color=col, weight="BOLD").move_to(
                    panel.get_left() + RIGHT * 0.6 + UP * (2.0 - (len(rows) + i) * 0.45))
                num = Text(val, font_size=22).next_to(key, RIGHT, buff=0.35)
                self.play(FadeIn(VGroup(key, num), shift=LEFT * 0.15), run_time=0.35)

        # ---- Cierre --------------------------------------------------------
        verdict = Text(f"Salud: {m['health']}", font_size=22, weight="BOLD",
                       color=C_EV if m["health"] in ("excelente", "buena") else YELLOW_C if m["health"] == "en alerta" else C_AC)
        verdict.move_to(panel.get_bottom() + UP * 0.38)
        note = None
        if not history:
            note = Text("EV y AC reconstruidos por actividad (estimación)", font_size=14, color=GREY_B).to_edge(DOWN, buff=0.15)
        self.play(FadeIn(verdict, shift=UP * 0.1), *( [FadeIn(note)] if note else [] ), run_time=0.8)
        self.wait(2.5)
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=0.8)
