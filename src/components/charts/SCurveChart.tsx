import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ChartDataPoint } from '../../types';

interface SCurveChartProps {
  data: ChartDataPoint[];
  currency?: string;
}

interface TooltipEntry {
  color?: string;
  name?: string | number;
  value?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  currency: string;
}

function CustomTooltip({ active, payload, label, currency }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">
              {new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0
              }).format(entry.value ?? 0)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function SCurveChart({ data, currency = 'MXN' }: SCurveChartProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">Curva S - Valor Ganado</h3>
          <p className="text-sm text-gray-500 mt-1">
            Comparación de PV, EV y AC a lo largo del proyecto
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600">PV (Planificado)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600">EV (Ganado)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600">AC (Real)</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Legend />

            {/* Línea de BAC (Budget at Completion) */}
            {data.length > 0 && (
              <ReferenceLine
                y={data[0].BAC}
                stroke="#9ca3af"
                strokeDasharray="5 5"
                label={{
                  value: 'BAC',
                  position: 'right',
                  fill: '#6b7280',
                  fontSize: 12
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="PV"
              name="Valor Planificado (PV)"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="EV"
              name="Valor Ganado (EV)"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4, fill: '#10b981' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="AC"
              name="Costo Real (AC)"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4, fill: '#ef4444' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
