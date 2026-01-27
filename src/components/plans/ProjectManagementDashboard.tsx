import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  Calendar,
  DollarSign,
  Award,
  Users,
  MessageSquare,
  Shield,
  ShoppingCart,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import type { ProjectManagementPlan } from '../../types/pmbok';
import type { EVMMetrics } from '../../types';

interface ProjectManagementDashboardProps {
  projectPlan: ProjectManagementPlan;
  evmMetrics: EVMMetrics;
  onNavigateTo: (section: string) => void;
}

export function ProjectManagementDashboard({
  projectPlan,
  evmMetrics,
  onNavigateTo
}: ProjectManagementDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  // Plan navigation items
  const planItems = [
    {
      id: 'integration',
      name: 'Integración',
      icon: FileText,
      color: 'blue',
      description: 'Acta de Constitución y Control de Cambios',
      status: projectPlan.projectCharter?.approvedBy ? 'complete' : 'pending'
    },
    {
      id: 'scope',
      name: 'Alcance',
      icon: GitBranch,
      color: 'amber',
      description: 'EDT/WBS y Diccionario',
      status: 'active'
    },
    {
      id: 'schedule',
      name: 'Cronograma',
      icon: Calendar,
      color: 'indigo',
      description: 'Diagrama de Gantt y Ruta Crítica',
      status: 'active'
    },
    {
      id: 'cost',
      name: 'Costos',
      icon: DollarSign,
      color: 'green',
      description: 'Presupuesto y Valor Ganado',
      status: 'active'
    },
    {
      id: 'quality',
      name: 'Calidad',
      icon: Award,
      color: 'emerald',
      description: 'Métricas y Control de Calidad',
      status: 'active'
    },
    {
      id: 'resources',
      name: 'Recursos',
      icon: Users,
      color: 'purple',
      description: 'Equipo, Materiales y Equipos',
      status: 'active'
    },
    {
      id: 'communications',
      name: 'Comunicaciones',
      icon: MessageSquare,
      color: 'cyan',
      description: 'Matriz de Comunicaciones',
      status: 'pending'
    },
    {
      id: 'risks',
      name: 'Riesgos',
      icon: AlertTriangle,
      color: 'red',
      description: 'Matriz de Riesgos',
      status: 'active'
    },
    {
      id: 'procurement',
      name: 'Adquisiciones',
      icon: ShoppingCart,
      color: 'orange',
      description: 'Contratos y Proveedores',
      status: 'pending'
    },
    {
      id: 'stakeholders',
      name: 'Interesados',
      icon: UserCheck,
      color: 'pink',
      description: 'Registro y Estrategias',
      status: 'active'
    },
    {
      id: 'hse',
      name: 'HSE',
      icon: Shield,
      color: 'rose',
      description: 'Seguridad, Salud y Ambiente',
      status: 'active'
    },
    {
      id: 'changes',
      name: 'Cambios',
      icon: RefreshCw,
      color: 'slate',
      description: 'Control de Cambios',
      status: 'pending'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Completo</span>;
      case 'active':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Activo</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">Pendiente</span>;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-amber-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthLabel = (health: string) => {
    switch (health) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'warning': return 'Precaución';
      case 'critical': return 'Crítico';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Plan de Administración del Proyecto
              </h1>
              <p className="text-gray-500">
                {projectPlan.projectCharter?.title || 'Proyecto de Construcción'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Estado del Plan</p>
              <span className={`text-lg font-bold ${
                projectPlan.status === 'approved' ? 'text-green-600' :
                projectPlan.status === 'active' ? 'text-blue-600' :
                projectPlan.status === 'draft' ? 'text-amber-600' : 'text-gray-600'
              }`}>
                {projectPlan.status === 'approved' ? 'Aprobado' :
                 projectPlan.status === 'active' ? 'Activo' :
                 projectPlan.status === 'draft' ? 'Borrador' : 'Cerrado'}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Versión</p>
              <span className="text-lg font-bold text-gray-900">{projectPlan.version}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Salud del Proyecto</span>
            <Activity className={`w-5 h-5 ${getHealthColor(evmMetrics.overallHealth)}`} />
          </div>
          <p className={`text-3xl font-bold ${getHealthColor(evmMetrics.overallHealth)}`}>
            {getHealthLabel(evmMetrics.overallHealth)}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {evmMetrics.overallHealth === 'excellent' || evmMetrics.overallHealth === 'good' ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm text-gray-600">
              CPI: {evmMetrics.CPI.toFixed(2)} | SPI: {evmMetrics.SPI.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Schedule Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Desempeño Cronograma</span>
            <Calendar className={`w-5 h-5 ${
              evmMetrics.SPI >= 1 ? 'text-green-500' :
              evmMetrics.SPI >= 0.9 ? 'text-amber-500' : 'text-red-500'
            }`} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{(evmMetrics.SPI * 100).toFixed(0)}%</p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  evmMetrics.SPI >= 1 ? 'bg-green-500' :
                  evmMetrics.SPI >= 0.9 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(evmMetrics.SPI * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              SV: {evmMetrics.SV >= 0 ? '+' : ''}{evmMetrics.SV.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Cost Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Desempeño Costos</span>
            <DollarSign className={`w-5 h-5 ${
              evmMetrics.CPI >= 1 ? 'text-green-500' :
              evmMetrics.CPI >= 0.9 ? 'text-amber-500' : 'text-red-500'
            }`} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{(evmMetrics.CPI * 100).toFixed(0)}%</p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  evmMetrics.CPI >= 1 ? 'bg-green-500' :
                  evmMetrics.CPI >= 0.9 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(evmMetrics.CPI * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              CV: {evmMetrics.CV >= 0 ? '+' : ''}{evmMetrics.CV.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Progreso General</span>
            <PieChart className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{evmMetrics.percentComplete.toFixed(0)}%</p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${evmMetrics.percentComplete}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              EV: ${evmMetrics.EV.toLocaleString()} de ${evmMetrics.BAC.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* EVM Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Métricas EVM
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">BAC (Presupuesto)</span>
              <span className="font-semibold">${evmMetrics.BAC.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">PV (Valor Planificado)</span>
              <span className="font-semibold">${evmMetrics.PV.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">EV (Valor Ganado)</span>
              <span className="font-semibold text-green-600">${evmMetrics.EV.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">AC (Costo Real)</span>
              <span className="font-semibold text-blue-600">${evmMetrics.AC.toLocaleString()}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">EAC (Estimado al Completar)</span>
                <span className={`font-semibold ${
                  evmMetrics.EAC_typical > evmMetrics.BAC ? 'text-red-600' : 'text-green-600'
                }`}>
                  ${evmMetrics.EAC_typical.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">VAC (Varianza al Completar)</span>
                <span className={`font-semibold ${
                  evmMetrics.VAC >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {evmMetrics.VAC >= 0 ? '+' : ''}{evmMetrics.VAC.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Resumen del Proyecto
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hitos Totales</span>
              <span className="font-semibold">
                {projectPlan.projectCharter?.milestones?.length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hitos Alcanzados</span>
              <span className="font-semibold text-green-600">
                {projectPlan.projectCharter?.milestones?.filter(m => m.status === 'achieved').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Entregables</span>
              <span className="font-semibold">
                {projectPlan.projectCharter?.deliverables?.length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Riesgos Activos</span>
              <span className="font-semibold text-red-600">
                {projectPlan.riskManagementPlan?.riskRegister?.filter(r => r.status !== 'closed').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cambios Pendientes</span>
              <span className="font-semibold text-amber-600">
                {projectPlan.changeManagementPlan?.changeLog?.filter(c => c.status === 'submitted' || c.status === 'analysis').length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Team Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Equipo y Recursos
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Miembros del Equipo</span>
              <span className="font-semibold">
                {projectPlan.resourceManagementPlan?.humanResources?.teamMembers?.length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Interesados</span>
              <span className="font-semibold">
                {projectPlan.stakeholderManagementPlan?.stakeholderRegister?.length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Proveedores</span>
              <span className="font-semibold">
                {projectPlan.procurementManagementPlan?.vendors?.length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Contratos Activos</span>
              <span className="font-semibold text-blue-600">
                {projectPlan.procurementManagementPlan?.contracts?.filter(c => c.status === 'active').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Incidentes HSE Abiertos</span>
              <span className="font-semibold text-red-600">
                {projectPlan.hseManagementPlan?.incidentManagement?.incidents?.filter(i => i.status !== 'closed').length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Planes de Gestión (PMBOK)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {planItems.map(item => {
            const Icon = item.icon;
            const colorClasses: Record<string, string> = {
              blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
              amber: 'bg-amber-100 text-amber-600 hover:bg-amber-200',
              indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
              green: 'bg-green-100 text-green-600 hover:bg-green-200',
              emerald: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
              purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
              cyan: 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200',
              red: 'bg-red-100 text-red-600 hover:bg-red-200',
              orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
              pink: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
              rose: 'bg-rose-100 text-rose-600 hover:bg-rose-200',
              slate: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            };

            return (
              <button
                key={item.id}
                onClick={() => onNavigateTo(item.id)}
                className={`
                  p-4 rounded-xl transition-all cursor-pointer
                  ${colorClasses[item.color]}
                `}
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium text-sm text-center">{item.name}</p>
                <div className="mt-2 flex justify-center">
                  {getStatusBadge(item.status)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Hito "Cimentación" completado</p>
                <p className="text-xs text-gray-500">Hace 2 días</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <RefreshCw className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Solicitud de cambio #CR-005 aprobada</p>
                <p className="text-xs text-gray-500">Hace 3 días</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Nuevo riesgo identificado: Retraso en materiales</p>
                <p className="text-xs text-gray-500">Hace 5 días</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Reunión de seguimiento con interesados</p>
                <p className="text-xs text-gray-500">Hace 1 semana</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas y Notificaciones</h3>
          <div className="space-y-4">
            {evmMetrics.CPI < 0.95 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">Sobrecosto detectado</p>
                  <p className="text-xs text-red-700">
                    CPI de {evmMetrics.CPI.toFixed(2)} indica que el proyecto está gastando más de lo planificado.
                  </p>
                </div>
              </div>
            )}

            {evmMetrics.SPI < 0.95 && (
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Retraso en cronograma</p>
                  <p className="text-xs text-amber-700">
                    SPI de {evmMetrics.SPI.toFixed(2)} indica que el proyecto está atrasado respecto al plan.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">Próximo hito</p>
                <p className="text-xs text-blue-700">
                  "Estructura completa" programado para la próxima semana.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">HSE - Sin incidentes</p>
                <p className="text-xs text-green-700">
                  El proyecto mantiene 30 días sin incidentes reportables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
