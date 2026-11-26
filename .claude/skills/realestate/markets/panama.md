# Módulo de Mercado: PANAMÁ

Este módulo SOBREESCRIBE los supuestos de EE.UU. (MLS, ZIP, sq ft, 1031, FHA, depreciación 27.5 años, regla del 70%, GreatSchools, Zillow/Redfin) cuando el mercado detectado es Panamá. Todo lo que este módulo no sobreescriba sigue la metodología normal de la skill.

## 0. Regla de oro: datos verificados

Cada cifra legal, tributaria o de mercado de este módulo trae un nivel de confianza:

- **[A]** Alta: conocimiento estable. Usar, pero citar la fuente cuando se consulte.
- **[M]** Media: probablemente correcto, puede haber cambiado. Confirmar con WebSearch antes de usar en un cálculo.
- **[V]** Verificar: no usar en cálculos hasta confirmarlo con fuente oficial (DGI, MEF, Registro Público, MIVIOT, Migración, bancos). Si no se logra confirmar, mostrarlo como **"supuesto no verificado"** y NUNCA presentarlo como dato.

Nunca inventar precios, tasas, cap rates, rendimientos ni artículos de ley. Si no hay dato, decirlo y proponer un supuesto razonable, documentado y editable.

## 1. Detección del mercado

Activar modo Panamá si ocurre cualquiera de estas condiciones (o el usuario usa `--pa`):

- La dirección menciona Panamá, Ciudad de Panamá, Panamá Oeste, Colón, Chiriquí, Coclé, Herrera, Los Santos, Veraguas, Bocas del Toro, Darién, Guna Yala, o términos como corregimiento, distrito, provincia, PH (propiedad horizontal), finca, folio real, urbanización, calle + casa/apartamento.
- Barrios o zonas conocidas: Punta Pacífica, Costa del Este, Santa María, San Francisco, Bella Vista, Obarrio, El Cangrejo, Marbella, Casco Viejo, Clayton, Albrook, Panamá Pacífico (Howard), Costa Sur, Condado del Rey, Betania, Brisas del Golf, Juan Díaz, Pueblo Nuevo, Tocumen, Arraiján, La Chorrera, Coronado, Gorgona, Buenaventura, Pedasí, Boquete, Volcán, Bocas del Toro.
- Precios en USD/B/. con unidades en m².

El modo `--us` fuerza el modo EE.UU. Si hay ambigüedad (por ejemplo "Panama City, FL"), preguntar al usuario.

## 2. Formato, idioma y unidades

- Idioma de salida: español técnico. Traducir los encabezados de las plantillas. Mantener los nombres de archivo `PROPERTY-*.md` para que `/realestate report-pdf` los siga encontrando.
- Moneda: USD (el balboa B/. circula a la par con el dólar [A]). Formato panameño: punto decimal, coma de miles (USD 250,000.00).
- Superficie en **m²**, no sq ft. Distinguir siempre **m² de construcción**, **m² de terreno** y, en PH, **m² de área cerrada y área abierta (balcón/terraza)**. Precio por m² = precio / m² de construcción (o área cerrada en PH). Convertir sq ft a m² dividiendo entre 10.7639 si la fuente trae pies cuadrados.
- Distancias en km y tiempos de viaje en hora pico (la movilidad en Panamá se mide en tiempo, no en distancia).
- Sin marca ni membrete de empresa en ningún entregable salvo que el usuario lo pida expresamente.

## 3. Tipos de propiedad y título

| Concepto | Qué hacer |
|---|---|
| Finca con título (folio real, Registro Público) | Es la base de cualquier análisis financiable. Exigir número de finca/folio real, titular, gravámenes y anotaciones. |
| **Derecho posesorio** (sin título) | **Riesgo ALTO.** No es propiedad titulada, normalmente no es hipotecable y es difícil de vender. Marcar como red flag crítica y reducir fuertemente el score de valor y de mercado. Verificar ruta de titulación con ANATI. |
| Propiedad Horizontal (PH) | Regida por la Ley 31 de 1998 [M]. Revisar reglamento de copropiedad, cuota de mantenimiento, morosidad, restricciones a alquiler corto y a mascotas, fondo de reserva. |
| Casa en urbanización | Revisar servidumbres, junta comunal/asociación de propietarios, estado de calles y servicios. |
| Lote / terreno | Zonificación (códigos de uso de suelo MIVIOT o Municipio, por ejemplo RE, RM1, RM2, RM3, C1, C2) [V], acceso, agua IDAAN, electricidad, linderos y plano catastral ANATI. |
| Zonas de seguridad fronteriza, islas, costa | Pueden tener restricciones de propiedad o régimen de concesión. Verificar caso por caso [V]. |
| Obra nueva / preventa | Analizar al promotor (trayectoria, litigios), fideicomiso de garantía, plan de pagos, fecha de entrega y penalidades [V]. |

## 4. Costos de transacción (compra y venta)

| Concepto | Valor de referencia | Confianza |
|---|---|---|
| Impuesto de Transferencia de Bienes Inmuebles (ITBI) | 2% sobre el mayor entre precio de venta y valor registrado/catastral. Lo paga el vendedor por convención. | [M] |
| Ganancia de capital (vendedor) | 10% sobre la ganancia; en la práctica se anticipa un 3% del precio de venta y luego se ajusta. | [M] |
| Comisión del corredor | Usualmente cerca de 5% pagado por el vendedor, negociable, más ITBMS 7% sobre la comisión. Verificar licencia del corredor (Junta Técnica de Bienes Raíces). | [M] |
| ITBMS en primera venta de obra nueva por promotor | Puede aplicar sobre parte del precio. Confirmar con DGI antes de modelar. | [V] |
| Registro Público, notaría, paz y salvos, avalúo, comisión de apertura de hipoteca | Gastos del comprador. Modelar como porcentaje supuesto y marcarlo como tal hasta tener cotización real. | [V] |

Los comparables de EE.UU. usan precio de cierre público. En Panamá NO existe un MLS público: la mayoría de los comparables son **precios de oferta** y el valor declarado en escritura puede diferir del precio real. Por eso: usar precios de oferta, aplicar un **descuento de negociación** supuesto (rango 0%–10%, documentado como supuesto) y marcar la confianza del análisis de comps como Baja si hay menos de 5 comparables.

## 5. Costos de tenencia anuales

- **Impuesto de Inmueble (IBI)**: escala progresiva sobre el valor catastral. Referencia residencial: primeros B/. 30,000 exentos, 0.5% de 30,001 a 75,000, 0.7% de 75,001 a 150,000, 1.0% sobre 150,000 [M]. Los inmuebles no residenciales tienen escalas más altas [V]. Existen exoneraciones para vivienda nueva con condiciones y vigencia cambiantes [V].
- **Cuota de mantenimiento PH**: dato obligatorio del anuncio o de la administración. Es el gasto operativo más grande en apartamentos. Calcular como USD/m²/mes y comparar con edificios similares.
- Seguro de la propiedad: estimar según valor de reposición. Marcar como supuesto si no hay cotización.
- Agua (IDAAN) y electricidad: gastos del inquilino salvo pacto. En condominios, el agua suele ir incluida en la cuota.
- Sin "HOA" ni "property tax" de EE.UU.: usar IBI + cuota de mantenimiento.

## 6. Alquiler

- Moneda USD por mes. Residencial de largo plazo usa contratos de arrendamiento regulados (Dirección de Arrendamientos del MIVIOT, protección al inquilino, desalojos con proceso formal). Verificar el régimen vigente antes de proyectar aumentos o desalojos [V]. Depósito de garantía usual de 1 a 2 meses [M].
- **ITBMS 7%**: el alquiler de inmuebles comerciales está gravado; el residencial está exento [M].
- Alquiler de corta estancia (Airbnb): primero revisar el reglamento de la PH (muchas lo prohíben) y los requisitos de la Autoridad de Turismo de Panamá (ATP) y de impuestos de hospedaje [V]. Si no se puede confirmar que es legal, marcar el escenario como no viable.
- **Supuestos por defecto (editables, NO son datos de mercado):** vacancia 10%, administración 8–10% (aunque se autoadministre), mantenimiento 5–8%, CapEx 5%. En algunos corredores de apartamentos ha habido sobreoferta histórica: validar vacancia y tiempo de colocación con datos actuales antes de bajar la vacancia.
- Rendimiento bruto y neto se calculan con los alquileres comparables encontrados. NO aplicar la "regla del 1%" ni los umbrales de cap rate de EE.UU. como verdad absoluta: re-escalar el score contra los rendimientos de los comparables locales y declarar la re-escala.

## 7. Financiamiento

- Hipoteca con banco local (Banco General, Banistmo, BAC, Global Bank, Banesco, entre otros). Las tasas, el LTV y el plazo cambian por banco y por perfil: **consultar tasas vigentes con WebSearch o pedir al usuario la cotización**; no usar tasas de EE.UU.
- Referencias típicas, a confirmar [M]: plazo de hasta 30 años, tasa frecuentemente revisable (variable) según el banco, LTV menor para extranjeros o no residentes.
- Régimen de **interés preferencial** para vivienda principal hasta cierto valor: verificar topes, vigencia y requisitos con MIVIOT y bancos [V]. Aplica a vivienda principal, no a inversión.
- Residencia por inversión inmobiliaria: existe un monto mínimo de inversión (referencia US$300,000) [V]. Confirmar con Migración antes de mencionarlo al cliente.
- No usar FHA, VA, conventional 30yr fixed ni 1031 exchange. Reemplazar por hipoteca bancaria local, pago contado y financiamiento de promotor en preventa.

## 8. Impuestos sobre la renta de alquiler

- ISR persona natural: tramos 0% hasta 11,000; 15% de 11,001 a 50,000; 25% sobre 50,000 [M]. ISR persona jurídica: 25% sobre renta neta gravable [M].
- **No usar depreciación de 27.5 años (régimen de EE.UU.).** El tratamiento de depreciación y deducciones del alquiler para ISR debe validarse con un contador panameño. Mostrar el flujo antes de impuestos y una línea separada "ISR estimado (supuesto)".

## 9. Ajustes por estrategia

| Estrategia EE.UU. | Adaptación Panamá |
|---|---|
| Buy & Hold | Válida. Ajustar costos, IBI, cuota PH, ISR y vacancia. |
| BRRRR | Poco habitual: el refinanciamiento con retiro de efectivo es menos común. Marcar viabilidad baja salvo que un banco lo confirme. Reportar el "efectivo atrapado" en lugar de asumir 75% del ARV. |
| Fix & Flip | Válida con cautela. Reemplazar la regla del 70% por margen neto objetivo sobre costo total, incluyendo ITBI, ganancia de capital, comisión y costos de venta. Costos de rehabilitación: usar presupuestos locales (en proyectos del Ingeniero, apoyarse en las skills `presupuestos-apu` y `costos-cgr-panama`, aclarando que la base CGR es de obra pública y puede diferir del mercado privado). |
| (No existe en EE.UU.) | **Preventa / cesión de contrato**: comprar en planos con plan de pagos y vender o hipotecar a la entrega. Analizar solvencia del promotor, fideicomiso, retrasos, penalidades y diferencia entre precio de preventa y precio de entrega comparable. |
| Comercial | Cap rate sobre NOI neto de ITBMS. Revisar plazo del contrato, garantías, ubicación respecto a flujo vehicular y zonificación. Costo de reposición: usar base de costos local y reglamento estructural vigente (REP-2021). |

## 10. Sustituciones en el análisis de vecindario

| Dimensión original | En Panamá evaluar |
|---|---|
| Escuelas (GreatSchools) | Colegios privados bilingües y públicos cercanos, universidades, hospitales y clínicas. No hay ranking único oficial: describir la oferta sin inventar puntajes. |
| Crimen | Estadísticas del Ministerio Público y MINSEG si existen, percepción de seguridad por corregimiento, vigilancia del PH o urbanización, iluminación y accesos. |
| Walk Score | Movilidad: Metro de Panamá (estado actual de Líneas 1, 2 y 3), corredores, tiempos de viaje en hora pico a polos de empleo, caminabilidad real. |
| Demografía | INEC y Contraloría General (censos), perfil de ingresos por corregimiento. |
| Crecimiento | Proyectos de infraestructura, nuevos desarrollos, cambios de zonificación, expansión del Canal y de zonas logísticas. |
| Riesgos naturales | Inundación por lluvias, deslizamientos, sismicidad (cumplimiento del reglamento estructural), calidad y continuidad del agua (IDAAN), zonas costeras y erosión. Panamá está fuera de la ruta usual de huracanes. |

## 11. Fuentes de datos

Consultar con WebSearch y WebFetch. Las búsquedas se hacen en español.

- Listados y alquileres: Encuentra24 Panamá, Compreoalquile, portales de corredoras (Century 21, RE/MAX), Facebook Marketplace, MercadoLibre Inmuebles.
- Alquiler corta estancia: Airbnb y AirDNA, siempre contrastado con el reglamento de la PH.
- Registros y trámites: Registro Público de Panamá (certificado de folio real), ANATI (catastro, planos, titulación), MIVIOT (zonificación, arrendamientos), DGI/MEF (IBI, ISR, ITBMS), Migración.
- Estadísticas: INEC y Contraloría General, Superintendencia de Bancos (cifras de crédito hipotecario), Cámara Panameña de la Construcción (CAPAC), reportes de consultoras inmobiliarias locales.
- Verificar siempre la fecha del dato y citar la URL.

## 12. Lista de debida diligencia (incluir en toda salida de Panamá)

1. Certificado del Registro Público: titular, folio real, gravámenes, hipotecas, embargos, anotaciones.
2. Confirmar que NO es derecho posesorio o, si lo es, el plan de titulación.
3. Paz y salvos: IDAAN, IBI/DGI y cuota de mantenimiento PH.
4. Plano catastral y linderos (ANATI); verificar que los m² del anuncio coinciden con el título.
5. Uso de suelo/zonificación vigente y permisos de construcción y ocupación (planos aprobados, final de obra).
6. Reglamento de PH y actas, morosidad del edificio, derramas aprobadas o previstas.
7. Inspección estructural y de sistemas por profesional idóneo. Avalúo por perito independiente.
8. Litigios (consulta judicial) y solvencia del vendedor o del promotor.
9. Debida diligencia AML/KYC: los corredores y notarios son sujetos obligados bajo la normativa de prevención de blanqueo de capitales (Ley 23 de 2015) [V].
10. Revisión final por abogado panameño. Este análisis no sustituye asesoría legal ni tributaria.

## 13. Descargo de responsabilidad (usar en español en toda salida)

Este análisis es informativo y no constituye asesoría financiera, legal ni tributaria. Las cifras marcadas como supuesto o sin verificar deben confirmarse con corredor licenciado, abogado, contador y avaluador idóneo antes de tomar cualquier decisión de compra o inversión.
