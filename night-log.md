# Registro de intentos

| paso | intento | cambio | test que falló + línea | resultado |
|------|---------|--------|------------------------|-----------|
| WIRE | — | vitest ^5.0.5 + vitest.config.ts + script test; 44 tests escritos antes de tocar código | línea base: 42 verdes / 2 rojos (R17 × 2: `expected +0 to be -500`, evmCalculations.test.ts:292 y :300) | rojo esperado |
| WIRE | — | línea base `npm run build` | — | verde (exit 0) |
| WIRE | — | línea base `npm run lint` | 27 errores, todos en src/components/** (ActivityForm, ActivitiesTable, SCurveChart, VarianceChart, ProjectSettings, HealthIndicator, ProjectionChart); 0 en zona de trabajo | rojo PREEXISTENTE, fuera de zona intocable → gate acotado documentado en HARNESS.md |
| R17 | 1 | generateActivitySummaries: pv = calculatePlannedValue({...project, activities:[activity]}, new Date()) en vez de EV | 2 rojos → 0 (vitest 44/44) | Builder verde |
| R17 | check | Checker (contexto limpio) corre vitest/build/eslint, revisa diff, añade 1 test para romperlo (actividad no iniciada, inicio exacto, 100 %, costo 0, sin contaminación entre actividades, no muta entrada) | vitest 45/45, build ok, eslint zona exit 0; verificado de nuevo por el orquestador | VERDE (marcado por Checker) |
| R18 | — | sin cambio de código | analyzeTrends: `(100 - percentComplete) / SPI` mezcla puntos porcentuales con días. Corregir exige duración planificada/fecha fin (no están en EVMMetrics) → nueva firma o dato extra | BLOQUEADO: espera tu sí a cambio de firma. Los 7 tests de invariantes (100 %→hoy, SPI≤0→999, monotonía, tendencias, riesgo, costo final) pasan |
| — | — | sospechas 3 (nombres 'under_budget' en cronograma), 4 (EV/AC futuros interpolados en generateSCurveData), 5 (formatCurrency MXN por defecto) | — | solo documentadas, fuera de zona / esperan tu sí |
