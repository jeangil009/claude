import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  variant = 'default',
  size = 'md'
}: MetricCardProps) {
  const variantStyles = {
    default: 'bg-white border-gray-200',
    success: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
    warning: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200',
    danger: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200',
    info: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
  };

  const iconBgStyles = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600'
  };

  const sizeStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const valueSizeStyles = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <div className={`
      rounded-xl border ${variantStyles[variant]} ${sizeStyles[size]}
      card-hover shadow-sm
    `}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className={`font-bold text-gray-900 ${valueSizeStyles[size]}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-2 rounded-lg ${iconBgStyles[variant]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
