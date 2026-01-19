# EVM Pro - Sistema de Valor Ganado

Sistema profesional de **Earned Value Management (EVM)** para la gestión y control de proyectos de construcción, basado en los estándares PMBOK.

## Capturas de Pantalla

La aplicación incluye un dashboard completo con visualizaciones interactivas de todas las métricas de valor ganado.

## Características Principales

### Dashboard de Métricas
- Visualización en tiempo real de KPIs de proyecto
- Indicadores de salud del proyecto
- Gráficas interactivas con Recharts

### Fórmulas de Valor Ganado Implementadas

#### Valores Base
| Métrica | Fórmula | Descripción |
|---------|---------|-------------|
| **PV** | Valor Planificado | Costo presupuestado del trabajo programado |
| **EV** | BAC × % Completado | Valor del trabajo realmente completado |
| **AC** | Suma de costos reales | Costo real incurrido |
| **BAC** | Budget at Completion | Presupuesto total del proyecto |

#### Varianzas
| Métrica | Fórmula | Interpretación |
|---------|---------|----------------|
| **CV** | EV - AC | >0: Bajo presupuesto |
| **SV** | EV - PV | >0: Adelantado |

#### Índices de Desempeño
| Métrica | Fórmula | Interpretación |
|---------|---------|----------------|
| **CPI** | EV / AC | >1: Eficiente en costos |
| **SPI** | EV / PV | >1: Adelantado en cronograma |

#### Proyecciones
| Métrica | Fórmula | Descripción |
|---------|---------|-------------|
| **EAC (típico)** | BAC / CPI | Estimación al completar |
| **EAC (atípico)** | AC + (BAC - EV) | EAC asumiendo rendimiento normal |
| **EAC (combinado)** | AC + (BAC-EV)/(CPI×SPI) | EAC considerando ambos índices |
| **ETC** | EAC - AC | Estimación para completar |
| **VAC** | BAC - EAC | Varianza al completar |
| **TCPI** | (BAC-EV)/(BAC-AC) | Índice de desempeño para completar |

### Gráficas Incluidas
- **Curva S**: Comparación de PV, EV y AC a lo largo del tiempo
- **Gauges de Rendimiento**: Visualización de CPI y SPI
- **Gráficas de Varianza**: CV y SV por actividad
- **Proyecciones de EAC**: Comparación de diferentes métodos

### Gestión de Actividades
- CRUD completo de actividades del proyecto
- Categorización por tipo de trabajo (cimentación, estructura, acabados, etc.)
- Actualización de progreso y costos reales
- Búsqueda y filtrado avanzado

### Configuración de Proyecto
- Información general del proyecto
- Gestión de presupuesto
- Exportación de datos en JSON
- Múltiples monedas soportadas

## Tecnologías Utilizadas

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS v4** - Estilos
- **Recharts** - Gráficas
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── charts/          # Componentes de gráficas
│   │   ├── SCurveChart.tsx
│   │   ├── PerformanceGauge.tsx
│   │   ├── VarianceChart.tsx
│   │   ├── ProjectionChart.tsx
│   │   └── TCPIIndicator.tsx
│   ├── dashboard/       # Componentes del dashboard
│   │   ├── Dashboard.tsx
│   │   ├── MetricCard.tsx
│   │   ├── HealthIndicator.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── FormulaCard.tsx
│   │   └── RecommendationsCard.tsx
│   ├── forms/           # Formularios y tablas
│   │   ├── ActivityForm.tsx
│   │   ├── ActivitiesTable.tsx
│   │   └── ProjectSettings.tsx
│   └── layout/          # Componentes de layout
│       └── Header.tsx
├── data/
│   └── sampleProject.ts # Datos de ejemplo
├── hooks/
│   └── useProject.ts    # Hook principal de gestión
├── types/
│   └── index.ts         # Definiciones de tipos
├── utils/
│   └── evmCalculations.ts # Cálculos de EVM
├── App.tsx
├── main.tsx
└── index.css
```

## Uso

1. **Dashboard**: Vista principal con todas las métricas, gráficas y recomendaciones
2. **Actividades**: Gestión de actividades del proyecto, actualización de progreso
3. **Configuración**: Ajustes del proyecto, exportación de datos

## Datos de Ejemplo

La aplicación incluye un proyecto de ejemplo de construcción de vivienda con:
- 21 actividades categorizadas
- Progreso parcial simulado
- Variaciones de costo y cronograma para demostración

## Basado en Estándares

Esta aplicación implementa la técnica de Valor Ganado según los estándares definidos en:
- **PMBOK Guide** (Project Management Body of Knowledge)
- **ANSI/EIA-748** (Earned Value Management Systems)

## Licencia

MIT License
