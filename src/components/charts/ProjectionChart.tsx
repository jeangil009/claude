import { EVMMetrics } from '../../types';
import { DEFAULT_CURRENCY, formatCurrency as formatMoney } from '../../utils/evmCalculations';

interface ProjectionChartProps {
  metrics: EVMMetrics;
  currency?: string;
}

export function ProjectionChart({ metrics, currency = DEFAULT_CURRENCY }: ProjectionChartProps) {
  // Datos para la gráfica de comparación de EAC
  const eacComparison = [
    { name: 'BAC Original', value: metrics.BAC, color: '#3b82f6' },
    { name: 'EAC Típico', value: metrics.EAC_typical, color: '#10b981' },
    { name: 'EAC Atípico', value: metrics.EAC_atypical, color: '#f59e0b' },
    { name: 'EAC Combinado', value: metrics.EAC_combined, color: '#8b5cf6' },
  ];

  const formatCurrency = (value: number) => formatMoney(value, currency);

  const formatCompact = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const maxValue = Math.max(...eacComparison.map(e => e.value));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 text-lg">Proyecciones de Costo Final</h3>
        <p className="text-sm text-gray-500 mt-1">
          Estimaciones al Completar (EAC) según diferentes métodos
        </p>
      </div>

      {/* Comparación de EAC */}
      <div className="space-y-4 mb-6">
        {eacComparison.map((item, index) => {
          const width = (item.value / maxValue) * 100;
          const difference = item.value - metrics.BAC;
          const isOriginal = item.name === 'BAC Original';

          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  {!isOriginal && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      difference <= 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {difference <= 0 ? '' : '+'}{formatCompact(difference)}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.value)}
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${width}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
                {isOriginal && (
                  <div
                    className="absolute top-0 h-3 w-0.5 bg-gray-900"
                    style={{ left: `${(metrics.BAC / maxValue) * 100}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla de resumen */}
      <div className="border-t border-gray-100 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Estimación para Completar (ETC)</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {formatCurrency(metrics.ETC)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Costo restante estimado</p>
          </div>
          <div className={`rounded-lg p-4 ${
            metrics.VAC >= 0 ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <p className="text-sm text-gray-500">Varianza al Completar (VAC)</p>
            <p className={`text-xl font-bold mt-1 ${
              metrics.VAC >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {formatCurrency(metrics.VAC)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.VAC >= 0 ? 'Ahorro proyectado' : 'Sobrecosto proyectado'}
            </p>
          </div>
        </div>
      </div>

      {/* Fórmulas */}
      <div className="border-t border-gray-100 mt-4 pt-4">
        <p className="text-xs text-gray-500 font-medium mb-2">Fórmulas utilizadas:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 font-mono">
          <div>EAC(típico) = BAC / CPI</div>
          <div>EAC(atípico) = AC + (BAC - EV)</div>
          <div>EAC(combinado) = AC + (BAC-EV)/(CPI×SPI)</div>
          <div>ETC = EAC - AC</div>
        </div>
      </div>
    </div>
  );
}
