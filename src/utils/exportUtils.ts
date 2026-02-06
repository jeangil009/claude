import { Project, EVMMetrics, ActivitySummary } from '../types';
import { formatCurrency, formatPercent, formatIndex } from './evmCalculations';

function escapeCsvField(field: string | number): string {
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function arrayToCsv(headers: string[], rows: (string | number)[][]): string {
  const headerLine = headers.map(escapeCsvField).join(',');
  const dataLines = rows.map(row => row.map(escapeCsvField).join(','));
  return [headerLine, ...dataLines].join('\n');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob(['\uFEFF' + content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportActivitiesCsv(project: Project) {
  const headers = [
    'WBS', 'Actividad', 'Categoria', 'Responsable',
    'Fecha Inicio Plan', 'Fecha Fin Plan',
    'Costo Planificado', 'Costo Real', '% Completado',
    'Valor Ganado (EV)', 'Varianza de Costo (CV)'
  ];

  const rows = project.activities.map(act => {
    const ev = act.plannedCost * (act.percentComplete / 100);
    const cv = ev - act.actualCost;
    return [
      act.wbsCode,
      act.name,
      act.category,
      act.responsable,
      act.plannedStartDate,
      act.plannedEndDate,
      act.plannedCost,
      act.actualCost,
      act.percentComplete,
      Math.round(ev),
      Math.round(cv)
    ];
  });

  const csv = arrayToCsv(headers, rows);
  const filename = `actividades-${project.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csv, filename, 'text/csv');
}

export function exportMetricsCsv(project: Project, metrics: EVMMetrics) {
  const headers = ['Metrica', 'Valor', 'Interpretacion'];

  const rows: (string | number)[][] = [
    ['BAC (Presupuesto Total)', formatCurrency(metrics.BAC, project.currency), 'Presupuesto original del proyecto'],
    ['PV (Valor Planificado)', formatCurrency(metrics.PV, project.currency), 'Trabajo que deberia estar hecho'],
    ['EV (Valor Ganado)', formatCurrency(metrics.EV, project.currency), 'Valor del trabajo completado'],
    ['AC (Costo Real)', formatCurrency(metrics.AC, project.currency), 'Costo real incurrido'],
    ['CV (Varianza de Costo)', formatCurrency(metrics.CV, project.currency), metrics.CV >= 0 ? 'Bajo presupuesto' : 'Sobre presupuesto'],
    ['SV (Varianza de Cronograma)', formatCurrency(metrics.SV, project.currency), metrics.SV >= 0 ? 'Adelantado' : 'Retrasado'],
    ['CPI (Indice de Costo)', formatIndex(metrics.CPI), metrics.CPI >= 1 ? 'Eficiente en costos' : 'Ineficiente en costos'],
    ['SPI (Indice de Cronograma)', formatIndex(metrics.SPI), metrics.SPI >= 1 ? 'A tiempo o adelantado' : 'Retrasado'],
    ['EAC Tipico', formatCurrency(metrics.EAC_typical, project.currency), 'BAC / CPI'],
    ['EAC Atipico', formatCurrency(metrics.EAC_atypical, project.currency), 'AC + (BAC - EV)'],
    ['EAC Combinado', formatCurrency(metrics.EAC_combined, project.currency), 'AC + (BAC-EV)/(CPI*SPI)'],
    ['ETC (Estimacion para Completar)', formatCurrency(metrics.ETC, project.currency), 'EAC - AC'],
    ['VAC (Varianza al Completar)', formatCurrency(metrics.VAC, project.currency), metrics.VAC >= 0 ? 'Ahorro proyectado' : 'Sobrecosto proyectado'],
    ['TCPI (BAC)', formatIndex(metrics.TCPI_BAC), 'Eficiencia requerida vs presupuesto original'],
    ['TCPI (EAC)', formatIndex(metrics.TCPI_EAC), 'Eficiencia requerida vs nuevo presupuesto'],
    ['% Completado', formatPercent(metrics.percentComplete), ''],
    ['% Gastado', formatPercent(metrics.percentSpent), ''],
  ];

  const csv = arrayToCsv(headers, rows);
  const filename = `metricas-evm-${project.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csv, filename, 'text/csv');
}

export function exportFullReport(project: Project, metrics: EVMMetrics, summaries: ActivitySummary[]) {
  const sections: string[] = [];

  // Project info
  sections.push('REPORTE EVM - ' + project.name);
  sections.push('Fecha de generacion: ' + new Date().toLocaleDateString('es-MX'));
  sections.push('Cliente: ' + project.client);
  sections.push('Ubicacion: ' + project.location);
  sections.push('');

  // Metrics summary
  const metricsHeaders = ['Metrica', 'Valor'];
  const metricsRows: (string | number)[][] = [
    ['BAC', formatCurrency(metrics.BAC, project.currency)],
    ['PV', formatCurrency(metrics.PV, project.currency)],
    ['EV', formatCurrency(metrics.EV, project.currency)],
    ['AC', formatCurrency(metrics.AC, project.currency)],
    ['CV', formatCurrency(metrics.CV, project.currency)],
    ['SV', formatCurrency(metrics.SV, project.currency)],
    ['CPI', formatIndex(metrics.CPI)],
    ['SPI', formatIndex(metrics.SPI)],
    ['EAC', formatCurrency(metrics.EAC_typical, project.currency)],
    ['VAC', formatCurrency(metrics.VAC, project.currency)],
    ['% Completado', formatPercent(metrics.percentComplete)],
  ];
  sections.push(arrayToCsv(metricsHeaders, metricsRows));
  sections.push('');

  // Activities
  const actHeaders = ['WBS', 'Actividad', '% Completado', 'Planificado', 'Real', 'EV', 'CV'];
  const actRows = summaries.map(s => [
    s.wbsCode, s.name, s.percentComplete,
    s.plannedCost, s.actualCost, Math.round(s.earnedValue), Math.round(s.cv)
  ]);
  sections.push(arrayToCsv(actHeaders, actRows));

  const content = sections.join('\n');
  const filename = `reporte-evm-${project.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(content, filename, 'text/csv');
}
