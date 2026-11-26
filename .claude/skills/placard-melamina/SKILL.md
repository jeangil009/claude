---
name: placard-melamina
description: Diseña y entrega un placard, closet, vestidor o mueble de melamina listo para fabricar. Genera una página web con modelo 3D interactivo (puertas y cajones que se abren, medidas editables), despiece con medidas, planillas de corte por placa, tipo y cantidad de material, lista de compras con herrajes y presupuesto aproximado, más orden de armado. Úsalo siempre que el usuario hable de fabricar o cotizar un placard, ropero, closet, vestidor, módulos de melamina, despiece, planilla de corte, optimizar placas, herrajes de melamina o presupuesto de carpintería, aunque no pida explícitamente un "modelo 3D" ni mencione este skill. También cuando adjunte medidas de un hueco y pida "dame el despiece" o "cuánto material necesito".
---

# Placard de melamina: 3D + despiece + corte + presupuesto

Entrega una sola página HTML autocontenida (Three.js por CDN) a partir de una plantilla ya probada. La plantilla está en `assets/placard-template.html` y las fórmulas, conteos de herrajes y precios base en `references/formulas.md`. Léelo antes de adaptar la plantilla a un caso distinto del original.

## Cuándo usar la plantilla tal cual y cuándo adaptarla

La plantilla resuelve el caso base: hueco rectangular, 3 módulos iguales (ropa larga / 3 cajones + estantes / dos barrales de ropa corta), maletero superior de ancho completo, 3 hojas corredizas en riel triple con perfil de aluminio, melamina blanca de 18 mm por dentro, símil roble en puertas y fondo de fibroplus de 3 mm en ranura.

Si el usuario pide otra configuración (otra cantidad de módulos, puertas batientes, otro reparto interior), copia la plantilla y modifica `compute()` (piezas y herrajes) y `build3D()` (geometría) de forma coherente: el despiece, el 3D y el presupuesto salen del mismo modelo y deben seguir coincidiendo. No dejes un entregable a medias.

## Flujo de trabajo

1. **Captura los datos.** Medidas del hueco (ancho, alto, fondo), alto del zócalo, módulos y su contenido, maletero, tipo de puertas, materiales, y país/moneda del presupuesto. Si el usuario ya los dio, no vuelvas a preguntarlos. Pregunta solo por lo que cambie el resultado. Una foto de referencia que se mencionó pero no llegó merece una línea avisándolo, no un bloqueo.
2. **Declara los supuestos antes de construir** y déjalos visibles dentro de la página (la plantilla ya los lista en la primera pestaña). Los más sensibles: cómo se interpreta el zócalo, cuánto fondo ocupan puertas y rieles, y que los precios son estimativos. El usuario necesita poder corregirlos sin leer código.
3. **Copia la plantilla** a una carpeta de trabajo, ajusta los valores por defecto (`DEF`, `LIM`, `PRICE_DEF`, textos) a este proyecto y, si hace falta, el modelo.
4. **Verifica antes de entregar.** Abre la página en un navegador headless (Playwright con Chromium; en el entorno de pruebas sirve el script de Three.js desde un archivo local con `page.route`). Confirma que no hay errores de consola, que las tablas coinciden con el modelo, que al cambiar una medida todo se recalcula, y mira capturas del 3D con puertas cerradas, módulo abierto, cajones abiertos e interior. Revisa también en ancho de móvil.
5. **Entrega**: publica la página (artifact u otro medio que el entorno ofrezca), deja el archivo en el repo si hay uno y resume en pocas líneas las medidas calculadas, el total del presupuesto, y lo que el usuario debe revisar (supuestos, precios).

## Decisiones de diseño que importan (y por qué)

- **Riel triple y puertas.** Con 3 hojas en 3 carriles solo se pueden abrir 2 módulos de ancho, y con 2 carriles se accede a 2 de 3 módulos. En el 3D, los botones «Abrir módulo 1/2/3» muestran un módulo a la vez, porque abrir las tres hojas a la vez es un estado físicamente imposible que confunde. Al abrir cajones, la hoja que tapa el módulo central debe correrse; si no, el cajón atraviesa la puerta.
- **Módulos que entren por la puerta.** Los módulos van separados del zócalo y del maletero para que su alto no supere la puerta de ingreso. La página avisa si alguno no pasa.
- **Fondo útil.** Descuenta del fondo del hueco lo que ocupan puertas y riel (80 mm con riel triple). De ahí salen el largo de corredera de cajón y los fondos de pieza.
- **Optimizador de corte.** Usa MaxRects con trazo de sierra y refilado. No garantiza cortes tipo guillotina, así que la página lo dice: lo que vale es la cantidad de placas, y el aserradero puede reordenar. Las piezas con veta (símil roble) no se rotan.
- **Cantidades de herrajes** salen de las piezas (no de estimaciones sueltas): minifix por unión, clavijas por estante, perfiles de aluminio por corte lineal en barras de 3 m, etc.
- **Precios.** Nunca los presentes como verificados. Van en una tabla editable dentro de la página, en la moneda que pida el usuario (el caso original fue USD), con aviso de que son estimativos. Si el usuario da sus cotizaciones, ponlas como valores por defecto.

## Errores ya cometidos (no los repitas)

- Calcular la cantidad de prendas de ropa de ejemplo con el largo de colgado en vez del ancho del módulo (salían el doble de prendas).
- Encuadre de cámara que cortaba el mueble: escala la distancia con el alto, el ancho y el fondo del hueco, no con un valor fijo.
- Tablas demasiado anchas para el panel: junta cantidad y unidad, y deja que las observaciones se partan en líneas.
- Mensaje contradictorio de la puerta de ingreso (decía que entraba y a la vez que no): evalúa alto y ancho por separado y emite un solo mensaje coherente.

## Entregable final

Una página con estas pestañas: Medidas (con resultado del cálculo, advertencias y supuestos), Despiece, Corte por placa (dibujo por placa + tabla), Materiales, Compras y presupuesto (precios editables, copiar CSV) y Armado. El 3D vive en el panel izquierdo y se actualiza en vivo.
