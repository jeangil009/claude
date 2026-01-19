interface PerformanceGaugeProps {
  value: number;
  label: string;
  description?: string;
  min?: number;
  max?: number;
  thresholds?: {
    danger: number;
    warning: number;
    good: number;
  };
}

export function PerformanceGauge({
  value,
  label,
  description,
  min = 0.5,
  max = 1.5,
  thresholds = { danger: 0.9, warning: 0.95, good: 1.0 }
}: PerformanceGaugeProps) {
  // Normalizar valor al rango 0-180 grados
  const clampedValue = Math.max(min, Math.min(max, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;
  const rotation = (percentage / 100) * 180 - 90;

  // Determinar color basado en umbrales
  let color = '#10b981'; // green
  let bgColor = 'bg-green-100';
  let textColor = 'text-green-600';

  if (value < thresholds.danger) {
    color = '#ef4444'; // red
    bgColor = 'bg-red-100';
    textColor = 'text-red-600';
  } else if (value < thresholds.warning) {
    color = '#f59e0b'; // amber
    bgColor = 'bg-amber-100';
    textColor = 'text-amber-600';
  } else if (value < thresholds.good) {
    color = '#3b82f6'; // blue
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-600';
  }

  const getStatusText = () => {
    if (value < thresholds.danger) return 'Crítico';
    if (value < thresholds.warning) return 'Precaución';
    if (value < thresholds.good) return 'Aceptable';
    return 'Óptimo';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="text-center">
        <h3 className="font-semibold text-gray-900">{label}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>

      <div className="relative w-48 h-24 mx-auto mt-6 mb-4">
        {/* Fondo del gauge */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* Arco de fondo */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Zonas de color */}
          <path
            d="M 20 100 A 80 80 0 0 1 60 35"
            fill="none"
            stroke="#fecaca"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 60 35 A 80 80 0 0 1 100 20"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="20"
          />
          <path
            d="M 100 20 A 80 80 0 0 1 140 35"
            fill="none"
            stroke="#bbf7d0"
            strokeWidth="20"
          />
          <path
            d="M 140 35 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#86efac"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Aguja */}
          <g transform={`rotate(${rotation}, 100, 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="8" fill={color} />
            <circle cx="100" cy="100" r="4" fill="white" />
          </g>

          {/* Etiquetas */}
          <text x="20" y="95" className="text-xs" fill="#6b7280">{min}</text>
          <text x="95" y="15" className="text-xs" fill="#6b7280">1.0</text>
          <text x="175" y="95" className="text-xs" fill="#6b7280">{max}</text>
        </svg>
      </div>

      <div className="text-center">
        <div className={`text-3xl font-bold ${textColor}`}>
          {value.toFixed(2)}
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${bgColor} ${textColor}`}>
          {getStatusText()}
        </div>
      </div>
    </div>
  );
}
