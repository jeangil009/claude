interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'md',
  animated = true
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const variantStyles = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-indigo-500'
  };

  const bgStyles = {
    default: 'bg-blue-100',
    success: 'bg-green-100',
    warning: 'bg-amber-100',
    danger: 'bg-red-100',
    info: 'bg-indigo-100'
  };

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-500">{percentage.toFixed(1)}%</span>
          )}
        </div>
      )}
      <div className={`w-full ${bgStyles[variant]} rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`
            ${sizeStyles[size]} ${variantStyles[variant]} rounded-full
            ${animated ? 'transition-all duration-500 ease-out' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Componente para mostrar múltiples barras comparativas
interface ComparisonBarsProps {
  items: {
    label: string;
    value: number;
    color: string;
  }[];
  max: number;
  currency?: string;
}

export function ComparisonBars({ items, max, currency = 'MXN' }: ComparisonBarsProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <span className="text-sm text-gray-500">
              {new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0
              }).format(item.value)}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ease-out ${item.color}`}
              style={{ width: `${Math.min((item.value / max) * 100, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
