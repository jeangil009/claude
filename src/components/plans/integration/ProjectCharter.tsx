import { useState } from 'react';
import {
  FileText,
  Target,
  Package,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Building2,
  MapPin,
  User,
  Briefcase
} from 'lucide-react';
import type { ProjectCharter, ProjectObjective, Deliverable, Milestone, TeamMember } from '../../../types/pmbok';

interface ProjectCharterProps {
  charter: ProjectCharter;
  onUpdate: (charter: ProjectCharter) => void;
  readOnly?: boolean;
}

export function ProjectCharterComponent({ charter, onUpdate, readOnly = false }: ProjectCharterProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'objectives' | 'deliverables' | 'milestones' | 'constraints'>('general');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempData, setTempData] = useState<Partial<ProjectCharter>>({});

  const tabs = [
    { id: 'general', label: 'Información General', icon: FileText },
    { id: 'objectives', label: 'Objetivos', icon: Target },
    { id: 'deliverables', label: 'Entregables', icon: Package },
    { id: 'milestones', label: 'Hitos', icon: Calendar },
    { id: 'constraints', label: 'Supuestos y Restricciones', icon: AlertTriangle }
  ];

  const startEditing = (section: string) => {
    setEditingSection(section);
    setTempData({ ...charter });
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setTempData({});
  };

  const saveChanges = () => {
    onUpdate({ ...charter, ...tempData, lastUpdated: new Date().toISOString() });
    setEditingSection(null);
    setTempData({});
  };

  const addObjective = () => {
    const newObjective: ProjectObjective = {
      id: crypto.randomUUID(),
      description: '',
      type: 'scope',
      metric: '',
      target: '',
      priority: 'medium'
    };
    const objectives = [...(tempData.objectives || charter.objectives), newObjective];
    setTempData({ ...tempData, objectives });
  };

  const updateObjective = (id: string, updates: Partial<ProjectObjective>) => {
    const objectives = (tempData.objectives || charter.objectives).map(obj =>
      obj.id === id ? { ...obj, ...updates } : obj
    );
    setTempData({ ...tempData, objectives });
  };

  const deleteObjective = (id: string) => {
    const objectives = (tempData.objectives || charter.objectives).filter(obj => obj.id !== id);
    setTempData({ ...tempData, objectives });
  };

  const addDeliverable = () => {
    const newDeliverable: Deliverable = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      wbsCode: '',
      dueDate: '',
      acceptanceCriteria: [],
      status: 'pending',
      assignedTo: ''
    };
    const deliverables = [...(tempData.deliverables || charter.deliverables), newDeliverable];
    setTempData({ ...tempData, deliverables });
  };

  const updateDeliverable = (id: string, updates: Partial<Deliverable>) => {
    const deliverables = (tempData.deliverables || charter.deliverables).map(del =>
      del.id === id ? { ...del, ...updates } : del
    );
    setTempData({ ...tempData, deliverables });
  };

  const deleteDeliverable = (id: string) => {
    const deliverables = (tempData.deliverables || charter.deliverables).filter(del => del.id !== id);
    setTempData({ ...tempData, deliverables });
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      plannedDate: '',
      status: 'pending',
      dependencies: [],
      deliverables: [],
      isCritical: false
    };
    const milestones = [...(tempData.milestones || charter.milestones), newMilestone];
    setTempData({ ...tempData, milestones });
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    const milestones = (tempData.milestones || charter.milestones).map(ms =>
      ms.id === id ? { ...ms, ...updates } : ms
    );
    setTempData({ ...tempData, milestones });
  };

  const deleteMilestone = (id: string) => {
    const milestones = (tempData.milestones || charter.milestones).filter(ms => ms.id !== id);
    setTempData({ ...tempData, milestones });
  };

  const renderGeneralInfo = () => {
    const isEditing = editingSection === 'general';
    const data = isEditing ? tempData : charter;

    return (
      <div className="space-y-6">
        {/* Header con acciones */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Información General del Proyecto</h3>
          {!readOnly && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                  <button
                    onClick={saveChanges}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEditing('general')}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4 inline mr-1" /> Título del Proyecto
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{charter.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building2 className="w-4 h-4 inline mr-1" /> Cliente
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={(data as ProjectCharter).sponsor?.name || ''}
                  onChange={(e) => setTempData({
                    ...tempData,
                    sponsor: { ...tempData.sponsor, name: e.target.value } as TeamMember
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{charter.sponsor?.name || 'No especificado'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" /> Alcance del Proyecto
              </label>
              <div className="text-gray-900">
                <p className="font-medium text-sm">Incluido:</p>
                <ul className="list-disc list-inside text-sm mb-2">
                  {charter.scope?.inScope?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  )) || <li>No especificado</li>}
                </ul>
                <p className="font-medium text-sm">Excluido:</p>
                <ul className="list-disc list-inside text-sm">
                  {charter.scope?.outOfScope?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  )) || <li>No especificado</li>}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" /> Director del Proyecto
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={(data as ProjectCharter).projectManager?.name || ''}
                  onChange={(e) => setTempData({
                    ...tempData,
                    projectManager: { ...tempData.projectManager, name: e.target.value } as TeamMember
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{charter.projectManager?.name || 'No asignado'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" /> Fechas del Proyecto
              </label>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={data.timeline?.startDate || ''}
                    onChange={(e) => setTempData({
                      ...tempData,
                      timeline: { ...tempData.timeline, startDate: e.target.value } as ProjectCharter['timeline']
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={data.timeline?.endDate || ''}
                    onChange={(e) => setTempData({
                      ...tempData,
                      timeline: { ...tempData.timeline, endDate: e.target.value } as ProjectCharter['timeline']
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <p className="text-gray-900">
                  {charter.timeline?.startDate || 'N/A'} - {charter.timeline?.endDate || 'N/A'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-4 h-4 inline mr-1" /> Presupuesto
              </label>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={data.budget?.estimated || 0}
                    onChange={(e) => setTempData({
                      ...tempData,
                      budget: { ...tempData.budget, estimated: parseFloat(e.target.value) } as ProjectCharter['budget']
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={data.budget?.currency || 'MXN'}
                    onChange={(e) => setTempData({
                      ...tempData,
                      budget: { ...tempData.budget, currency: e.target.value } as ProjectCharter['budget']
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MXN">MXN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              ) : (
                <p className="text-gray-900 font-medium">
                  {new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: charter.budget?.currency || 'MXN'
                  }).format(charter.budget?.estimated || 0)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Propósito del proyecto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Briefcase className="w-4 h-4 inline mr-1" /> Propósito del Proyecto
          </label>
          {isEditing ? (
            <textarea
              value={data.purpose || ''}
              onChange={(e) => setTempData({ ...tempData, purpose: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describa el propósito y justificación del proyecto..."
            />
          ) : (
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {charter.purpose || 'No especificado'}
            </p>
          )}
        </div>

        {/* Alcance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dentro del Alcance</label>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              {isEditing ? (
                <textarea
                  value={data.scope?.inScope?.join('\n') || ''}
                  onChange={(e) => setTempData({
                    ...tempData,
                    scope: { ...tempData.scope, inScope: e.target.value.split('\n').filter(Boolean) } as ProjectCharter['scope']
                  })}
                  rows={4}
                  className="w-full px-2 py-1 border border-green-300 rounded"
                  placeholder="Un item por línea..."
                />
              ) : (
                <ul className="space-y-1">
                  {charter.scope?.inScope?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-green-800">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuera del Alcance</label>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              {isEditing ? (
                <textarea
                  value={data.scope?.outOfScope?.join('\n') || ''}
                  onChange={(e) => setTempData({
                    ...tempData,
                    scope: { ...tempData.scope, outOfScope: e.target.value.split('\n').filter(Boolean) } as ProjectCharter['scope']
                  })}
                  rows={4}
                  className="w-full px-2 py-1 border border-red-300 rounded"
                  placeholder="Un item por línea..."
                />
              ) : (
                <ul className="space-y-1">
                  {charter.scope?.outOfScope?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                      <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Estado de aprobación */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estado del Acta</p>
              <p className="font-medium text-gray-900">
                {charter.approvedBy ? 'Aprobada' : 'Pendiente de Aprobación'}
              </p>
            </div>
            {charter.approvedBy && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Aprobado por</p>
                <p className="font-medium text-gray-900">{charter.approvedBy}</p>
                <p className="text-xs text-gray-500">
                  {charter.approvalDate && new Date(charter.approvalDate).toLocaleDateString('es-MX')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderObjectives = () => {
    const isEditing = editingSection === 'objectives';
    const objectives = isEditing ? (tempData.objectives || charter.objectives) : charter.objectives;

    const typeLabels: Record<string, string> = {
      cost: 'Costo',
      schedule: 'Cronograma',
      quality: 'Calidad',
      scope: 'Alcance',
      other: 'Otro'
    };

    const priorityColors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Objetivos del Proyecto</h3>
          {!readOnly && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                  <button
                    onClick={saveChanges}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEditing('objectives')}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
              )}
            </div>
          )}
        </div>

        {isEditing && (
          <button
            onClick={addObjective}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Agregar Objetivo
          </button>
        )}

        <div className="space-y-4">
          {objectives.map((objective) => (
            <div key={objective.id} className="bg-white border border-gray-200 rounded-lg p-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <select
                        value={objective.type}
                        onChange={(e) => updateObjective(objective.id, { type: e.target.value as ProjectObjective['type'] })}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="cost">Costo</option>
                        <option value="schedule">Cronograma</option>
                        <option value="quality">Calidad</option>
                        <option value="scope">Alcance</option>
                        <option value="other">Otro</option>
                      </select>
                      <select
                        value={objective.priority}
                        onChange={(e) => updateObjective(objective.id, { priority: e.target.value as ProjectObjective['priority'] })}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="high">Alta</option>
                        <option value="medium">Media</option>
                        <option value="low">Baja</option>
                      </select>
                    </div>
                    <button
                      onClick={() => deleteObjective(objective.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={objective.description}
                    onChange={(e) => updateObjective(objective.id, { description: e.target.value })}
                    placeholder="Descripción del objetivo..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={objective.metric}
                      onChange={(e) => updateObjective(objective.id, { metric: e.target.value })}
                      placeholder="Métrica..."
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={objective.target}
                      onChange={(e) => updateObjective(objective.id, { target: e.target.value })}
                      placeholder="Meta..."
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                        {typeLabels[objective.type]}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded ${priorityColors[objective.priority]}`}>
                        Prioridad {objective.priority === 'high' ? 'Alta' : objective.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-900 font-medium mb-2">{objective.description}</p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span><strong>Métrica:</strong> {objective.metric}</span>
                    <span><strong>Meta:</strong> {objective.target}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDeliverables = () => {
    const isEditing = editingSection === 'deliverables';
    const deliverables = isEditing ? (tempData.deliverables || charter.deliverables) : charter.deliverables;

    const statusColors: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      approved: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const statusLabels: Record<string, string> = {
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      completed: 'Completado',
      approved: 'Aprobado',
      rejected: 'Rechazado'
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Entregables del Proyecto</h3>
          {!readOnly && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                  <button
                    onClick={saveChanges}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEditing('deliverables')}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
              )}
            </div>
          )}
        </div>

        {isEditing && (
          <button
            onClick={addDeliverable}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Agregar Entregable
          </button>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">WBS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entregable</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                {isEditing && <th className="px-4 py-3"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deliverables.map((deliverable) => (
                <tr key={deliverable.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={deliverable.wbsCode}
                        onChange={(e) => updateDeliverable(deliverable.id, { wbsCode: e.target.value })}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <span className="font-mono text-sm">{deliverable.wbsCode}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={deliverable.name}
                        onChange={(e) => updateDeliverable(deliverable.id, { name: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900">{deliverable.name}</p>
                        <p className="text-sm text-gray-500">{deliverable.description}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={deliverable.assignedTo}
                        onChange={(e) => updateDeliverable(deliverable.id, { assignedTo: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <span className="text-sm text-gray-700">{deliverable.assignedTo}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="date"
                        value={deliverable.dueDate}
                        onChange={(e) => updateDeliverable(deliverable.id, { dueDate: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <span className="text-sm text-gray-700">
                        {deliverable.dueDate && new Date(deliverable.dueDate).toLocaleDateString('es-MX')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <select
                        value={deliverable.status}
                        onChange={(e) => updateDeliverable(deliverable.id, { status: e.target.value as Deliverable['status'] })}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="completed">Completado</option>
                        <option value="approved">Aprobado</option>
                        <option value="rejected">Rechazado</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs rounded ${statusColors[deliverable.status]}`}>
                        {statusLabels[deliverable.status]}
                      </span>
                    )}
                  </td>
                  {isEditing && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteDeliverable(deliverable.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderMilestones = () => {
    const isEditing = editingSection === 'milestones';
    const milestones = isEditing ? (tempData.milestones || charter.milestones) : charter.milestones;

    const statusColors: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-800',
      achieved: 'bg-green-100 text-green-800',
      delayed: 'bg-red-100 text-red-800',
      at_risk: 'bg-yellow-100 text-yellow-800'
    };

    const statusLabels: Record<string, string> = {
      pending: 'Pendiente',
      achieved: 'Alcanzado',
      delayed: 'Retrasado',
      at_risk: 'En Riesgo'
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Hitos del Proyecto</h3>
          {!readOnly && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                  <button
                    onClick={saveChanges}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEditing('milestones')}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
              )}
            </div>
          )}
        </div>

        {isEditing && (
          <button
            onClick={addMilestone}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Agregar Hito
          </button>
        )}

        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`relative pl-8 pb-8 ${index < milestones.length - 1 ? 'border-l-2 border-gray-200' : ''}`}
            >
              <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${
                milestone.status === 'achieved' ? 'bg-green-500' :
                milestone.status === 'delayed' ? 'bg-red-500' :
                milestone.status === 'at_risk' ? 'bg-yellow-500' :
                'bg-gray-300'
              }`} />

              <div className="bg-white border border-gray-200 rounded-lg p-4 ml-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={milestone.isCritical}
                            onChange={(e) => updateMilestone(milestone.id, { isCritical: e.target.checked })}
                          />
                          <span className="text-sm">Crítico</span>
                        </label>
                        <select
                          value={milestone.status}
                          onChange={(e) => updateMilestone(milestone.id, { status: e.target.value as Milestone['status'] })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="achieved">Alcanzado</option>
                          <option value="delayed">Retrasado</option>
                          <option value="at_risk">En Riesgo</option>
                        </select>
                      </div>
                      <button
                        onClick={() => deleteMilestone(milestone.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={milestone.name}
                      onChange={(e) => updateMilestone(milestone.id, { name: e.target.value })}
                      placeholder="Nombre del hito..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      value={milestone.description}
                      onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                      placeholder="Descripción..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={milestone.plannedDate}
                        onChange={(e) => updateMilestone(milestone.id, { plannedDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="date"
                        value={milestone.actualDate || ''}
                        onChange={(e) => updateMilestone(milestone.id, { actualDate: e.target.value })}
                        placeholder="Fecha real"
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                        {milestone.isCritical && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                            Crítico
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs rounded ${statusColors[milestone.status]}`}>
                          {statusLabels[milestone.status]}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-500">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Planificado: {milestone.plannedDate && new Date(milestone.plannedDate).toLocaleDateString('es-MX')}
                      </span>
                      {milestone.actualDate && (
                        <span className="text-gray-500">
                          Real: {new Date(milestone.actualDate).toLocaleDateString('es-MX')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderConstraints = () => {
    const isEditing = editingSection === 'constraints';
    const data = isEditing ? tempData : charter;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Supuestos, Restricciones y Riesgos Iniciales</h3>
          {!readOnly && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                  <button
                    onClick={saveChanges}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEditing('constraints')}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Supuestos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Supuestos
            </h4>
            {isEditing ? (
              <textarea
                value={data.assumptions?.join('\n') || ''}
                onChange={(e) => setTempData({
                  ...tempData,
                  assumptions: e.target.value.split('\n').filter(Boolean)
                })}
                rows={8}
                className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
                placeholder="Un supuesto por línea..."
              />
            ) : (
              <ul className="space-y-2">
                {charter.assumptions?.map((item, idx) => (
                  <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Restricciones */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Restricciones
            </h4>
            {isEditing ? (
              <textarea
                value={data.constraints?.join('\n') || ''}
                onChange={(e) => setTempData({
                  ...tempData,
                  constraints: e.target.value.split('\n').filter(Boolean)
                })}
                rows={8}
                className="w-full px-2 py-1 border border-amber-300 rounded text-sm"
                placeholder="Una restricción por línea..."
              />
            ) : (
              <ul className="space-y-2">
                {charter.constraints?.map((item, idx) => (
                  <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Riesgos Iniciales */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Riesgos Iniciales
            </h4>
            {isEditing ? (
              <textarea
                value={data.risks?.join('\n') || ''}
                onChange={(e) => setTempData({
                  ...tempData,
                  risks: e.target.value.split('\n').filter(Boolean)
                })}
                rows={8}
                className="w-full px-2 py-1 border border-red-300 rounded text-sm"
                placeholder="Un riesgo por línea..."
              />
            ) : (
              <ul className="space-y-2">
                {charter.risks?.map((item, idx) => (
                  <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Acta de Constitución del Proyecto</h2>
            <p className="text-sm text-gray-500">Project Charter - Versión {charter.version}</p>
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
                    ? 'border-blue-600 text-blue-600'
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
        {activeTab === 'general' && renderGeneralInfo()}
        {activeTab === 'objectives' && renderObjectives()}
        {activeTab === 'deliverables' && renderDeliverables()}
        {activeTab === 'milestones' && renderMilestones()}
        {activeTab === 'constraints' && renderConstraints()}
      </div>
    </div>
  );
}
