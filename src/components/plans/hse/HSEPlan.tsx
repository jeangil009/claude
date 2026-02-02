import { useState, useMemo } from 'react';
import {
  Shield,
  AlertTriangle,
  Heart,
  Leaf,
  FileText,
  Activity,
  Users,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';
import type {
  HSEManagementPlan,
  Incident,
  Hazard,
  HSERiskAssessment,
  InspectionRecord,
  HSEKPI
} from '../../../types/pmbok';

interface HSEPlanProps {
  plan: HSEManagementPlan;
  onUpdate: (plan: HSEManagementPlan) => void;
  readOnly?: boolean;
}

export function HSEPlan({ plan, onUpdate, readOnly = false }: HSEPlanProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'hazards' | 'incidents' | 'inspections' | 'training' | 'emergency'>('overview');

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Shield },
    { id: 'hazards', label: 'Riesgos HSE', icon: AlertTriangle },
    { id: 'incidents', label: 'Incidentes', icon: AlertCircle },
    { id: 'inspections', label: 'Inspecciones', icon: ClipboardCheck },
    { id: 'training', label: 'Capacitación', icon: Users },
    { id: 'emergency', label: 'Emergencias', icon: Phone }
  ];

  // Calculate statistics
  const stats = useMemo(() => {
    const incidents = plan.incidentManagement.incidents;
    const totalIncidents = incidents.length;
    const openIncidents = incidents.filter(i => i.status !== 'closed').length;
    const nearMisses = incidents.filter(i => i.type === 'near_miss').length;
    const lostTimeIncidents = incidents.filter(i => i.type === 'lost_time').length;

    const hazards = plan.hazardIdentification.identifiedHazards;
    const activeHazards = hazards.filter(h => h.status === 'active').length;
    const controlledHazards = hazards.filter(h => h.status === 'controlled').length;

    const riskAssessments = plan.riskAssessment;
    const highRisks = riskAssessments.filter(r => r.riskRating === 'high' || r.riskRating === 'extreme').length;

    const trainingCompliance = plan.trainingProgram.trainingRecords.filter(r => r.passed).length /
      Math.max(plan.trainingProgram.trainingRecords.length, 1) * 100;

    return {
      totalIncidents,
      openIncidents,
      nearMisses,
      lostTimeIncidents,
      activeHazards,
      controlledHazards,
      highRisks,
      trainingCompliance,
      ltir: plan.incidentManagement.statistics.ltir,
      trir: plan.incidentManagement.statistics.trir,
      manhours: plan.incidentManagement.statistics.manhours
    };
  }, [plan]);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* HSE Policy */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <Shield className="w-10 h-10 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Política de Seguridad, Salud y Medio Ambiente</h3>
            <p className="text-blue-100">{plan.hsePolicy.statement}</p>
          </div>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Días Sin Accidentes</span>
            <Shield className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {Math.floor((Date.now() - new Date(plan.incidentManagement.incidents
              .filter(i => i.type !== 'near_miss')
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || Date.now()
            ).getTime()) / (1000 * 60 * 60 * 24))}
          </p>
          <p className="text-xs text-gray-500 mt-1">Meta: 365 días</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">LTIR</span>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.ltir.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Lost Time Incident Rate</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">TRIR</span>
            <Activity className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.trir.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Total Recordable Incident Rate</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Capacitación</span>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.trainingCompliance.toFixed(0)}%</p>
          <p className="text-xs text-gray-500 mt-1">Cumplimiento</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Safety */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Incidentes Abiertos</span>
              <span className={`font-bold ${stats.openIncidents > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.openIncidents}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Casi Accidentes</span>
              <span className="font-bold text-amber-600">{stats.nearMisses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Peligros Activos</span>
              <span className="font-bold text-gray-900">{stats.activeHazards}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Riesgos Altos</span>
              <span className={`font-bold ${stats.highRisks > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.highRisks}
              </span>
            </div>
          </div>
        </div>

        {/* Health */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Salud</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Exámenes Médicos</span>
              <span className="font-bold text-green-600">
                {plan.healthPlan.medicalSurveillance.periodicExams.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Peligros Ocupacionales</span>
              <span className="font-bold text-gray-900">
                {plan.healthPlan.occupationalHazards.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Programas de Salud</span>
              <span className="font-bold text-blue-600">
                {plan.healthPlan.healthPrograms.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Kits Primeros Auxilios</span>
              <span className="font-bold text-gray-900">
                {plan.healthPlan.firstAidProvisions.firstAidKits.length}
              </span>
            </div>
          </div>
        </div>

        {/* Environment */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Medio Ambiente</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Aspectos Significativos</span>
              <span className="font-bold text-gray-900">
                {plan.environmentalPlan.significantAspects.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Permisos Ambientales</span>
              <span className="font-bold text-green-600">
                {plan.environmentalPlan.permits.filter(p => p.status === 'valid').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tipos de Residuos</span>
              <span className="font-bold text-gray-900">
                {plan.environmentalPlan.wasteManagement.wasteTypes.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monitoreos</span>
              <span className="font-bold text-blue-600">
                {plan.environmentalPlan.monitoringProgram.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HSE Objectives */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivos HSE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.hsePolicy.objectives.map(objective => (
            <div
              key={objective.id}
              className={`p-4 rounded-lg border-2 ${
                objective.status === 'achieved' ? 'border-green-300 bg-green-50' :
                objective.status === 'on_track' ? 'border-blue-300 bg-blue-50' :
                objective.status === 'at_risk' ? 'border-amber-300 bg-amber-50' :
                'border-red-300 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-0.5 text-xs rounded ${
                  objective.category === 'safety' ? 'bg-red-100 text-red-700' :
                  objective.category === 'health' ? 'bg-pink-100 text-pink-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {objective.category === 'safety' ? 'Seguridad' :
                   objective.category === 'health' ? 'Salud' : 'Ambiente'}
                </span>
                <span className={`text-xs font-medium ${
                  objective.status === 'achieved' ? 'text-green-700' :
                  objective.status === 'on_track' ? 'text-blue-700' :
                  objective.status === 'at_risk' ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {objective.status === 'achieved' ? 'Logrado' :
                   objective.status === 'on_track' ? 'En Camino' :
                   objective.status === 'at_risk' ? 'En Riesgo' : 'No Logrado'}
                </span>
              </div>
              <p className="text-sm text-gray-900 font-medium mb-2">{objective.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Meta: {objective.target}</span>
                <span>Actual: {objective.currentValue || '-'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHazards = () => (
    <div className="space-y-6">
      {/* Risk Matrix */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Matriz de Riesgos HSE</h3>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="grid grid-cols-5 gap-1" style={{ width: '400px', height: '320px' }}>
              {[5, 4, 3, 2, 1].map(likelihood =>
                [1, 2, 3, 4, 5].map(severity => {
                  const riskLevel = likelihood * severity;
                  const risksInCell = plan.riskAssessment.filter(
                    r => r.likelihood === likelihood && r.severity === severity
                  );

                  return (
                    <div
                      key={`${likelihood}-${severity}`}
                      className={`
                        flex items-center justify-center rounded cursor-pointer
                        ${riskLevel >= 15 ? 'bg-red-500' :
                          riskLevel >= 10 ? 'bg-orange-500' :
                          riskLevel >= 5 ? 'bg-yellow-400' :
                          'bg-green-400'}
                      `}
                      title={`Probabilidad ${likelihood} x Severidad ${severity} = ${riskLevel}`}
                    >
                      {risksInCell.length > 0 && (
                        <span className="text-white font-bold text-lg">{risksInCell.length}</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
              Probabilidad
            </div>
            <div className="text-center mt-2 text-sm font-medium text-gray-600">Severidad</div>
          </div>
        </div>
      </div>

      {/* Hazard List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peligro</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Riesgo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Controles</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plan.hazardIdentification.identifiedHazards.map(hazard => {
              const assessment = plan.riskAssessment.find(r => r.hazardId === hazard.id);

              return (
                <tr key={hazard.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm text-gray-600">{hazard.code}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{hazard.description}</p>
                    <p className="text-sm text-gray-500">{hazard.activity}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{hazard.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{hazard.location}</td>
                  <td className="px-4 py-3">
                    {assessment && (
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        assessment.riskRating === 'extreme' ? 'bg-red-100 text-red-700' :
                        assessment.riskRating === 'high' ? 'bg-orange-100 text-orange-700' :
                        assessment.riskRating === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {assessment.riskRating === 'extreme' ? 'Extremo' :
                         assessment.riskRating === 'high' ? 'Alto' :
                         assessment.riskRating === 'medium' ? 'Medio' : 'Bajo'}
                        ({assessment.riskLevel})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {hazard.existingControls.slice(0, 2).map((control, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {control.substring(0, 20)}...
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      hazard.status === 'eliminated' ? 'bg-green-100 text-green-700' :
                      hazard.status === 'controlled' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {hazard.status === 'eliminated' ? 'Eliminado' :
                       hazard.status === 'controlled' ? 'Controlado' : 'Activo'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      {/* Incident Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { type: 'near_miss', label: 'Casi Accidentes', color: 'amber' },
          { type: 'first_aid', label: 'Primeros Auxilios', color: 'green' },
          { type: 'medical_treatment', label: 'Tratamiento Médico', color: 'blue' },
          { type: 'lost_time', label: 'Tiempo Perdido', color: 'orange' },
          { type: 'fatality', label: 'Fatalidades', color: 'red' }
        ].map(({ type, label, color }) => {
          const count = plan.incidentManagement.incidents.filter(i => i.type === type).length;
          return (
            <div key={type} className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
              <p className={`text-sm text-${color}-700`}>{label}</p>
              <p className={`text-3xl font-bold text-${color}-600`}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Incident List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Registro de Incidentes</h3>
          {!readOnly && (
            <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
              Reportar Incidente
            </button>
          )}
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lesionados</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plan.incidentManagement.incidents.map(incident => (
              <tr key={incident.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div>
                    <p className="text-gray-900">{new Date(incident.date).toLocaleDateString('es-MX')}</p>
                    <p className="text-gray-500 text-xs">{incident.time}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    incident.type === 'fatality' ? 'bg-red-100 text-red-700' :
                    incident.type === 'lost_time' ? 'bg-orange-100 text-orange-700' :
                    incident.type === 'medical_treatment' ? 'bg-blue-100 text-blue-700' :
                    incident.type === 'first_aid' ? 'bg-green-100 text-green-700' :
                    incident.type === 'near_miss' ? 'bg-amber-100 text-amber-700' :
                    incident.type === 'property_damage' ? 'bg-purple-100 text-purple-700' :
                    'bg-teal-100 text-teal-700'
                  }`}>
                    {incident.type === 'fatality' ? 'Fatalidad' :
                     incident.type === 'lost_time' ? 'Tiempo Perdido' :
                     incident.type === 'medical_treatment' ? 'Tratamiento Médico' :
                     incident.type === 'first_aid' ? 'Primeros Auxilios' :
                     incident.type === 'near_miss' ? 'Casi Accidente' :
                     incident.type === 'property_damage' ? 'Daño Propiedad' : 'Ambiental'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{incident.location}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {incident.description}
                </td>
                <td className="px-4 py-3 text-center">
                  {incident.injuredPersons?.length || 0}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    incident.status === 'closed' ? 'bg-green-100 text-green-700' :
                    incident.status === 'investigating' ? 'bg-blue-100 text-blue-700' :
                    incident.status === 'actions_pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {incident.status === 'closed' ? 'Cerrado' :
                     incident.status === 'investigating' ? 'Investigando' :
                     incident.status === 'actions_pending' ? 'Acciones Pendientes' : 'Reportado'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">
                    {incident.correctiveActions.filter(a => a.status === 'completed').length}/
                    {incident.correctiveActions.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInspections = () => (
    <div className="space-y-6">
      {/* Inspection Calendar/Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Inspecciones Programadas</h4>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {plan.inspectionProgram.inspectionSchedule.filter(i => i.status === 'scheduled').length}
          </p>
          <p className="text-sm text-gray-500">Este mes</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Completadas</h4>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {plan.inspectionProgram.inspectionSchedule.filter(i => i.status === 'completed').length}
          </p>
          <p className="text-sm text-gray-500">Este mes</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Vencidas</h4>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">
            {plan.inspectionProgram.inspectionSchedule.filter(i => i.status === 'overdue').length}
          </p>
          <p className="text-sm text-gray-500">Requieren atención</p>
        </div>
      </div>

      {/* Inspection Records */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inspector</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hallazgos</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calificación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plan.inspectionProgram.inspectionRecords.map(record => {
              const inspectionType = plan.inspectionProgram.inspectionTypes.find(t => t.id === record.typeId);

              return (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(record.date).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {inspectionType?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.area}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.inspector}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {record.findings.filter(f => f.status === 'not_ok').length}
                      </span>
                      <span className="text-xs text-gray-500">
                        no conformidades
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      record.overallRating === 'satisfactory' ? 'bg-green-100 text-green-700' :
                      record.overallRating === 'needs_improvement' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {record.overallRating === 'satisfactory' ? 'Satisfactorio' :
                       record.overallRating === 'needs_improvement' ? 'Necesita Mejora' : 'Insatisfactorio'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="space-y-6">
      {/* Training Courses */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cursos de Capacitación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.trainingProgram.trainingCourses.map(course => (
            <div key={course.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-0.5 text-xs rounded ${
                  course.type === 'induction' ? 'bg-blue-100 text-blue-700' :
                  course.type === 'specialized' ? 'bg-purple-100 text-purple-700' :
                  course.type === 'refresher' ? 'bg-green-100 text-green-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {course.type === 'induction' ? 'Inducción' :
                   course.type === 'specialized' ? 'Especializado' :
                   course.type === 'refresher' ? 'Actualización' : 'Charla'}
                </span>
                <span className="text-xs text-gray-500">{course.code}</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{course.name}</h4>
              <p className="text-sm text-gray-500 mb-3">{course.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {course.duration} {course.durationUnit === 'hours' ? 'hrs' : 'días'}
                </span>
                {course.validityPeriod && (
                  <span>Vigencia: {course.validityPeriod} meses</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training Records */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Registros de Capacitación</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Persona</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Curso</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plan.trainingProgram.trainingRecords.slice(0, 10).map(record => {
              const course = plan.trainingProgram.trainingCourses.find(c => c.id === record.courseId);

              return (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{record.personId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{course?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(record.date).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      record.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {record.passed ? 'Aprobado' : 'Reprobado'}
                      {record.score && ` (${record.score}%)`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {record.expirationDate
                      ? new Date(record.expirationDate).toLocaleDateString('es-MX')
                      : 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEmergency = () => (
    <div className="space-y-6">
      {/* Emergency Contacts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5" /> Contactos de Emergencia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plan.healthPlan.firstAidProvisions.emergencyContacts.map((contact, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 border border-red-200">
              <p className="font-medium text-gray-900">{contact.service}</p>
              <p className="text-sm text-gray-600">{contact.name}</p>
              <p className="text-lg font-bold text-red-600 mt-2">{contact.phone}</p>
              {contact.responseTime && (
                <p className="text-xs text-gray-500">Tiempo respuesta: {contact.responseTime}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Types */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Emergencia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.emergencyResponse.emergencyTypes.map(emergency => (
            <div key={emergency.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{emergency.type}</h4>
                <div className="flex gap-1">
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    emergency.probability === 'high' ? 'bg-red-100 text-red-700' :
                    emergency.probability === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    P: {emergency.probability === 'high' ? 'Alta' :
                        emergency.probability === 'medium' ? 'Media' : 'Baja'}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    emergency.severity === 'catastrophic' || emergency.severity === 'high' ? 'bg-red-100 text-red-700' :
                    emergency.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    S: {emergency.severity === 'catastrophic' ? 'Catastrófico' :
                        emergency.severity === 'high' ? 'Alto' :
                        emergency.severity === 'medium' ? 'Medio' : 'Bajo'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{emergency.description}</p>
              <div className="text-xs text-gray-500">
                <p className="font-medium mb-1">Procedimiento de Respuesta:</p>
                <ol className="list-decimal list-inside space-y-1">
                  {emergency.responseProcedure.slice(0, 3).map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assembly Points */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" /> Puntos de Reunión
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plan.emergencyResponse.communicationPlan.assemblyPoints.map(point => (
            <div key={point.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  {point.id}
                </div>
                <span className="font-medium text-green-900">{point.location}</span>
              </div>
              <p className="text-sm text-green-700">Capacidad: {point.capacity} personas</p>
              <p className="text-sm text-green-700">Coordinador: {point.coordinator}</p>
              <div className="mt-2">
                <p className="text-xs text-green-600">Áreas asignadas:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {point.assignedAreas.map((area, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Drills */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Simulacros Programados</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Escenario</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participantes</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plan.emergencyResponse.drillSchedule.map(drill => (
              <tr key={drill.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{drill.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(drill.scheduledDate).toLocaleDateString('es-MX')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {drill.scenario}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{drill.participants}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    drill.status === 'completed' ? 'bg-green-100 text-green-700' :
                    drill.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {drill.status === 'completed' ? 'Completado' :
                     drill.status === 'cancelled' ? 'Cancelado' : 'Programado'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Plan de Seguridad, Salud y Medio Ambiente</h2>
            <p className="text-sm text-gray-500">HSE Management Plan</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 px-6 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-red-600 text-red-600'
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
        {activeTab === 'hazards' && renderHazards()}
        {activeTab === 'incidents' && renderIncidents()}
        {activeTab === 'inspections' && renderInspections()}
        {activeTab === 'training' && renderTraining()}
        {activeTab === 'emergency' && renderEmergency()}
      </div>
    </div>
  );
}
