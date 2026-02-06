import { memo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ChartDataPoint } from '../../types';

interface PerformanceTrendChartProps {
  data: ChartDataPoint[];
}

export const PerformanceTrendChart = memo(function PerformanceTrendChart({ data }: PerformanceTrendChartProps) {
  const filteredData = data.filter(d => d.EV > 0 || d.AC > 0);

  if (filteredData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 text-lg">Tendencia CPI / SPI</h3>
        <p className="text-sm text-gray-500 mt-2">No hay datos suficientes para mostrar tendencias.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">Tendencia CPI / SPI</h3>
          <p className="text-sm text-gray-500 mt-1">
            Evolucion de indices de desempeno a lo largo del proyecto
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-600">CPI (Costo)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-violet-500" />
            <span className="text-gray-600">SPI (Cronograma)</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              domain={[0.5, 1.5]}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={1}
              stroke="#6b7280"
              strokeDasharray="5 5"
              label={{ value: 'Meta (1.0)', position: 'right', fill: '#6b7280', fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="CPI"
              name="CPI"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4, fill: '#10b981' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="SPI"
              name="SPI"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#8b5cf6' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500 font-medium">Interpretacion CPI</p>
          <p className="text-gray-700 mt-1">&gt; 1.0 = Bajo presupuesto | &lt; 1.0 = Sobre presupuesto</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500 font-medium">Interpretacion SPI</p>
          <p className="text-gray-700 mt-1">&gt; 1.0 = Adelantado | &lt; 1.0 = Retrasado</p>
        </div>
      </div>
    </div>
  );
});
