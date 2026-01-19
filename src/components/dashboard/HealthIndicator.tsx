import { ProjectHealth } from '../../types';
import { CheckCircle2, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';

interface HealthIndicatorProps {
  health: ProjectHealth;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function HealthIndicator({ health, size = 'md', showLabel = true }: HealthIndicatorProps) {
  const config = {
    excellent: {
      icon: CheckCircle2,
      label: 'Excelente',
      color: 'text-green-600',
      bg: 'bg-green-100',
      border: 'border-green-200'
    },
    good: {
      icon: CheckCircle2,
      label: 'Bueno',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-blue-200'
    },
    warning: {
      icon: AlertTriangle,
      label: 'Precaución',
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      border: 'border-amber-200'
    },
    critical: {
      icon: XCircle,
      label: 'Crítico',
      color: 'text-red-600',
      bg: 'bg-red-100',
      border: 'border-red-200'
    }
  };

  const sizeStyles = {
    sm: { icon: 'w-4 h-4', text: 'text-xs', padding: 'px-2 py-1' },
    md: { icon: 'w-5 h-5', text: 'text-sm', padding: 'px-3 py-1.5' },
    lg: { icon: 'w-6 h-6', text: 'text-base', padding: 'px-4 py-2' }
  };

  const { icon: Icon, label, color, bg, border } = config[health];
  const styles = sizeStyles[size];

  return (
    <div className={`
      inline-flex items-center gap-2 rounded-full
      ${bg} ${border} ${color} ${styles.padding}
      border font-medium
    `}>
      <Icon className={styles.icon} />
      {showLabel && <span className={styles.text}>{label}</span>}
    </div>
  );
}
