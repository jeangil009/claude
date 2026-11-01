# Motion: Curva S animada desde la app EVM

Animación en Manim (Python) que convierte el JSON exportado por la app
("Exportar Proyecto (JSON)") en un video de Curva S con PV, EV, AC, varianzas
CV/SV, índices CPI/SPI, proyección EAC y VAC. Usa las mismas fórmulas de
`src/utils/evmCalculations.ts`; se verificó que los resultados coinciden con la app
para el proyecto de ejemplo.

## Instalación

Requiere Python 3.10+, FFmpeg y las librerías de sistema de Cairo y Pango.

```bash
# Linux (Debian/Ubuntu)
sudo apt-get install -y ffmpeg libcairo2-dev libpango1.0-dev pkg-config

# Entorno virtual (evita conflictos de setuptools/wheel con paquetes del sistema)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

En Windows suele bastar `pip install manim` más FFmpeg en el PATH; confirmar contra la
guía oficial de instalación de Manim Community. No se necesita LaTeX: la escena usa
solo `Text`.

## Uso

```bash
# Proyecto de ejemplo (fecha de corte 2024-05-01)
manim -qm scurve_evm.py EVMSCurve

# Proyecto propio exportado desde la app
EVM_JSON=ruta/evm-mi-proyecto.json EVM_ASOF=2025-03-31 manim -qh scurve_evm.py EVMSCurve
```

Calidad: `-ql` (480p, prueba rápida), `-qm` (720p), `-qh` (1080p), `-qk` (4K).
El video queda en `media/videos/scurve_evm/<calidad>/EVMSCurve.mp4` (carpeta ignorada por git).
Con `--format=gif` o `-t` (fondo transparente) se obtienen otros formatos.

## Datos de entrada

- `project`: mismo esquema que el JSON de la app (actividades, fechas, costos, % de avance).
- `asof` (opcional): fecha de corte AAAA-MM-DD. Se puede sobrescribir con `EVM_ASOF`.
  Si no existe ninguna, se usa la fecha de hoy.
- `history` (opcional): `[{"date": "AAAA-MM-DD", "EV": n, "AC": n}, ...]` con los acumulados
  reales por periodo. Úsalo cuando tengas los valores de cada corte mensual.

Limitación importante: el JSON de la app solo guarda EV y AC acumulados a la fecha de corte,
no su historia. Sin `history`, las curvas EV y AC se reconstruyen por actividad con una
rampa lineal entre su inicio real (o planificado) y su fin real (o la fecha de corte).
Es una estimación y la animación lo indica en pantalla. Para reportes formales, usa `history`.

## Convenciones

- Duraciones en días calendario.
- Formato numérico de Panamá (coma de miles, punto decimal). La moneda sale del campo
  `currency` del proyecto (`PAB` se muestra como `B/.`).
- Sin marca ni logo: se agrega según a nombre de quién vaya el entregable.
- EAC típico = BAC / CPI, igual que en la app; la proyección se dibuja hasta la fecha
  de fin planificada.
