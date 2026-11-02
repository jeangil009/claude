/**
 * Módulo de Cálculos de Valor Ganado (Earned Value Management)
 *
 * Implementa todas las fórmulas estándar de EVM según el PMBOK
 */

import {
  Activity,
  Project,
  EVMMetrics,
  PerformanceStatus,
  ProjectHealth,
  ChartDataPoint,
  ActivitySummary,
  TrendAnalysis
} from '../types';
import { differenceInDays, parseISO, format, addDays, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Calcula el Valor Planificado (PV) para una fecha específica
 * PV = Costo presupuestado del trabajo programado
 */
export function calculatePlannedValue(project: Project, asOfDate: Date): number {
  let pv = 0;

  project.activities.forEach(activity => {
    const startDate = parseISO(activity.plannedStartDate);
    const endDate = parseISO(activity.plannedEndDate);

    if (isBefore(asOfDate, startDate)) {
      // La actividad aún no debería haber comenzado
      return;
    }

    if (isAfter(asOfDate, endDate) || asOfDate.getTime() === endDate.getTime()) {
      // La actividad debería estar completa
      pv += activity.plannedCost;
    } else {
      // La actividad está en progreso - prorratear
      const totalDays = differenceInDays(endDate, startDate) || 1;
      const elapsedDays = differenceInDays(asOfDate, startDate);
      const progress = Math.min(elapsedDays / totalDays, 1);
      pv += activity.plannedCost * progress;
    }
  });

  return pv;
}

/**
 * Calcula el Valor Ganado (EV) de una actividad
 * EV = BAC × % Completado
 */
export function calculateEarnedValue(activity: Activity): number {
  return activity.plannedCost * (activity.percentComplete / 100);
}

/**
 * Calcula el Valor Ganado total del proyecto
 */
export function calculateTotalEarnedValue(project: Project): number {
  return project.activities.reduce((total, activity) => {
    return total + calculateEarnedValue(activity);
  }, 0);
}

/**
 * Calcula el Costo Real total del proyecto
 */
export function calculateTotalActualCost(project: Project): number {
  return project.activities.reduce((total, activity) => {
    return total + activity.actualCost;
  }, 0);
}

/**
 * Calcula la Varianza de Costo (CV)
 * CV = EV - AC
 * CV > 0: Bajo presupuesto
 * CV < 0: Sobre presupuesto
 */
export function calculateCostVariance(ev: number, ac: number): number {
  return ev - ac;
}

/**
 * Calcula la Varianza de Cronograma (SV)
 * SV = EV - PV
 * SV > 0: Adelantado
 * SV < 0: Retrasado
 */
export function calculateScheduleVariance(ev: number, pv: number): number {
  return ev - pv;
}

/**
 * Calcula el Índice de Desempeño de Costo (CPI)
 * CPI = EV / AC
 * CPI > 1: Eficiente en costos
 * CPI < 1: Ineficiente en costos
 */
export function calculateCPI(ev: number, ac: number): number {
  if (ac === 0) return ev > 0 ? Infinity : 1;
  return ev / ac;
}

/**
 * Calcula el Índice de Desempeño de Cronograma (SPI)
 * SPI = EV / PV
 * SPI > 1: Adelantado
 * SPI < 1: Retrasado
 */
export function calculateSPI(ev: number, pv: number): number {
  if (pv === 0) return ev > 0 ? Infinity : 1;
  return ev / pv;
}

/**
 * Calcula la Estimación al Completar (EAC) - Método Típico
 * EAC = BAC / CPI
 * Asume que el rendimiento de costos continuará igual
 */
export function calculateEACTypical(bac: number, cpi: number): number {
  if (cpi === 0) return Infinity;
  return bac / cpi;
}

/**
 * Calcula la Estimación al Completar (EAC) - Método Atípico
 * EAC = AC + (BAC - EV)
 * Asume que el rendimiento futuro será según lo planificado
 */
export function calculateEACAtypical(ac: number, bac: number, ev: number): number {
  return ac + (bac - ev);
}

/**
 * Calcula la Estimación al Completar (EAC) - Método Combinado
 * EAC = AC + [(BAC - EV) / (CPI × SPI)]
 * Considera tanto el rendimiento de costos como el cronograma
 */
export function calculateEACCombined(ac: number, bac: number, ev: number, cpi: number, spi: number): number {
  const denominator = cpi * spi;
  if (denominator === 0) return Infinity;
  return ac + ((bac - ev) / denominator);
}

/**
 * Calcula la Estimación para Completar (ETC)
 * ETC = EAC - AC
 */
export function calculateETC(eac: number, ac: number): number {
  return eac - ac;
}

/**
 * Calcula la Varianza al Completar (VAC)
 * VAC = BAC - EAC
 * VAC > 0: Terminará bajo presupuesto
 * VAC < 0: Terminará sobre presupuesto
 */
export function calculateVAC(bac: number, eac: number): number {
  return bac - eac;
}

/**
 * Calcula el Índice de Desempeño para Completar basado en BAC (TCPI_BAC)
 * TCPI = (BAC - EV) / (BAC - AC)
 * Indica la eficiencia requerida para completar dentro del presupuesto original
 */
export function calculateTCPI_BAC(bac: number, ev: number, ac: number): number {
  const denominator = bac - ac;
  if (denominator <= 0) return Infinity;
  return (bac - ev) / denominator;
}

/**
 * Calcula el Índice de Desempeño para Completar basado en EAC (TCPI_EAC)
 * TCPI = (BAC - EV) / (EAC - AC)
 * Indica la eficiencia requerida para completar dentro del nuevo presupuesto estimado
 */
export function calculateTCPI_EAC(bac: number, ev: number, eac: number, ac: number): number {
  const denominator = eac - ac;
  if (denominator <= 0) return Infinity;
  return (bac - ev) / denominator;
}

/**
 * Determina el estado del desempeño de costos
 */
export function getCostStatus(cpi: number): PerformanceStatus {
  if (cpi > 1.05) return 'under_budget';
  if (cpi >= 0.95) return 'on_budget';
  return 'over_budget';
}

/**
 * Determina el estado del desempeño del cronograma
 */
export function getScheduleStatus(spi: number): PerformanceStatus {
  if (spi > 1.05) return 'under_budget'; // Adelantado
  if (spi >= 0.95) return 'on_budget';   // En tiempo
  return 'over_budget';                   // Retrasado
}

/**
 * Determina la salud general del proyecto
 */
export function getProjectHealth(cpi: number, spi: number): ProjectHealth {
  const avgIndex = (cpi + spi) / 2;

  if (avgIndex >= 1.0) return 'excellent';
  if (avgIndex >= 0.9) return 'good';
  if (avgIndex >= 0.8) return 'warning';
  return 'critical';
}

/**
 * Calcula todas las métricas de EVM para un proyecto
 */
export function calculateAllEVMMetrics(project: Project, asOfDate: Date = new Date()): EVMMetrics {
  const BAC = project.budget;
  const PV = calculatePlannedValue(project, asOfDate);
  const EV = calculateTotalEarnedValue(project);
  const AC = calculateTotalActualCost(project);

  const CV = calculateCostVariance(EV, AC);
  const SV = calculateScheduleVariance(EV, PV);

  const CPI = calculateCPI(EV, AC);
  const SPI = calculateSPI(EV, PV);

  const EAC_typical = calculateEACTypical(BAC, CPI);
  const EAC_atypical = calculateEACAtypical(AC, BAC, EV);
  const EAC_combined = calculateEACCombined(AC, BAC, EV, CPI, SPI);

  const ETC = calculateETC(EAC_typical, AC);
  const VAC = calculateVAC(BAC, EAC_typical);

  const TCPI_BAC = calculateTCPI_BAC(BAC, EV, AC);
  const TCPI_EAC = calculateTCPI_EAC(BAC, EV, EAC_typical, AC);

  const percentComplete = BAC > 0 ? (EV / BAC) * 100 : 0;
  const percentSpent = BAC > 0 ? (AC / BAC) * 100 : 0;
  const percentScheduled = BAC > 0 ? (PV / BAC) * 100 : 0;

  const costStatus = getCostStatus(CPI);
  const scheduleStatus = getScheduleStatus(SPI);
  const overallHealth = getProjectHealth(CPI, SPI);

  return {
    BAC,
    PV,
    EV,
    AC,
    CV,
    SV,
    CPI,
    SPI,
    EAC_typical,
    EAC_atypical,
    EAC_combined,
    ETC,
    VAC,
    TCPI_BAC,
    TCPI_EAC,
    percentComplete,
    percentSpent,
    percentScheduled,
    costStatus,
    scheduleStatus,
    overallHealth
  };
}

/**
 * Genera datos para la gráfica de Curva S
 */
export function generateSCurveData(project: Project, periods: number = 12): ChartDataPoint[] {
  const startDate = parseISO(project.startDate);
  const endDate = parseISO(project.plannedEndDate);
  const totalDays = differenceInDays(endDate, startDate);
  const daysPerPeriod = Math.ceil(totalDays / periods);

  const data: ChartDataPoint[] = [];

  for (let i = 0; i <= periods; i++) {
    const currentDate = addDays(startDate, i * daysPerPeriod);
    const pv = calculatePlannedValue(project, currentDate);

    // Para EV y AC, usamos los valores reales hasta la fecha actual
    // y proyectamos para fechas futuras
    const today = new Date();
    let ev = 0;
    let ac = 0;

    if (isBefore(currentDate, today) || currentDate.getTime() === today.getTime()) {
      ev = calculateTotalEarnedValue(project) * (i / periods);
      ac = calculateTotalActualCost(project) * (i / periods);
    }

    const cpi = ac > 0 ? ev / ac : 1;
    const spi = pv > 0 ? ev / pv : 1;

    data.push({
      period: `P${i}`,
      date: format(currentDate, 'dd/MM/yyyy', { locale: es }),
      PV: Math.round(pv),
      EV: Math.round(ev),
      AC: Math.round(ac),
      BAC: project.budget,
      CPI: Number(cpi.toFixed(2)),
      SPI: Number(spi.toFixed(2))
    });
  }

  return data;
}

/**
 * Genera resumen de actividades para reportes
 */
export function generateActivitySummaries(project: Project): ActivitySummary[] {
  const asOfDate = new Date();
  return project.activities.map(activity => {
    const ev = calculateEarnedValue(activity);
    // PV real de la actividad a la fecha de corte (antes se igualaba al EV, dejando sv siempre en 0)
    const pv = calculatePlannedValue({ ...project, activities: [activity] }, asOfDate);
    const cv = ev - activity.actualCost;
    const sv = ev - pv;
    const cpi = activity.actualCost > 0 ? ev / activity.actualCost : 1;

    return {
      id: activity.id,
      name: activity.name,
      wbsCode: activity.wbsCode,
      percentComplete: activity.percentComplete,
      plannedCost: activity.plannedCost,
      earnedValue: ev,
      actualCost: activity.actualCost,
      cv,
      sv,
      status: getCostStatus(cpi)
    };
  });
}

/**
 * Analiza tendencias del proyecto
 */
export function analyzeTrends(
  currentMetrics: EVMMetrics,
  historicalData: ChartDataPoint[]
): TrendAnalysis {
  // Analizar tendencia del CPI
  let cpiTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (historicalData.length >= 3) {
    const recentCPIs = historicalData.slice(-3).map(d => d.CPI);
    const cpiChange = recentCPIs[2] - recentCPIs[0];
    if (cpiChange > 0.05) cpiTrend = 'improving';
    else if (cpiChange < -0.05) cpiTrend = 'declining';
  }

  // Analizar tendencia del SPI
  let spiTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (historicalData.length >= 3) {
    const recentSPIs = historicalData.slice(-3).map(d => d.SPI);
    const spiChange = recentSPIs[2] - recentSPIs[0];
    if (spiChange > 0.05) spiTrend = 'improving';
    else if (spiChange < -0.05) spiTrend = 'declining';
  }

  // Calcular fecha proyectada de finalización
  const daysRemaining = currentMetrics.SPI > 0
    ? Math.ceil((100 - currentMetrics.percentComplete) / currentMetrics.SPI)
    : 999;
  const projectedCompletionDate = format(
    addDays(new Date(), daysRemaining),
    'dd/MM/yyyy',
    { locale: es }
  );

  // Determinar nivel de riesgo
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (currentMetrics.CPI < 0.8 || currentMetrics.SPI < 0.8) riskLevel = 'critical';
  else if (currentMetrics.CPI < 0.9 || currentMetrics.SPI < 0.9) riskLevel = 'high';
  else if (currentMetrics.CPI < 0.95 || currentMetrics.SPI < 0.95) riskLevel = 'medium';

  return {
    cpiTrend,
    spiTrend,
    projectedCompletionDate,
    projectedFinalCost: currentMetrics.EAC_typical,
    riskLevel
  };
}

/**
 * Genera recomendaciones basadas en las métricas
 */
export function generateRecommendations(metrics: EVMMetrics): string[] {
  const recommendations: string[] = [];

  // Recomendaciones de costos
  if (metrics.CPI < 0.9) {
    recommendations.push('⚠️ El proyecto está significativamente sobre presupuesto. Considere revisar los costos unitarios y buscar eficiencias.');
  } else if (metrics.CPI < 0.95) {
    recommendations.push('📊 El proyecto muestra una ligera desviación de costos. Monitoree de cerca las próximas actividades.');
  } else if (metrics.CPI > 1.1) {
    recommendations.push('✅ Excelente desempeño de costos. Verifique que la calidad no se vea comprometida.');
  }

  // Recomendaciones de cronograma
  if (metrics.SPI < 0.9) {
    recommendations.push('⚠️ El proyecto está significativamente retrasado. Considere agregar recursos o reducir alcance.');
  } else if (metrics.SPI < 0.95) {
    recommendations.push('📅 El proyecto muestra un ligero retraso. Identifique las actividades críticas y acelere si es posible.');
  } else if (metrics.SPI > 1.1) {
    recommendations.push('✅ El proyecto va adelantado. Aproveche para revisar calidad y documentación.');
  }

  // TCPI recomendaciones
  if (metrics.TCPI_BAC > 1.2) {
    recommendations.push('🔴 El índice TCPI indica que será muy difícil cumplir el presupuesto original. Considere solicitar fondos adicionales.');
  } else if (metrics.TCPI_BAC > 1.1) {
    recommendations.push('🟡 Se requiere mejorar la eficiencia para cumplir el presupuesto. Implemente medidas de control de costos.');
  }

  // Recomendaciones generales
  if (metrics.overallHealth === 'critical') {
    recommendations.push('🚨 El proyecto requiere intervención inmediata. Convoque una reunión de crisis con todos los stakeholders.');
  } else if (metrics.overallHealth === 'warning') {
    recommendations.push('⚡ El proyecto necesita atención. Revise el plan y tome acciones correctivas.');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ El proyecto marcha según lo planificado. Continúe con el monitoreo regular.');
  }

  return recommendations;
}

/**
 * Formatea un número como moneda
 */
export const DEFAULT_CURRENCY = 'USD';

// Locale panameño: punto decimal, coma de miles. Con USD imprime "USD 1,234".
const CURRENCY_LOCALE = 'es-PA';

export function formatCurrency(value: number, currency: string = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Formatea un porcentaje
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formatea un índice
 */
export function formatIndex(value: number): string {
  if (!isFinite(value)) return 'N/A';
  return value.toFixed(2);
}
