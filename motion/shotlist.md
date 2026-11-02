# Shotlist: Curva S EVM

Contrato de la pieza. Si un beat no se puede justificar, no entra al render.
Los tiempos salen de los `run_time` de `scurve_evm.py` (días calendario no aplican aquí:
son segundos de video). Formato de beat: `inicio-finS NOMBRE  propósito | entra → sale`.

00.0-04.1s HOOK      Veredicto primero: SPI y CPI en grande, explicados en una línea | pantalla vacía → título, subtítulo y los dos índices
04.1-06.5s ESCENA    Ejes y presupuesto total (BAC) como techo | índices fuera → ejes, meses, BAC
06.5-09.1s PLAN      Curva planificada PV: cómo debía avanzar el gasto | BAC → curva PV completa
09.1-12.3s REAL      EV y AC avanzan hasta la fecha de corte; la brecha aparece sola | PV → EV y AC dibujadas, línea de corte
12.3-16.2s PRUEBA    SV y CV marcados y cuantificados en el panel | curvas → varianzas e índices en el panel
16.2-20.1s PROYECCIÓN EAC y VAC: dónde termina el costo si nada cambia | panel con índices → EAC, VAC y veredicto de salud
20.1-22.1s CIERRE    Estado final estable y legible, apto como póster | todo visible → se sostiene 2 s

Después del cierre hay un fundido a negro de 0.8 s (22.1-22.9 s) que no cuenta como beat.

## Estados del dato (continuidad)

PLANIFICADO (PV) → REAL A LA FECHA (EV, AC) → VARIANZA (SV, CV) → ÍNDICES (SPI, CPI) → PROYECCIÓN (EAC, VAC)

Cada estado usa el mismo color y la misma posición en todo el video:
PV azul, EV verde, AC rojo, EAC amarillo.
