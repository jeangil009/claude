import { useState, useMemo } from 'react';
import {
  Users,
  Target,
  Grid3X3,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  User,
  Building2,
  Mail,
  Phone,
  Edit2,
  Eye,
  Plus
} from 'lucide-react';
import type {
  StakeholderManagementPlan,
  Stakeholder,
  PowerInterestPosition,
  EngagementLevel
} from '../../../types/pmbok';

interface StakeholderPlanProps {
  plan: StakeholderManagementPlan;
  onUpdate: (plan: StakeholderManagementPlan) => void;
  readOnly?: boolean;
}

export function StakeholderPlan({ plan, onUpdate, readOnly = false }: StakeholderPlanProps) {
  const [activeTab, setActiveTab] = useState<'register' | 'matrix' | 'engagement' | 'issues'>('register');
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'internal' | 'external'>('all');

  const tabs = [
    { id: 'register', label: 'Registro', icon: Users },
    { id: 'matrix', label: 'Matriz Poder/Interés', icon: Grid3X3 },
    { id: 'engagement', label: 'Compromiso', icon: Target },
    { id: 'issues', label: 'Asuntos', icon: MessageSquare }
  ];

  const engagementLabels: Record<EngagementLevel, string> = {
    unaware: 'Desconocedor',
    resistant: 'Resistente',
    neutral: 'Neutral',
    supportive: 'De Apoyo',
    leading: 'Líder'
  };

  const engagementColors: Record<EngagementLevel, string> = {
    unaware: 'bg-gray-100 text-gray-700',
    resistant: 'bg-red-100 text-red-700',
    neutral: 'bg-yellow-100 text-yellow-700',
    supportive: 'bg-green-100 text-green-700',
    leading: 'bg-blue-100 text-blue-700'
  };

  const filteredStakeholders = useMemo(() => {
    if (filterType === 'all') return plan.stakeholderRegister;
    return plan.stakeholderRegister.filter(s => s.type === filterType);
  }, [plan.stakeholderRegister, filterType]);

  // Statistics
  const stats = useMemo(() => {
    const total = plan.stakeholderRegister.length;
    const internal = plan.stakeholderRegister.filter(s => s.type === 'internal').length;
    const external = plan.stakeholderRegister.filter(s => s.type === 'external').length;
    const supportive = plan.stakeholderRegister.filter(s => s.attitude === 'supportive').length;
    const resistant = plan.stakeholderRegister.filter(s => s.attitude === 'resistant').length;
    const highPower = plan.stakeholderRegister.filter(s => s.power === 'high').length;
    const openIssues = plan.issuesLog.filter(i => i.status === 'open').length;

    return { total, internal, external, supportive, resistant, highPower, openIssues };
  }, [plan]);

  const renderRegister = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stakeholder List */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
            >
              <option value="all">Todos ({stats.total})</option>
              <option value="internal">Internos ({stats.internal})</option>
              <option value="external">Externos ({stats.external})</option>
            </select>
          </div>
          {!readOnly && (
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Agregar Interesado
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filteredStakeholders.map(stakeholder => (
            <div
              key={stakeholder.id}
              className={`
                bg-white border rounded-lg p-4 cursor-pointer transition-all
                ${selectedStakeholder?.id === stakeholder.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}
              `}
              onClick={() => setSelectedStakeholder(stakeholder)}
            >
              <div className="flex items-start gap-4">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                  ${stakeholder.type === 'internal' ? 'bg-blue-500' : 'bg-green-500'}
                `}>
                  {stakeholder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{stakeholder.name}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      stakeholder.type === 'internal'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {stakeholder.type === 'internal' ? 'Interno' : 'Externo'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{stakeholder.role} - {stakeholder.organization}</p>

                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      stakeholder.power === 'high' ? 'bg-red-100 text-red-700' :
                      stakeholder.power === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Poder: {stakeholder.power === 'high' ? 'Alto' : stakeholder.power === 'medium' ? 'Medio' : 'Bajo'}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      stakeholder.interest === 'high' ? 'bg-blue-100 text-blue-700' :
                      stakeholder.interest === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      Interés: {stakeholder.interest === 'high' ? 'Alto' : stakeholder.interest === 'medium' ? 'Medio' : 'Bajo'}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      stakeholder.attitude === 'supportive' ? 'bg-green-100 text-green-700' :
                      stakeholder.attitude === 'resistant' ? 'bg-red-100 text-red-700' :
                      stakeholder.attitude === 'neutral' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {stakeholder.attitude === 'supportive' ? 'De Apoyo' :
                       stakeholder.attitude === 'resistant' ? 'Resistente' :
                       stakeholder.attitude === 'neutral' ? 'Neutral' : 'Desconocedor'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Actual:</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${engagementColors[stakeholder.currentEngagement]}`}>
                      {engagementLabels[stakeholder.currentEngagement]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Deseado:</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${engagementColors[stakeholder.desiredEngagement]}`}>
                      {engagementLabels[stakeholder.desiredEngagement]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stakeholder Details */}
      <div>
        {selectedStakeholder ? (
          <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold
                ${selectedStakeholder.type === 'internal' ? 'bg-blue-500' : 'bg-green-500'}
              `}>
                {selectedStakeholder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedStakeholder.name}</h3>
                <p className="text-sm text-gray-500">{selectedStakeholder.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span>{selectedStakeholder.organization}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{selectedStakeholder.contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm col-span-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{selectedStakeholder.contactInfo.phone}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Requisitos</h4>
                <ul className="space-y-1">
                  {selectedStakeholder.requirements.map((req, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Expectativas</h4>
                <ul className="space-y-1">
                  {selectedStakeholder.expectations.map((exp, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Impacto Potencial</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {selectedStakeholder.potentialImpact}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Estrategia de Compromiso</h4>
                <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                  {selectedStakeholder.engagementStrategy}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">Selecciona un interesado para ver detalles</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMatrix = () => {
    // Power/Interest Matrix
    const getQuadrantStakeholders = (quadrant: string) => {
      return plan.powerInterestMatrix.filter(p => p.quadrant === quadrant);
    };

    const quadrants = [
      { id: 'manage_closely', label: 'Gestionar de Cerca', position: 'top-right', color: 'bg-red-100 border-red-300' },
      { id: 'keep_satisfied', label: 'Mantener Satisfecho', position: 'top-left', color: 'bg-amber-100 border-amber-300' },
      { id: 'keep_informed', label: 'Mantener Informado', position: 'bottom-right', color: 'bg-blue-100 border-blue-300' },
      { id: 'monitor', label: 'Monitorear', position: 'bottom-left', color: 'bg-green-100 border-green-300' }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            Matriz Poder / Interés
          </h3>

          <div className="flex justify-center">
            <div className="relative">
              {/* Y-axis label */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90">
                <span className="text-sm font-medium text-gray-600">PODER</span>
              </div>

              {/* Matrix grid */}
              <div className="grid grid-cols-2 gap-1" style={{ width: '600px', height: '400px' }}>
                {/* Top Left - Keep Satisfied */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-tl-lg p-4 relative">
                  <span className="absolute top-2 left-2 text-xs font-medium text-amber-700">
                    Mantener Satisfecho
                  </span>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {getQuadrantStakeholders('keep_satisfied').map(pos => {
                      const stakeholder = plan.stakeholderRegister.find(s => s.id === pos.stakeholderId);
                      if (!stakeholder) return null;
                      return (
                        <div
                          key={pos.stakeholderId}
                          className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold text-amber-800 cursor-pointer hover:bg-amber-300"
                          title={stakeholder.name}
                        >
                          {stakeholder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Right - Manage Closely */}
                <div className="bg-red-50 border-2 border-red-200 rounded-tr-lg p-4 relative">
                  <span className="absolute top-2 right-2 text-xs font-medium text-red-700">
                    Gestionar de Cerca
                  </span>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {getQuadrantStakeholders('manage_closely').map(pos => {
                      const stakeholder = plan.stakeholderRegister.find(s => s.id === pos.stakeholderId);
                      if (!stakeholder) return null;
                      return (
                        <div
                          key={pos.stakeholderId}
                          className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center text-xs font-bold text-red-800 cursor-pointer hover:bg-red-300"
                          title={stakeholder.name}
                        >
                          {stakeholder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Left - Monitor */}
                <div className="bg-green-50 border-2 border-green-200 rounded-bl-lg p-4 relative">
                  <span className="absolute bottom-2 left-2 text-xs font-medium text-green-700">
                    Monitorear
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {getQuadrantStakeholders('monitor').map(pos => {
                      const stakeholder = plan.stakeholderRegister.find(s => s.id === pos.stakeholderId);
                      if (!stakeholder) return null;
                      return (
                        <div
                          key={pos.stakeholderId}
                          className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold text-green-800 cursor-pointer hover:bg-green-300"
                          title={stakeholder.name}
                        >
                          {stakeholder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Right - Keep Informed */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-br-lg p-4 relative">
                  <span className="absolute bottom-2 right-2 text-xs font-medium text-blue-700">
                    Mantener Informado
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {getQuadrantStakeholders('keep_informed').map(pos => {
                      const stakeholder = plan.stakeholderRegister.find(s => s.id === pos.stakeholderId);
                      if (!stakeholder) return null;
                      return (
                        <div
                          key={pos.stakeholderId}
                          className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 cursor-pointer hover:bg-blue-300"
                          title={stakeholder.name}
                        >
                          {stakeholder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* X-axis label */}
              <div className="text-center mt-4">
                <span className="text-sm font-medium text-gray-600">INTERÉS</span>
              </div>

              {/* Arrows */}
              <div className="absolute -left-8 top-0 h-full flex items-center">
                <span className="text-gray-400">↑ Alto</span>
              </div>
              <div className="absolute -left-8 bottom-0">
                <span className="text-gray-400">Bajo</span>
              </div>
              <div className="absolute bottom-0 left-0">
                <span className="text-gray-400">Bajo</span>
              </div>
              <div className="absolute bottom-0 right-0">
                <span className="text-gray-400">Alto →</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-8 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-200 rounded" /> Gestionar de Cerca ({getQuadrantStakeholders('manage_closely').length})
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-amber-200 rounded" /> Mantener Satisfecho ({getQuadrantStakeholders('keep_satisfied').length})
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-200 rounded" /> Mantener Informado ({getQuadrantStakeholders('keep_informed').length})
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-200 rounded" /> Monitorear ({getQuadrantStakeholders('monitor').length})
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderEngagement = () => {
    const engagementLevels: EngagementLevel[] = ['unaware', 'resistant', 'neutral', 'supportive', 'leading'];

    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Matriz de Evaluación de Compromiso
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Interesado</th>
                  {engagementLevels.map(level => (
                    <th key={level} className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      {engagementLabels[level]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {plan.stakeholderRegister.map(stakeholder => (
                  <tr key={stakeholder.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                          ${stakeholder.type === 'internal' ? 'bg-blue-500' : 'bg-green-500'}
                        `}>
                          {stakeholder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <span className="font-medium text-gray-900">{stakeholder.name}</span>
                      </div>
                    </td>
                    {engagementLevels.map(level => {
                      const isCurrent = stakeholder.currentEngagement === level;
                      const isDesired = stakeholder.desiredEngagement === level;

                      return (
                        <td key={level} className="px-4 py-3 text-center">
                          {(isCurrent || isDesired) && (
                            <div className="flex items-center justify-center gap-1">
                              {isCurrent && (
                                <span className="text-lg font-bold text-blue-600">C</span>
                              )}
                              {isDesired && (
                                <span className="text-lg font-bold text-green-600">D</span>
                              )}
                              {isCurrent && isDesired && (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              )}
                              {isCurrent && !isDesired && (
                                <TrendingUp className="w-4 h-4 text-amber-500" />
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="font-bold text-blue-600">C</span> = Nivel Actual
            </span>
            <span className="flex items-center gap-1">
              <span className="font-bold text-green-600">D</span> = Nivel Deseado
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> = Alineado
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-amber-500" /> = Requiere Acción
            </span>
          </div>
        </div>

        {/* Engagement strategies */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estrategias de Compromiso
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.engagementStrategy.map((strategy, idx) => {
              const stakeholder = plan.stakeholderRegister.find(s => s.id === strategy.stakeholderId);
              if (!stakeholder) return null;

              return (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                      ${stakeholder.type === 'internal' ? 'bg-blue-500' : 'bg-green-500'}
                    `}>
                      {stakeholder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <span className="font-medium text-gray-900">{stakeholder.name}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Objetivo:</span>
                      <p className="text-gray-900">{strategy.objective}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Enfoque:</span>
                      <p className="text-gray-900">{strategy.approach}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Frecuencia:</span>
                      <span className="ml-2 text-gray-900">{strategy.frequency}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Responsable:</span>
                      <span className="ml-2 text-gray-900">{strategy.responsible}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderIssues = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Registro de Asuntos</h3>
        {!readOnly && (
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1">
            <Plus className="w-4 h-4" /> Nuevo Asunto
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interesado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plan.issuesLog.map(issue => {
              const stakeholder = plan.stakeholderRegister.find(s => s.id === issue.stakeholderId);

              return (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(issue.date).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {stakeholder?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      issue.type === 'complaint' ? 'bg-red-100 text-red-700' :
                      issue.type === 'concern' ? 'bg-amber-100 text-amber-700' :
                      issue.type === 'request' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {issue.type === 'complaint' ? 'Queja' :
                       issue.type === 'concern' ? 'Preocupación' :
                       issue.type === 'request' ? 'Solicitud' : 'Conflicto'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {issue.description}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      issue.priority === 'high' ? 'bg-red-100 text-red-700' :
                      issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {issue.priority === 'high' ? 'Alta' :
                       issue.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{issue.owner}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      issue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      issue.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      issue.status === 'escalated' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {issue.status === 'resolved' ? 'Resuelto' :
                       issue.status === 'in_progress' ? 'En Proceso' :
                       issue.status === 'escalated' ? 'Escalado' : 'Abierto'}
                    </span>
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Plan de Gestión de Interesados</h2>
              <p className="text-sm text-gray-500">Stakeholder Management Plan</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-gray-600">
              <Users className="w-4 h-4" /> {stats.total} interesados
            </span>
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="w-4 h-4" /> {stats.supportive} de apoyo
            </span>
            <span className="flex items-center gap-1 text-amber-600">
              <AlertCircle className="w-4 h-4" /> {stats.openIssues} asuntos abiertos
            </span>
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
                    ? 'border-indigo-600 text-indigo-600'
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
        {activeTab === 'register' && renderRegister()}
        {activeTab === 'matrix' && renderMatrix()}
        {activeTab === 'engagement' && renderEngagement()}
        {activeTab === 'issues' && renderIssues()}
      </div>
    </div>
  );
}
