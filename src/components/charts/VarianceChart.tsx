import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts';
import { ActivitySummary } from '../../types';

interface VarianceChartProps {
  activities: ActivitySummary[];
  type: 'cost' | 'schedule';
  currency?: string;
}

interface VarianceTooltipPayload {
  payload: {
    fullName: string;
    name: string;
    variance: number;
  };
}

function CustomTooltip({ active, payload, type, currency }: {
  active?: boolean;
  payload?: VarianceTooltipPayload[];
  type: 'cost' | 'schedule';
  currency: string;
}) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900">{item.fullName}</p>
        <p className="text-sm text-gray-500">{item.name}</p>
        <div className="mt-2">
          <span className="text-sm text-gray-600">
            {type === 'cost' ? 'Varianza de Costo (CV)' : 'Varianza de Cronograma (SV)'}:
          </span>
          <span className={`ml-2 font-bold ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 0
            }).format(item.variance)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {item.variance >= 0
            ? (type === 'cost' ? 'Bajo presupuesto' : 'Adelantado')
            : (type === 'cost' ? 'Sobre presupuesto' : 'Retrasado')
          }
        </p>
      </div>
    );
  }
  return null;
}

export function VarianceChart({ activities, type, currency = 'MXN' }: VarianceChartProps) {
  const data = activities
    .filter(act => act.percentComplete > 0)
    .map(act => ({
      name: act.wbsCode,
      fullName: act.name,
      variance: type === 'cost' ? act.cv : act.sv,
      status: type === 'cost' ? act.status : (act.sv >= 0 ? 'under_budget' : 'over_budget')
    }))
    .sort((a, b) => a.variance - b.variance);

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000000).toFixed(1)}M`;
    }
    if (absValue >= 1000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const getBarColor = (value: number) => {
    if (value > 0) return '#10b981'; // green
    if (value < -50000) return '#ef4444'; // red
    return '#f59e0b'; // amber
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 text-lg">
          {type === 'cost' ? 'Varianza de Costo (CV)' : 'Varianza de Cronograma (SV)'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {type === 'cost'
            ? 'CV = EV - AC | Positivo = Bajo presupuesto'
            : 'SV = EV - PV | Positivo = Adelantado'
          }
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tickFormatter={formatCurrency}
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              width={50}
            />
            <Tooltip content={<CustomTooltip type={type} currency={currency} />} />
            <ReferenceLine x={0} stroke="#374151" strokeWidth={2} />
            <Bar dataKey="variance" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.variance)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-gray-600">Favorable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span className="text-gray-600">Moderado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-gray-600">Desfavorable</span>
        </div>
      </div>
    </div>
  );
}
