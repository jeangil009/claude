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
- Cortes de avance (`project.history`): `[{"date": "AAAA-MM-DD", "PV": n, "EV": n, "AC": n}, ...]`.
  La app los genera con el botón **Guardar corte** (Configuración → Cortes de Avance) y los
  incluye en el JSON exportado. También se acepta `history` en la raíz del JSON.

Cómo se dibujan EV y AC:

- **Con cortes:** se interpola linealmente entre ellos, partiendo de (inicio, 0, 0) y cerrando en
  la fecha de corte con el avance vigente de las actividades. Los cortes posteriores a la fecha
  de corte se ignoran. El pie del video indica cuántos cortes se usaron.
- **Sin cortes:** el JSON solo trae EV y AC acumulados a la fecha de corte, así que se
  reconstruyen por actividad con una rampa lineal entre su inicio real (o planificado) y su fin
  real (o la fecha de corte). Es una estimación y el video lo indica en pantalla.

Para un informe formal, registra un corte en cada fecha de informe, después de actualizar el
avance y el costo real de las actividades: un corte guarda lo que las actividades tengan en ese
momento. `sample_project_con_cortes.json` es un ejemplo de demostración con cortes generados
por script (no son mediciones reales).

## Convenciones

- Duraciones en días calendario.
- Formato numérico de Panamá (coma de miles, punto decimal). La moneda sale del campo
  `currency` del proyecto (`PAB` se muestra como `B/.`).
- Sin marca ni logo: se agrega según a nombre de quién vaya el entregable.
- EAC típico = BAC / CPI, igual que en la app; la proyección se dibuja hasta la fecha
  de fin planificada.

## Flujo de trabajo (estudio)

Los archivos de esta carpeta son el contrato de la pieza; el video se regenera desde ellos:

- `brief.md`: qué dice la pieza, qué datos son reales y qué es inaceptable.
- `style-guide.md`: paleta, tipografía y reglas de movimiento.
- `shotlist.md`: beats con tiempos, estado de entrada y salida y propósito.
- `scurve_evm.py`: la escena. Es determinista: mismo JSON, mismo video.
- `tools/contact_sheet.py`: un cuadro por beat del shotlist para revisar sin ver el video completo.
- `reviews/`: contact sheets y defectos encontrados por iteración.

Ciclo: renderizar → contact sheet → anotar los defectos con tiempo y evidencia en `reviews/` → corregir solo eso → renderizar de nuevo.

```bash
manim -qm scurve_evm.py EVMSCurve
python tools/contact_sheet.py media/videos/scurve_evm/720p30/EVMSCurve.mp4 reviews/002-contact-sheet.png
```
