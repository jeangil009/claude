import {
  DollarSign,
  Calendar,
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Download
} from 'lucide-react';
import { EVMMetrics, ChartDataPoint, ActivitySummary, TrendAnalysis, Project } from '../../types';
import { formatCurrency, formatPercent, formatIndex } from '../../utils/evmCalculations';
import { exportActivitiesCsv, exportMetricsCsv, exportFullReport } from '../../utils/exportUtils';
import { MetricCard } from './MetricCard';
import { HealthIndicator } from './HealthIndicator';
import { ProgressBar, ComparisonBars } from './ProgressBar';
import { FormulaCard } from './FormulaCard';
import { RecommendationsCard } from './RecommendationsCard';
import { SCurveChart } from '../charts/SCurveChart';
import { PerformanceGauge } from '../charts/PerformanceGauge';
import { VarianceChart } from '../charts/VarianceChart';
import { ProjectionChart } from '../charts/ProjectionChart';
import { TCPIIndicator } from '../charts/TCPIIndicator';
import { PerformanceTrendChart } from '../charts/PerformanceTrendChart';

interface DashboardProps {
  project: Project;
  metrics: EVMMetrics;
  chartData: ChartDataPoint[];
  activitySummaries: ActivitySummary[];
  trends: TrendAnalysis;
  recommendations: string[];
}

export function Dashboard({
  project,
  metrics,
  chartData,
  activitySummaries,
  trends,
  recommendations
}: DashboardProps) {
  // Preparar fórmulas para mostrar
  const basicFormulas = [
    {
      name: 'PV (Valor Planificado)',
      formula: 'Costo presupuestado del trabajo programado',
      description: 'Cuánto deberíamos haber gastado según el plan',
      value: formatCurrency(metrics.PV, project.currency)
    },
    {
      name: 'EV (Valor Ganado)',
      formula: 'BAC × % Completado',
      description: 'Valor del trabajo realmente completado',
      value: formatCurrency(metrics.EV, project.currency),
      interpretation: `${formatPercent(metrics.percentComplete)} del proyecto completado`
    },
    {
      name: 'AC (Costo Real)',
      formula: 'Suma de costos reales incurridos',
      description: 'Cuánto hemos gastado realmente',
      value: formatCurrency(metrics.AC, project.currency)
    },
    {
      name: 'BAC (Presupuesto Total)',
      formula: 'Budget at Completion',
      description: 'Presupuesto total del proyecto',
      value: formatCurrency(metrics.BAC, project.currency)
    }
  ];

  const varianceFormulas = [
    {
      name: 'CV (Varianza de Costo)',
      formula: 'CV = EV - AC',
      description: 'Diferencia entre valor ganado y costo real',
      value: formatCurrency(metrics.CV, project.currency),
      interpretation: metrics.CV >= 0 ? 'Bajo presupuesto' : 'Sobre presupuesto'
    },
    {
      name: 'SV (Varianza de Cronograma)',
      formula: 'SV = EV - PV',
      description: 'Diferencia entre valor ganado y planificado',
      value: formatCurrency(metrics.SV, project.currency),
      interpretation: metrics.SV >= 0 ? 'Adelantado' : 'Retrasado'
    }
  ];

  const indexFormulas = [
    {
      name: 'CPI (Índice de Costo)',
      formula: 'CPI = EV / AC',
      description: 'Eficiencia del gasto',
      value: formatIndex(metrics.CPI),
      interpretation: metrics.CPI >= 1 ? 'Por cada $1 gastado, ganamos $' + formatIndex(metrics.CPI) : 'Por cada $1 ganado, gastamos $' + formatIndex(1/metrics.CPI)
    },
    {
      name: 'SPI (Índice de Cronograma)',
      formula: 'SPI = EV / PV',
      description: 'Eficiencia del cronograma',
      value: formatIndex(metrics.SPI),
      interpretation: metrics.SPI >= 1 ? 'Avanzando más rápido de lo planeado' : 'Avanzando más lento de lo planeado'
    }
  ];

  const projectionFormulas = [
    {
      name: 'EAC (Estimación al Completar)',
      formula: 'EAC = BAC / CPI',
      description: 'Costo total estimado del proyecto',
      value: formatCurrency(metrics.EAC_typical, project.currency)
    },
    {
      name: 'ETC (Estimación para Completar)',
      formula: 'ETC = EAC - AC',
      description: 'Costo restante estimado',
      value: formatCurrency(metrics.ETC, project.currency)
    },
    {
      name: 'VAC (Varianza al Completar)',
      formula: 'VAC = BAC - EAC',
      description: 'Diferencia proyectada con el presupuesto',
      value: formatCurrency(metrics.VAC, project.currency),
      interpretation: metrics.VAC >= 0 ? 'Ahorro proyectado' : 'Sobrecosto proyectado'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header del proyecto */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
              <HealthIndicator health={metrics.overallHealth} />
            </div>
            <p className="text-gray-500 mt-1">{project.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {project.startDate} - {project.plannedEndDate}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {formatCurrency(project.budget, project.currency)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-sm text-gray-500">Progreso General</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatPercent(metrics.percentComplete)}
              </p>
            </div>
            <div className="w-48">
              <ProgressBar
                value={metrics.percentComplete}
                variant={
                  metrics.percentComplete >= 75 ? 'success' :
                  metrics.percentComplete >= 50 ? 'info' :
                  metrics.percentComplete >= 25 ? 'warning' : 'default'
                }
                showPercentage={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botones de exportacion */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => exportFullReport(project, metrics, activitySummaries)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Reporte Completo (CSV)
        </button>
        <button
          onClick={() => exportActivitiesCsv(project)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar Actividades
        </button>
        <button
          onClick={() => exportMetricsCsv(project, metrics)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar Metricas
        </button>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Valor Ganado (EV)"
          value={formatCurrency(metrics.EV, project.currency)}
          subtitle={`${formatPercent(metrics.percentComplete)} completado`}
          icon={<TrendingUp className="w-5 h-5" />}
          variant="success"
        />
        <MetricCard
          title="Costo Real (AC)"
          value={formatCurrency(metrics.AC, project.currency)}
          subtitle={`${formatPercent(metrics.percentSpent)} del presupuesto`}
          icon={<DollarSign className="w-5 h-5" />}
          variant={metrics.CV >= 0 ? 'info' : 'danger'}
        />
        <MetricCard
          title="CPI"
          value={formatIndex(metrics.CPI)}
          subtitle="Indice de Desempeno de Costo"
          trend={metrics.CPI >= 1 ? 'up' : 'down'}
          trendValue={metrics.CPI >= 1 ? 'Eficiente' : 'Ineficiente'}
          icon={<Target className="w-5 h-5" />}
          variant={metrics.CPI >= 1 ? 'success' : 'danger'}
        />
        <MetricCard
          title="SPI"
          value={formatIndex(metrics.SPI)}
          subtitle="Indice de Desempeno de Cronograma"
          trend={metrics.SPI >= 1 ? 'up' : 'down'}
          trendValue={metrics.SPI >= 1 ? 'A tiempo' : 'Retrasado'}
          icon={<Clock className="w-5 h-5" />}
          variant={metrics.SPI >= 1 ? 'success' : 'warning'}
        />
      </div>

      {/* Varianzas */}
      <div className="grid md:grid-cols-2 gap-4">
        <MetricCard
          title="Varianza de Costo (CV)"
          value={formatCurrency(metrics.CV, project.currency)}
          subtitle="CV = EV - AC"
          icon={metrics.CV >= 0 ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          variant={metrics.CV >= 0 ? 'success' : 'danger'}
          size="lg"
        />
        <MetricCard
          title="Varianza de Cronograma (SV)"
          value={formatCurrency(metrics.SV, project.currency)}
          subtitle="SV = EV - PV"
          icon={metrics.SV >= 0 ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          variant={metrics.SV >= 0 ? 'success' : 'warning'}
          size="lg"
        />
      </div>

      {/* Gráfica de Curva S */}
      <SCurveChart data={chartData} currency={project.currency} />

      {/* Tendencia CPI/SPI - Nueva visualizacion */}
      <PerformanceTrendChart data={chartData} />

      {/* Gauges de rendimiento */}
      <div className="grid md:grid-cols-2 gap-6">
        <PerformanceGauge
          value={metrics.CPI}
          label="CPI - Indice de Costo"
          description="Eficiencia en el uso del presupuesto"
        />
        <PerformanceGauge
          value={metrics.SPI}
          label="SPI - Indice de Cronograma"
          description="Eficiencia en el cumplimiento del cronograma"
        />
      </div>

      {/* Comparación de valores */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Comparacion de Valores</h3>
        <ComparisonBars
          items={[
            { label: 'Valor Planificado (PV)', value: metrics.PV, color: 'bg-blue-500' },
            { label: 'Valor Ganado (EV)', value: metrics.EV, color: 'bg-green-500' },
            { label: 'Costo Real (AC)', value: metrics.AC, color: 'bg-red-500' },
            { label: 'Presupuesto (BAC)', value: metrics.BAC, color: 'bg-gray-400' }
          ]}
          max={metrics.BAC}
          currency={project.currency}
        />
      </div>

      {/* Varianzas por actividad */}
      <div className="grid md:grid-cols-2 gap-6">
        <VarianceChart
          activities={activitySummaries}
          type="cost"
          currency={project.currency}
        />
        <VarianceChart
          activities={activitySummaries}
          type="schedule"
          currency={project.currency}
        />
      </div>

      {/* Proyecciones */}
      <ProjectionChart metrics={metrics} currency={project.currency} />

      {/* TCPI */}
      <TCPIIndicator metrics={metrics} />

      {/* Fórmulas */}
      <div className="grid md:grid-cols-2 gap-4">
        <FormulaCard title="Valores Base" formulas={basicFormulas} defaultExpanded />
        <FormulaCard title="Varianzas" formulas={varianceFormulas} />
        <FormulaCard title="Indices de Desempeno" formulas={indexFormulas} />
        <FormulaCard title="Proyecciones" formulas={projectionFormulas} />
      </div>

      {/* Recomendaciones */}
      <RecommendationsCard recommendations={recommendations} />

      {/* Análisis de tendencias */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Analisis de Tendencias</h3>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Tendencia CPI</p>
            <p className={`text-lg font-semibold mt-1 ${
              trends.cpiTrend === 'improving' ? 'text-green-600' :
              trends.cpiTrend === 'declining' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trends.cpiTrend === 'improving' ? 'Mejorando' :
               trends.cpiTrend === 'declining' ? 'Declinando' : 'Estable'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Tendencia SPI</p>
            <p className={`text-lg font-semibold mt-1 ${
              trends.spiTrend === 'improving' ? 'text-green-600' :
              trends.spiTrend === 'declining' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trends.spiTrend === 'improving' ? 'Mejorando' :
               trends.spiTrend === 'declining' ? 'Declinando' : 'Estable'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Costo Final Proyectado</p>
            <p className="text-lg font-semibold mt-1 text-gray-900">
              {formatCurrency(trends.projectedFinalCost, project.currency)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Nivel de Riesgo</p>
            <p className={`text-lg font-semibold mt-1 ${
              trends.riskLevel === 'low' ? 'text-green-600' :
              trends.riskLevel === 'medium' ? 'text-amber-600' :
              trends.riskLevel === 'high' ? 'text-orange-600' : 'text-red-600'
            }`}>
              {trends.riskLevel === 'low' ? 'Bajo' :
               trends.riskLevel === 'medium' ? 'Medio' :
               trends.riskLevel === 'high' ? 'Alto' : 'Critico'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
