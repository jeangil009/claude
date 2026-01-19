// Tipos para el Sistema de Valor Ganado (Earned Value Management)

export interface Activity {
  id: string;
  wbsCode: string;
  name: string;
  description: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  plannedCost: number; // BAC de la actividad
  actualCost: number; // AC
  percentComplete: number; // 0-100
  responsable: string;
  category: ActivityCategory;
}

export type ActivityCategory =
  | 'preliminares'
  | 'cimentacion'
  | 'estructura'
  | 'albanileria'
  | 'instalaciones_electricas'
  | 'instalaciones_hidraulicas'
  | 'acabados'
  | 'carpinteria'
  | 'pintura'
  | 'otros';

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  actualEndDate?: string;
  budget: number; // BAC total
  currency: string;
  status: ProjectStatus;
  activities: Activity[];
}

export type ProjectStatus = 'planificacion' | 'en_progreso' | 'pausado' | 'completado' | 'cancelado';

// Métricas de Valor Ganado
export interface EVMMetrics {
  // Valores base
  BAC: number;  // Budget at Completion - Presupuesto al completar
  PV: number;   // Planned Value - Valor Planificado
  EV: number;   // Earned Value - Valor Ganado
  AC: number;   // Actual Cost - Costo Real

  // Varianzas
  CV: number;   // Cost Variance = EV - AC
  SV: number;   // Schedule Variance = EV - PV

  // Índices de desempeño
  CPI: number;  // Cost Performance Index = EV / AC
  SPI: number;  // Schedule Performance Index = EV / PV

  // Proyecciones
  EAC_typical: number;    // Estimate at Completion (típico) = BAC / CPI
  EAC_atypical: number;   // EAC (atípico) = AC + (BAC - EV)
  EAC_combined: number;   // EAC (combinado) = AC + [(BAC - EV) / (CPI * SPI)]
  ETC: number;            // Estimate to Complete = EAC - AC
  VAC: number;            // Variance at Completion = BAC - EAC

  // Índice de rendimiento para completar
  TCPI_BAC: number;       // TCPI basado en BAC = (BAC - EV) / (BAC - AC)
  TCPI_EAC: number;       // TCPI basado en EAC = (BAC - EV) / (EAC - AC)

  // Porcentajes
  percentComplete: number;       // % Completado = EV / BAC * 100
  percentSpent: number;          // % Gastado = AC / BAC * 100
  percentScheduled: number;      // % Programado = PV / BAC * 100

  // Análisis de estado
  costStatus: PerformanceStatus;
  scheduleStatus: PerformanceStatus;
  overallHealth: ProjectHealth;
}

export type PerformanceStatus = 'under_budget' | 'on_budget' | 'over_budget';
export type ProjectHealth = 'excellent' | 'good' | 'warning' | 'critical';

// Datos para gráficas
export interface ChartDataPoint {
  period: string;
  date: string;
  PV: number;
  EV: number;
  AC: number;
  BAC: number;
  CPI: number;
  SPI: number;
}

export interface ProjectPeriodData {
  period: number;
  date: string;
  cumulativePV: number;
  cumulativeEV: number;
  cumulativeAC: number;
  periodPV: number;
  periodEV: number;
  periodAC: number;
}

// Formulario de nueva actividad
export interface ActivityFormData {
  wbsCode: string;
  name: string;
  description: string;
  plannedStartDate: string;
  plannedEndDate: string;
  plannedCost: number;
  responsable: string;
  category: ActivityCategory;
}

// Formulario de actualización de progreso
export interface ProgressUpdateData {
  activityId: string;
  percentComplete: number;
  actualCost: number;
  actualStartDate?: string;
  actualEndDate?: string;
  notes?: string;
}

// Reporte de EVM
export interface EVMReport {
  generatedAt: string;
  projectId: string;
  projectName: string;
  reportingPeriod: string;
  metrics: EVMMetrics;
  activities: ActivitySummary[];
  recommendations: string[];
  trends: TrendAnalysis;
}

export interface ActivitySummary {
  id: string;
  name: string;
  wbsCode: string;
  percentComplete: number;
  plannedCost: number;
  earnedValue: number;
  actualCost: number;
  cv: number;
  sv: number;
  status: PerformanceStatus;
}

export interface TrendAnalysis {
  cpiTrend: 'improving' | 'stable' | 'declining';
  spiTrend: 'improving' | 'stable' | 'declining';
  projectedCompletionDate: string;
  projectedFinalCost: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

// Constantes para categorías
export const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  preliminares: 'Preliminares',
  cimentacion: 'Cimentación',
  estructura: 'Estructura',
  albanileria: 'Albañilería',
  instalaciones_electricas: 'Instalaciones Eléctricas',
  instalaciones_hidraulicas: 'Instalaciones Hidráulicas',
  acabados: 'Acabados',
  carpinteria: 'Carpintería',
  pintura: 'Pintura',
  otros: 'Otros'
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  planificacion: 'En Planificación',
  en_progreso: 'En Progreso',
  pausado: 'Pausado',
  completado: 'Completado',
  cancelado: 'Cancelado'
};
