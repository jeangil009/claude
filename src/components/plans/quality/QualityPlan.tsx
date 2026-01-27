import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ClipboardCheck,
  AlertTriangle,
  FileText,
  TrendingUp,
  BarChart3,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  User,
  Target
} from 'lucide-react';
import type {
  QualityManagementPlan,
  QualityMetric,
  QualityControlActivity,
  InspectionCheckpoint,
  QualityRecord,
  ChecklistItem
} from '../../../types/pmbok';

interface QualityPlanProps {
  plan: QualityManagementPlan;
  onUpdate: (plan: QualityManagementPlan) => void;
  readOnly?: boolean;
}

export function QualityPlan({ plan, onUpdate, readOnly = false }: QualityPlanProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'control' | 'inspections' | 'records'>('overview');
  const [selectedMetric, setSelectedMetric] = useState<QualityMetric | null>(null);
  const [selectedInspection, setSelectedInspection] = useState<InspectionCheckpoint | null>(null);

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Award },
    { id: 'metrics', label: 'Métricas', icon: BarChart3 },
    { id: 'control', label: 'Control de Calidad', icon: ClipboardCheck },
    { id: 'inspections', label: 'Puntos de Inspección', icon: CheckCircle2 },
    { id: 'records', label: 'Registros', icon: FileText }
  ];

  // Calculate summary statistics
  const stats = {
    totalMetrics: plan.qualityMetrics.length,
    metricsOnTarget: plan.qualityMetrics.filter(m => {
      if (!m.currentValue) return false;
      return m.currentValue >= m.lowerLimit && m.currentValue <= m.upperLimit;
    }).length,
    totalInspections: plan.inspectionCheckpoints.length,
    inspectionsPassed: plan.inspectionCheckpoints.filter(i => i.status === 'passed').length,
    inspectionsPending: plan.inspectionCheckpoints.filter(i => i.status === 'pending').length,
    totalControlActivities: plan.qualityControlActivities.length,
    activeActivities: plan.qualityControlActivities.filter(a =>
      a.records.some(r => new Date(r.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    ).length
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quality Policy */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Award className="w-5 h-5" /> Política de Calidad
        </h3>
        <p className="text-blue-800">{plan.qualityPolicy}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Métricas Definidas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMetrics}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            {stats.metricsOnTarget} en objetivo
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Puntos de Inspección</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInspections}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {stats.inspectionsPassed} aprobados, {stats.inspectionsPending} pendientes
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Actividades de Control</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalControlActivities}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <ClipboardCheck className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {stats.activeActivities} activas este mes
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Estándares</p>
              <p className="text-2xl font-bold text-gray-900">{plan.qualityStandards.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Normas y estándares aplicables
          </p>
        </div>
      </div>

      {/* Quality Objectives */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" /> Objetivos de Calidad
        </h3>
        <div className="space-y-4">
          {plan.qualityObjectives.map((objective, idx) => (
            <div key={objective.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">{idx + 1}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{objective.description}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <span><strong>Métrica:</strong> {objective.metric}</span>
                  <span><strong>Meta:</strong> {objective.target} {objective.unit}</span>
                  <span><strong>Tolerancia:</strong> ±{objective.tolerance} {objective.unit}</span>
                  <span><strong>Frecuencia:</strong> {objective.frequency}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {objective.responsible}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Standards */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" /> Estándares y Normas Aplicables
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.qualityStandards.map(standard => (
            <div key={standard.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{standard.name}</h4>
                  <p className="text-sm text-gray-500 font-mono">{standard.code}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  standard.type === 'international' ? 'bg-blue-100 text-blue-800' :
                  standard.type === 'national' ? 'bg-green-100 text-green-800' :
                  standard.type === 'industry' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {standard.type === 'international' ? 'Internacional' :
                   standard.type === 'national' ? 'Nacional' :
                   standard.type === 'industry' ? 'Industria' : 'Empresa'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{standard.description}</p>
              {standard.applicableTo.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {standard.applicableTo.map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quality Roles */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-green-600" /> Roles y Responsabilidades
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Persona</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsabilidades</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calificaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {plan.qualityRoles.map((role, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{role.role}</td>
                  <td className="px-4 py-3 text-gray-600">{role.person}</td>
                  <td className="px-4 py-3">
                    <ul className="text-sm text-gray-600 space-y-1">
                      {role.responsibilities.slice(0, 3).map((resp, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-gray-400">•</span> {resp}
                        </li>
                      ))}
                      {role.responsibilities.length > 3 && (
                        <li className="text-gray-400 text-xs">
                          +{role.responsibilities.length - 3} más...
                        </li>
                      )}
                    </ul>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {role.qualifications.map((qual, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                          {qual}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.qualityMetrics.map(metric => {
          const isOnTarget = metric.currentValue !== undefined &&
            metric.currentValue >= metric.lowerLimit &&
            metric.currentValue <= metric.upperLimit;
          const percentOfTarget = metric.currentValue !== undefined
            ? (metric.currentValue / metric.target) * 100
            : 0;

          return (
            <div
              key={metric.id}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                ${selectedMetric?.id === metric.id ? 'ring-2 ring-blue-500' : ''}
                ${isOnTarget ? 'border-green-200 bg-green-50' :
                  metric.currentValue !== undefined ? 'border-red-200 bg-red-50' :
                  'border-gray-200 bg-white'}
              `}
              onClick={() => setSelectedMetric(metric)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{metric.name}</h4>
                  <p className="text-xs text-gray-500">{metric.frequency}</p>
                </div>
                {metric.trend && (
                  <span className={`flex items-center gap-1 text-xs ${
                    metric.trend === 'improving' ? 'text-green-600' :
                    metric.trend === 'declining' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${
                      metric.trend === 'declining' ? 'rotate-180' : ''
                    }`} />
                    {metric.trend === 'improving' ? 'Mejorando' :
                     metric.trend === 'declining' ? 'Declinando' : 'Estable'}
                  </span>
                )}
              </div>

              <div className="mb-3">
                <div className="flex items-end justify-between mb-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.currentValue !== undefined ? metric.currentValue.toFixed(1) : '--'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Meta: {metric.target} {metric.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isOnTarget ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(percentOfTarget, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Mín: {metric.lowerLimit}</span>
                <span>Máx: {metric.upperLimit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Metric Details */}
      {selectedMetric && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detalles de Métrica: {selectedMetric.name}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Descripción</label>
                <p className="text-gray-900">{selectedMetric.description}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Fórmula</label>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded">{selectedMetric.formula}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Fuente de Datos</label>
                <p className="text-gray-900">{selectedMetric.dataSource}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Responsable</label>
                <p className="text-gray-900">{selectedMetric.responsible}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Frecuencia de Medición</label>
                <p className="text-gray-900">{selectedMetric.frequency}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Límites</label>
                <div className="flex gap-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
                    Inferior: {selectedMetric.lowerLimit}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                    Meta: {selectedMetric.target}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
                    Superior: {selectedMetric.upperLimit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderControlActivities = () => (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actividad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">WBS</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frecuencia</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registros</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plan.qualityControlActivities.map(activity => {
              const lastRecord = activity.records[activity.records.length - 1];
              const passRate = activity.records.length > 0
                ? (activity.records.filter(r => r.result === 'pass').length / activity.records.length) * 100
                : 0;

              return (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{activity.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{activity.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-gray-600">{activity.wbsCode}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      activity.type === 'inspection' ? 'bg-blue-100 text-blue-800' :
                      activity.type === 'testing' ? 'bg-purple-100 text-purple-800' :
                      activity.type === 'measurement' ? 'bg-green-100 text-green-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {activity.type === 'inspection' ? 'Inspección' :
                       activity.type === 'testing' ? 'Prueba' :
                       activity.type === 'measurement' ? 'Medición' : 'Auditoría'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{activity.frequency}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{activity.responsible}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{activity.records.length}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${passRate >= 80 ? 'bg-green-500' : passRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${passRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{passRate.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {lastRecord ? (
                      <span className={`flex items-center gap-1 ${
                        lastRecord.result === 'pass' ? 'text-green-600' :
                        lastRecord.result === 'fail' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {lastRecord.result === 'pass' ? <CheckCircle2 className="w-4 h-4" /> :
                         lastRecord.result === 'fail' ? <AlertTriangle className="w-4 h-4" /> :
                         <AlertTriangle className="w-4 h-4" />}
                        {new Date(lastRecord.date).toLocaleDateString('es-MX')}
                      </span>
                    ) : (
                      <span className="text-gray-400">Sin registros</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInspections = () => (
    <div className="space-y-6">
      {/* Timeline view of inspection points */}
      <div className="relative">
        {plan.inspectionCheckpoints.map((checkpoint, idx) => {
          const statusColors = {
            pending: 'bg-gray-400',
            passed: 'bg-green-500',
            failed: 'bg-red-500',
            waived: 'bg-yellow-500'
          };

          return (
            <div key={checkpoint.id} className="flex gap-4 pb-8 relative">
              {/* Timeline line */}
              {idx < plan.inspectionCheckpoints.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200" />
              )}

              {/* Status dot */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10
                ${statusColors[checkpoint.status]}
              `}>
                {checkpoint.status === 'passed' ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : checkpoint.status === 'failed' ? (
                  <AlertTriangle className="w-5 h-5 text-white" />
                ) : (
                  <Clock className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Content */}
              <div
                className={`
                  flex-1 bg-white border rounded-lg p-4 cursor-pointer transition-all
                  ${selectedInspection?.id === checkpoint.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}
                `}
                onClick={() => setSelectedInspection(checkpoint)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{checkpoint.name}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        checkpoint.inspectionType === 'hold_point' ? 'bg-red-100 text-red-800' :
                        checkpoint.inspectionType === 'witness_point' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {checkpoint.inspectionType === 'hold_point' ? 'Punto de Retención' :
                         checkpoint.inspectionType === 'witness_point' ? 'Punto de Presencia' :
                         'Punto de Revisión'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="font-mono">{checkpoint.wbsCode}</span> • {checkpoint.phase}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    checkpoint.status === 'passed' ? 'bg-green-100 text-green-800' :
                    checkpoint.status === 'failed' ? 'bg-red-100 text-red-800' :
                    checkpoint.status === 'waived' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {checkpoint.status === 'passed' ? 'Aprobado' :
                     checkpoint.status === 'failed' ? 'Rechazado' :
                     checkpoint.status === 'waived' ? 'Dispensado' : 'Pendiente'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{checkpoint.description}</p>

                {/* Checklist preview */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {checkpoint.checklist.slice(0, 5).map(item => (
                    <span
                      key={item.id}
                      className={`px-2 py-1 text-xs rounded ${
                        item.status === 'ok' ? 'bg-green-100 text-green-700' :
                        item.status === 'not_ok' ? 'bg-red-100 text-red-700' :
                        item.status === 'na' ? 'bg-gray-100 text-gray-600' :
                        'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.description.substring(0, 20)}...
                    </span>
                  ))}
                  {checkpoint.checklist.length > 5 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      +{checkpoint.checklist.length - 5} más
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {checkpoint.inspector || 'Sin asignar'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {checkpoint.inspectionDate
                      ? new Date(checkpoint.inspectionDate).toLocaleDateString('es-MX')
                      : 'Fecha pendiente'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected inspection details */}
      {selectedInspection && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Checklist de Inspección: {selectedInspection.name}
          </h3>

          <div className="space-y-3">
            {selectedInspection.checklist.map(item => (
              <div
                key={item.id}
                className={`
                  flex items-start gap-3 p-3 rounded-lg border
                  ${item.status === 'ok' ? 'bg-green-50 border-green-200' :
                    item.status === 'not_ok' ? 'bg-red-50 border-red-200' :
                    item.status === 'na' ? 'bg-gray-50 border-gray-200' :
                    'bg-yellow-50 border-yellow-200'}
                `}
              >
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                  ${item.status === 'ok' ? 'bg-green-500' :
                    item.status === 'not_ok' ? 'bg-red-500' :
                    item.status === 'na' ? 'bg-gray-400' :
                    'bg-yellow-500'}
                `}>
                  {item.status === 'ok' ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : item.status === 'not_ok' ? (
                    <AlertTriangle className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs text-white font-bold">N/A</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.description}</p>
                  <p className="text-sm text-gray-500">{item.requirement}</p>
                  {item.comments && (
                    <p className="text-sm text-gray-600 mt-1 italic">"{item.comments}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Required approvals */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Aprobaciones Requeridas</h4>
            <div className="flex flex-wrap gap-2">
              {selectedInspection.requiredApprovals.map((approval, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                  {approval}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRecords = () => {
    const allRecords: (QualityRecord & { activityName: string })[] = [];
    plan.qualityControlActivities.forEach(activity => {
      activity.records.forEach(record => {
        allRecords.push({ ...record, activityName: activity.name });
      });
    });

    allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actividad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inspector</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mediciones</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allRecords.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(record.date).toLocaleDateString('es-MX')}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {record.activityName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {record.inspector}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    record.result === 'pass' ? 'bg-green-100 text-green-800' :
                    record.result === 'fail' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.result === 'pass' ? 'Aprobado' :
                     record.result === 'fail' ? 'Rechazado' : 'Condicional'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {record.measurements.slice(0, 3).map((m, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 text-xs rounded ${
                          m.withinSpec ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {m.parameter}: {m.value} {m.unit}
                      </span>
                    ))}
                    {record.measurements.length > 3 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        +{record.measurements.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {record.observations}
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {allRecords.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay registros de calidad disponibles</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Plan de Gestión de Calidad</h2>
            <p className="text-sm text-gray-500">Quality Management Plan</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 px-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'metrics' && renderMetrics()}
        {activeTab === 'control' && renderControlActivities()}
        {activeTab === 'inspections' && renderInspections()}
        {activeTab === 'records' && renderRecords()}
      </div>
    </div>
  );
}
