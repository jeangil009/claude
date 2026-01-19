import { Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { EVMMetrics } from '../../types';

interface TCPIIndicatorProps {
  metrics: EVMMetrics;
}

export function TCPIIndicator({ metrics }: TCPIIndicatorProps) {
  const { TCPI_BAC, TCPI_EAC, CPI } = metrics;

  const getStatus = (tcpi: number) => {
    if (tcpi > 1.2) return { level: 'critical', text: 'Muy difícil de lograr', color: 'text-red-600', bg: 'bg-red-50' };
    if (tcpi > 1.1) return { level: 'warning', text: 'Desafiante', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (tcpi > 1.0) return { level: 'moderate', text: 'Requiere mejora', color: 'text-blue-600', bg: 'bg-blue-50' };
    return { level: 'good', text: 'Alcanzable', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const tcpiBacStatus = getStatus(TCPI_BAC);
  const tcpiEacStatus = getStatus(TCPI_EAC);

  const renderIndicator = (
    title: string,
    value: number,
    status: { level: string; text: string; color: string; bg: string },
    description: string,
    formula: string
  ) => (
    <div className={`rounded-lg p-4 ${status.bg}`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        {status.level === 'critical' ? (
          <AlertTriangle className={`w-5 h-5 ${status.color}`} />
        ) : status.level === 'good' ? (
          <CheckCircle className={`w-5 h-5 ${status.color}`} />
        ) : (
          <Target className={`w-5 h-5 ${status.color}`} />
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${status.color}`}>
            {isFinite(value) ? value.toFixed(2) : 'N/A'}
          </span>
          <span className={`text-sm ${status.color}`}>{status.text}</span>
        </div>

        {/* Barra visual */}
        <div className="mt-3 relative">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div className="bg-green-400 h-full" style={{ width: '33%' }} />
              <div className="bg-blue-400 h-full" style={{ width: '17%' }} />
              <div className="bg-amber-400 h-full" style={{ width: '17%' }} />
              <div className="bg-red-400 h-full" style={{ width: '33%' }} />
            </div>
          </div>
          {/* Marcador de posición */}
          {isFinite(value) && (
            <div
              className="absolute top-0 w-0.5 h-4 -mt-1 bg-gray-900"
              style={{
                left: `${Math.min(Math.max(((value - 0.8) / 0.6) * 100, 0), 100)}%`
              }}
            />
          )}
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>0.8</span>
            <span>1.0</span>
            <span>1.2</span>
            <span>1.4</span>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-600 font-mono bg-white/50 px-2 py-1 rounded">
          {formula}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Target className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            Índice de Desempeño para Completar (TCPI)
          </h3>
          <p className="text-sm text-gray-500">
            Eficiencia requerida para cumplir objetivos
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {renderIndicator(
          'TCPI basado en BAC',
          TCPI_BAC,
          tcpiBacStatus,
          'Eficiencia para cumplir presupuesto original',
          'TCPI = (BAC - EV) / (BAC - AC)'
        )}
        {renderIndicator(
          'TCPI basado en EAC',
          TCPI_EAC,
          tcpiEacStatus,
          'Eficiencia para cumplir nuevo presupuesto',
          'TCPI = (BAC - EV) / (EAC - AC)'
        )}
      </div>

      {/* Comparación con CPI actual */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">CPI Actual</p>
            <p className="text-xs text-gray-500">Desempeño de costo actual</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${CPI >= 1 ? 'text-green-600' : 'text-red-600'}`}>
              {CPI.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              {CPI >= TCPI_BAC
                ? 'Supera el TCPI requerido'
                : `Necesita mejorar ${((TCPI_BAC - CPI) * 100).toFixed(0)}%`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
