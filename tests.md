# Requisitos → tests

Comando: `npx vitest run` (archivos: `src/utils/*.test.ts`)
Estado: pendiente | verde | rojo | bloqueado. "Prueba" = salida real pegada en night-log.md.

| id | requisito | test (describe) | estado | prueba |
|----|-----------|-----------------|--------|--------|
| R01 | CV = EV − AC | R01 CV | verde | vitest 45/45 (night-log) |
| R02 | SV = EV − PV | R02 SV | verde | vitest 45/45 (night-log) |
| R03 | CPI = EV/AC; AC=0 → Infinity si EV>0, 1 si EV=0 | R03 CPI | verde | vitest 45/45 (night-log) |
| R04 | SPI = EV/PV; PV=0 → Infinity si EV>0, 1 si EV=0 | R04 SPI | verde | vitest 45/45 (night-log) |
| R05 | EAC típico = BAC/CPI; CPI=0 → Infinity | R05 EAC típico | verde | vitest 45/45 (night-log) |
| R06 | EAC atípico = AC + (BAC − EV) | R06 EAC atípico | verde | vitest 45/45 (night-log) |
| R07 | EAC combinado = AC + (BAC−EV)/(CPI×SPI); denominador 0 → Infinity | R07 EAC combinado | verde | vitest 45/45 (night-log) |
| R08 | ETC = EAC − AC | R08 ETC | verde | vitest 45/45 (night-log) |
| R09 | VAC = BAC − EAC | R09 VAC | verde | vitest 45/45 (night-log) |
| R10 | TCPI_BAC = (BAC−EV)/(BAC−AC); BAC−AC ≤ 0 → Infinity | R10 TCPI_BAC | verde | vitest 45/45 (night-log) |
| R11 | TCPI_EAC = (BAC−EV)/(EAC−AC); EAC−AC ≤ 0 → Infinity | R11 TCPI_EAC | verde | vitest 45/45 (night-log) |
| R12 | EV por actividad = costo × %/100 y total del proyecto; AC total | R12 EV y AC | verde | vitest 45/45 (night-log) |
| R13 | PV: antes del inicio 0, en curso prorrateado, en la fecha fin y después = costo completo | R13 PV | verde | vitest 45/45 (night-log) |
| R14 | Umbrales de estado costo/cronograma: >1.05 / ≥0.95 / <0.95 | R14 estados | verde | vitest 45/45 (night-log) |
| R15 | Salud: promedio ≥1.0 excellent, ≥0.9 good, ≥0.8 warning, si no critical | R15 salud | verde | vitest 45/45 (night-log) |
| R16 | calculateAllEVMMetrics coherente (identidades VAC, ETC, % ) | R16 métricas | verde | vitest 45/45 (night-log) |
| R17 | Resumen de actividad: sv = EV − PV real de la actividad (sospecha 1) | R17 resúmenes | verde | rojo→verde; Checker + test extra, 45/45 |
| R18 | analyzeTrends: días restantes en días, no puntos porcentuales (sospecha 2) | R18 tendencias | parcial / BLOQUEADO | invariantes verdes; la corrección de unidades exige cambio de firma (ver night-log) |
| R19 | formatCurrency: USD por defecto, locale es-PA, sin decimales, respeta otra moneda | R19 formatCurrency USD | verde | vitest 68/68 (night-log) |
| R20 | Datos de ejemplo y proyecto vacío usan USD | R20 monedas por defecto | verde | vitest 68/68 (night-log) |
| R21 | Persistencia: guardar y cargar devuelve el mismo proyecto, con sobre versionado | R21 persistencia ida y vuelta | verde | vitest 68/68 (night-log) |
| R22 | Persistencia: datos corruptos, versión distinta o forma inválida → null (nunca lanza) | R22 persistencia datos inválidos | verde | vitest 68/68 (night-log) |
| R23 | Persistencia: storage que falla o inexistente → no lanza; save devuelve false | R23 persistencia tolerante a fallos | verde | vitest 68/68 (night-log) |
| R24 | UI: editar → recargar conserva el cambio; "Restaurar datos de ejemplo" vuelve al ejemplo; todo en USD | verificación en navegador (Checker) | verde | Checker en Chromium real, escenarios a–g (night-log) |
