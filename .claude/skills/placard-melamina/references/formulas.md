# Fórmulas, conteos y precios base

Medidas en mm. Todas están implementadas en `compute()` de `assets/placard-template.html`; si cambias una regla, cámbiala allí y aquí.

## Constantes del caso base
Espesor de melamina t = 18. Fondo de fibroplus 3 mm en ranura de 3,2 × 6 mm a 10 mm del borde trasero. Trazo de sierra 3. Refilado 5 por borde de placa. Luz de 3 por pared. Fondo ocupado por puertas y riel triple 80. Perfil de aluminio de hoja 25, el panel entra 8 en el perfil. Superposición entre hojas 25. Cajón: paso 200 (frente = paso − 3), caja de 140 de alto, corredera lateral de 12,5.

## Dimensiones derivadas
- Ancho total útil `Wtot = W − 2·3`. Ancho de módulo `Wm = floor(Wtot / 3)`.
- Alto de módulo `Hm = H − Zócalo − Maletero`. Fondo de módulo `Dm = D − 80`.
- Interior: `iw = Wm − 2t`, `ih = Hm − 2t`.
- Hoja: ancho `floor((Wtot + 2·25) / 3)`, alto `H − 60`. Panel: hoja − 2·25 + 2·8 en cada sentido, veta en el sentido del alto.
- Corredera de cajón: la mayor de 250–550 (paso 50) que sea ≤ `Dm − t − 25`.
- Barral de ropa larga a 60 bajo la tapa; ropa corta: barral superior a 60 y el inferior 1.000 más abajo.

## Despiece por pieza (largo × ancho)
- Lateral de módulo `Hm × Dm` (×2). Tapa y base `iw × Dm`. Fondo `(ih+10) × (iw+10)` en fibroplus.
- Estante `(iw−2) × (Dm−20)`.
- Frente de cajón `(iw−4) × 197` (×3, canto en 4 lados). Lateral de cajón `corredera × 140` (×6). Trasero `(extW−2t) × 120`, con `extW = iw − 25`. Fondo de cajón `(extW−2t+10) × (corredera−12)` en fibroplus.
- Maletero: laterales `Dm × M` (×2), tapa y base `(Wtot−2t) × Dm`, 2 divisores `Dm × (M−2t)` sobre las uniones de módulos, fondo único `(Wtot−2t+10) × (M−2t+10)`.
- Zócalo (base): 2 travesaños `Wtot × Z` y 4 transversales `(Dm−2t) × Z`.
- Puertas: 3 paneles símil roble.

Canto PVC 0,45 mm en el frente de laterales, tapas, bases y estantes, y en los 4 lados de los frentes de cajón. Compra +10 % de desperdicio.

## Herrajes (cantidades)
- Minifix con tarugo: `por_unión = max(2, ceil(Dm/200))`; módulos `3·4·por_unión`, maletero `8·por_unión`; compra +10 %.
- Confirmat 7×50 del zócalo: 8 + 2 de repuesto. Clavijas de estante: 4 por estante + 4.
- Correderas: 3 pares. Tiradores: 3. Barrales: se cortan a `iw` y se agrupan en barras de 3 m; 2 soportes por barral.
- Perfiles de aluminio de hoja: por hoja 2 verticales y 2 horizontales, agrupados en barras de 3 m con primer ajuste decreciente.
- Rieles superior e inferior triples: barras de 3 m, cortados a `W − 4`. Carros: 2 superiores y 2 inferiores por hoja.
- Fijación: 12 escuadras con tarugo, 16 tornillos de unión de módulos, 40 tornillos de cajón, 1 cola, 3 topes/guías, 1 juego de burlete.

## Precios base del caso original (USD, estimativos, no verificados)
Melamina blanca 18 mm 65 por placa; símil roble 85; fibroplus 3 mm 18; canto 0,35 por m; minifix con tarugo 0,50; corredera 450 mm 8 por par; barral oval 30×15 de 3 m 11; riel triple de 3 m 22 (superior) y 20 (inferior); perfil de aluminio de 3 m 16; carro 2,50; servicio de corte 4 por placa y canteado 0,45 por m. Imprevistos del 10 % sobre materiales. Sustitúyelos por las cotizaciones del usuario cuando las tenga.

Pesos orientativos para avisos: melamina 18 mm ≈ 12 kg/m²; perfil de aluminio ≈ 0,9 kg/m. Avisa si una hoja supera ~30 kg (carga típica de carros: 30–40 kg).
