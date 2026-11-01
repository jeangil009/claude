# Brief: Curva S de avance de obra

FILM
Una frase: la distancia entre lo planificado (PV) y lo ganado (EV) a la fecha de corte, y a cuánto llegará el costo final (EAC) si nada cambia.
Audiencia: gerencia de obra, contratista y cliente que reciben el informe de avance.
Duración: ~23 s por proyecto.
Formatos: 16:9 (hecho). 9:16 pendiente (ver reviews/001.md).

ASSETS
Datos: JSON exportado por la app EVM (`EVM_JSON`). Es la única fuente de cifras.
Logo y membrete: pendiente. Confirmar a nombre de quién va cada entregable antes de agregarlos.
Tipografía y colores: ver style-guide.md.
Audio: sin audio por ahora.

REGLAS
Nunca inventar cifras: todo número sale del JSON o de las fórmulas de evmCalculations.ts.
Si EV y AC se reconstruyen (no hay `history`), el video lo dice en pantalla.
Duraciones en días calendario; formato numérico de Panamá.
Inaceptable: un índice que no coincida con la app, o una curva presentada como real cuando es estimada.

ENTREGABLES
Video 16:9, cuadro póster, contact sheet en reviews/, fuente (scurve_evm.py).
