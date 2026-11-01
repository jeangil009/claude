# Guía de estilo (extraída del código, no de adjetivos)

PALETA
Fondo #0F172A. PV azul (BLUE_C de Manim), EV verde (GREEN_C), AC rojo (RED_C), EAC y varianzas amarillo (YELLOW_C), texto secundario gris (GREY_B), BAC blanco.
Un color por magnitud, igual en curvas, puntos y panel. No reutilizar un color para otra cosa.

TIPOGRAFÍA
Inter (variable `EVM_FONT`; si no está instalada cae a una sans-serif genérica).
Título 34 pt bold; subtítulo 20; panel de cifras 22; ejes y rótulos 18-20. Mínimo 18 pt para que se lea en teléfono.

MOVIMIENTO
Curvas: se dibujan a ritmo lineal (el trazo es el dato). El barrido de EV y AC usa `smooth`.
Panel: filas entran de a una (0.35 s) con un desplazamiento corto. Sin rebotes ni overshoot.
Cada elemento aparece una sola vez y se queda; nada decora.

PROHIBIDO
Degradados decorativos, partículas, texto centrado gigante, logo sorpresa al final.
Cifras sin fuente. Gráficas reconstruidas sin aviso.
