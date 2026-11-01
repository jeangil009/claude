# Shotlist: Curva S EVM

Contrato de la pieza. Si un beat no se puede justificar, no entra al render.
Los tiempos salen de los `run_time` de `scurve_evm.py` (días calendario no aplican aquí:
son segundos de video). Formato de beat: `inicio-finS NOMBRE  propósito | entra → sale`.

00.0-01.8s HOOK      Nombre del proyecto y qué se está viendo | pantalla vacía → título + subtítulo con fecha de corte
01.8-04.2s ESCENA    Ejes y presupuesto total (BAC) como techo | título → ejes, meses, BAC
04.2-07.6s PLAN      Curva planificada PV: cómo debía avanzar el gasto | BAC → curva PV completa
07.6-11.6s REAL      EV y AC avanzan hasta la fecha de corte; la brecha aparece sola | PV → EV y AC dibujadas, línea de corte
11.6-15.6s PRUEBA    SV y CV marcados y cuantificados en el panel | curvas → varianzas e índices en el panel
15.6-19.5s PROYECCIÓN EAC y VAC: dónde termina el costo si nada cambia | panel con índices → EAC, VAC y veredicto de salud
19.5-22.0s CIERRE    Estado final estable y legible, apto como póster | todo visible → se sostiene 2.5 s

Después del cierre hay un fundido a negro de 0.8 s (22.0-22.8 s) que no cuenta como beat.

## Estados del dato (continuidad)

PLANIFICADO (PV) → REAL A LA FECHA (EV, AC) → VARIANZA (SV, CV) → ÍNDICES (SPI, CPI) → PROYECCIÓN (EAC, VAC)

Cada estado usa el mismo color y la misma posición en todo el video:
PV azul, EV verde, AC rojo, EAC amarillo.
