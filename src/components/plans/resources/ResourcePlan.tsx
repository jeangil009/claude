import { useState } from 'react';
import {
  Users,
  Wrench,
  Package,
  UserCheck,
  Calendar,
  DollarSign,
  BarChart2,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  User,
  Award,
  Clock
} from 'lucide-react';
import type {
  ResourceManagementPlan,
  TeamMember,
  RACIEntry,
  Material,
  Equipment,
  OrganizationalUnit,
  StaffingRequirement
} from '../../../types/pmbok';

interface ResourcePlanProps {
  plan: ResourceManagementPlan;
  onUpdate: (plan: ResourceManagementPlan) => void;
  readOnly?: boolean;
}

export function ResourcePlan({ plan, onUpdate, readOnly = false }: ResourcePlanProps) {
  const [activeTab, setActiveTab] = useState<'team' | 'raci' | 'materials' | 'equipment' | 'staffing'>('team');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const tabs = [
    { id: 'team', label: 'Equipo', icon: Users },
    { id: 'raci', label: 'Matriz RACI', icon: UserCheck },
    { id: 'materials', label: 'Materiales', icon: Package },
    { id: 'equipment', label: 'Equipos', icon: Wrench },
    { id: 'staffing', label: 'Dotación', icon: Calendar }
  ];

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Render organizational chart node
  const renderOrgNode = (node: OrganizationalUnit, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id} className="select-none">
        <div
          className={`
            flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-colors
            hover:bg-gray-50 border border-transparent hover:border-gray-200
          `}
          style={{ marginLeft: `${depth * 32}px` }}
          onClick={() => {
            if (hasChildren) toggleNode(node.id);
            if (node.person) setSelectedMember(node.person);
          }}
        >
          {hasChildren && (
            <button className="p-0.5">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}

          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-white font-medium
            ${depth === 0 ? 'bg-blue-600' :
              depth === 1 ? 'bg-green-600' :
              depth === 2 ? 'bg-amber-600' : 'bg-gray-600'}
          `}>
            {node.person?.name?.charAt(0) || node.name.charAt(0)}
          </div>

          <div className="flex-1">
            <p className="font-medium text-gray-900">{node.name}</p>
            <p className="text-sm text-gray-500">{node.role}</p>
          </div>

          {node.person && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
              Asignado
            </span>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div>
            {node.children?.map(child => renderOrgNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderTeam = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Organizational Chart */}
      <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Organigrama del Proyecto</h3>
        <div className="max-h-[500px] overflow-y-auto">
          {renderOrgNode(plan.humanResources.organizationalChart)}
        </div>
      </div>

      {/* Selected Member Details or Team Summary */}
      <div className="space-y-4">
        {selectedMember ? (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedMember.name}</h3>
                <p className="text-sm text-gray-500">{selectedMember.role}</p>
                <span className={`px-2 py-0.5 text-xs rounded ${
                  selectedMember.status === 'active' ? 'bg-green-100 text-green-700' :
                  selectedMember.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {selectedMember.status === 'active' ? 'Activo' :
                   selectedMember.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{selectedMember.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Teléfono</label>
                <p className="text-sm text-gray-900">{selectedMember.phone}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Organización</label>
                <p className="text-sm text-gray-900">{selectedMember.organization}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Departamento</label>
                <p className="text-sm text-gray-900">{selectedMember.department}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Tarifa</label>
                <p className="text-sm text-gray-900">
                  ${selectedMember.costRate.toLocaleString()} / {selectedMember.costRateUnit}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Disponibilidad</label>
                <p className="text-sm text-gray-900">{selectedMember.availability.percentAllocation}%</p>
              </div>

              {/* Skills */}
              <div>
                <label className="text-xs text-gray-500">Habilidades</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedMember.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 text-xs rounded ${
                        skill.level === 'expert' ? 'bg-purple-100 text-purple-700' :
                        skill.level === 'advanced' ? 'bg-blue-100 text-blue-700' :
                        skill.level === 'intermediate' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {selectedMember.certifications.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500">Certificaciones</label>
                  <div className="space-y-1 mt-1">
                    {selectedMember.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>{cert.name}</span>
                        <span className={`text-xs ${
                          cert.status === 'valid' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ({cert.status === 'valid' ? 'Vigente' : 'Vencida'})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Resumen del Equipo</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Total Miembros</span>
                <span className="font-semibold text-gray-900">
                  {plan.humanResources.teamMembers.length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Activos</span>
                <span className="font-semibold text-green-600">
                  {plan.humanResources.teamMembers.filter(m => m.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Roles Definidos</span>
                <span className="font-semibold text-gray-900">
                  {plan.humanResources.roles.length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Necesidades de Capacitación</span>
                <span className="font-semibold text-amber-600">
                  {plan.humanResources.trainingNeeds.length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Team Members List */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Miembros del Equipo</h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {plan.humanResources.teamMembers.map(member => (
              <div
                key={member.id}
                className={`
                  flex items-center gap-3 p-2 rounded cursor-pointer transition-colors
                  ${selectedMember?.id === member.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                `}
                onClick={() => setSelectedMember(member)}
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                  <p className="text-xs text-gray-500 truncate">{member.role}</p>
                </div>
                <span className={`w-2 h-2 rounded-full ${
                  member.status === 'active' ? 'bg-green-500' :
                  member.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRACI = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">
              Actividad / WBS
            </th>
            {plan.humanResources.teamMembers.slice(0, 8).map(member => (
              <th
                key={member.id}
                className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border-b min-w-[80px]"
              >
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-xs font-bold text-blue-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="truncate max-w-[70px]">{member.name.split(' ')[0]}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {plan.humanResources.raciMatrix.map((entry, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div>
                  <span className="font-mono text-xs text-gray-400">{entry.wbsCode}</span>
                  <p className="text-sm text-gray-900">{entry.activity}</p>
                </div>
              </td>
              {plan.humanResources.teamMembers.slice(0, 8).map(member => {
                const isResponsible = entry.responsible.includes(member.name);
                const isAccountable = entry.accountable === member.name;
                const isConsulted = entry.consulted.includes(member.name);
                const isInformed = entry.informed.includes(member.name);

                let role = '';
                let bgColor = '';

                if (isAccountable) {
                  role = 'A';
                  bgColor = 'bg-red-100 text-red-700';
                } else if (isResponsible) {
                  role = 'R';
                  bgColor = 'bg-blue-100 text-blue-700';
                } else if (isConsulted) {
                  role = 'C';
                  bgColor = 'bg-amber-100 text-amber-700';
                } else if (isInformed) {
                  role = 'I';
                  bgColor = 'bg-green-100 text-green-700';
                }

                return (
                  <td key={member.id} className="px-2 py-3 text-center">
                    {role && (
                      <span className={`inline-flex w-8 h-8 items-center justify-center rounded-full font-bold text-sm ${bgColor}`}>
                        {role}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* RACI Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">R</span>
          Responsible (Responsable)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-xs">A</span>
          Accountable (Aprobador)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-xs">C</span>
          Consulted (Consultado)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xs">I</span>
          Informed (Informado)
        </span>
      </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Materiales</p>
              <p className="text-2xl font-bold text-gray-900">
                {plan.materialResources.materials.length}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Costo Estimado</p>
              <p className="text-2xl font-bold text-gray-900">
                ${plan.materialResources.materials.reduce((sum, m) => sum + (m.unitCost * m.totalQuantityRequired), 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Peligrosos</p>
              <p className="text-2xl font-bold text-red-600">
                {plan.materialResources.materials.filter(m => m.hazardous).length}
              </p>
            </div>
            <Package className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Órdenes Pendientes</p>
              <p className="text-2xl font-bold text-amber-600">
                {plan.materialResources.procurementSchedule.filter(p => p.status === 'planned' || p.status === 'ordered').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Materials table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidad</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Costo Unit.</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead Time</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plan.materialResources.materials.map(material => (
              <tr key={material.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm text-gray-600">{material.code}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{material.name}</span>
                    {material.hazardous && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                        Peligroso
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate max-w-xs">{material.description}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {material.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{material.unit}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                  {material.totalQuantityRequired.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  ${material.unitCost.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                  ${(material.unitCost * material.totalQuantityRequired).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {material.leadTime} días
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div className="space-y-6">
      {/* Equipment grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.equipmentResources.equipment.map(equip => (
          <div key={equip.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wrench className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{equip.name}</h4>
                  <p className="text-sm text-gray-500">{equip.brand} {equip.model}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                equip.status === 'available' ? 'bg-green-100 text-green-700' :
                equip.status === 'in_use' ? 'bg-blue-100 text-blue-700' :
                equip.status === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {equip.status === 'available' ? 'Disponible' :
                 equip.status === 'in_use' ? 'En Uso' :
                 equip.status === 'maintenance' ? 'Mantenimiento' : 'No Disponible'}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Código:</span>
                <span className="font-mono text-gray-900">{equip.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Serie:</span>
                <span className="text-gray-900">{equip.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Capacidad:</span>
                <span className="text-gray-900">{equip.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Propiedad:</span>
                <span className={`px-2 py-0.5 text-xs rounded ${
                  equip.ownership === 'owned' ? 'bg-green-100 text-green-700' :
                  equip.ownership === 'rented' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {equip.ownership === 'owned' ? 'Propio' :
                   equip.ownership === 'rented' ? 'Alquilado' : 'Leasing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tarifa Diaria:</span>
                <span className="font-medium text-gray-900">${equip.dailyRate.toLocaleString()}</span>
              </div>
              {equip.operatorRequired && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Costo Operador:</span>
                  <span className="text-gray-900">${equip.operatorCost.toLocaleString()}/día</span>
                </div>
              )}
            </div>

            {equip.certifications.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-500 mb-1">Certificaciones requeridas:</p>
                <div className="flex flex-wrap gap-1">
                  {equip.certifications.map((cert, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStaffing = () => (
    <div className="space-y-6">
      {/* Staffing timeline chart placeholder */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan de Dotación de Personal</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Habilidades</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fin</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asignado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {plan.humanResources.staffingPlan.map((req, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{req.role}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex w-8 h-8 items-center justify-center bg-blue-100 text-blue-700 rounded-full font-bold">
                      {req.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {req.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {req.skills.length > 3 && (
                        <span className="text-xs text-gray-400">+{req.skills.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      req.source === 'internal' ? 'bg-green-100 text-green-700' :
                      req.source === 'external' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {req.source === 'internal' ? 'Interno' :
                       req.source === 'external' ? 'Externo' : 'Contratista'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(req.startDate).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(req.endDate).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      req.status === 'assigned' ? 'bg-green-100 text-green-700' :
                      req.status === 'requested' ? 'bg-blue-100 text-blue-700' :
                      req.status === 'released' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status === 'assigned' ? 'Asignado' :
                       req.status === 'requested' ? 'Solicitado' :
                       req.status === 'released' ? 'Liberado' : 'Planificado'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {req.assignedPerson || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training needs */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Necesidades de Capacitación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.humanResources.trainingNeeds.map(training => (
            <div
              key={training.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{training.topic}</h4>
                <span className={`px-2 py-0.5 text-xs rounded ${
                  training.priority === 'high' ? 'bg-red-100 text-red-700' :
                  training.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {training.priority === 'high' ? 'Alta' :
                   training.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{training.description}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {training.duration}h
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> ${training.cost.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {training.targetAudience.length} personas
                </span>
              </div>
              <div className="mt-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  training.status === 'completed' ? 'bg-green-100 text-green-700' :
                  training.status === 'planned' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {training.status === 'completed' ? 'Completado' :
                   training.status === 'planned' ? 'Planificado' : 'Identificado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Plan de Gestión de Recursos</h2>
            <p className="text-sm text-gray-500">Resource Management Plan</p>
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
                    ? 'border-purple-600 text-purple-600'
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
        {activeTab === 'team' && renderTeam()}
        {activeTab === 'raci' && renderRACI()}
        {activeTab === 'materials' && renderMaterials()}
        {activeTab === 'equipment' && renderEquipment()}
        {activeTab === 'staffing' && renderStaffing()}
      </div>
    </div>
  );
}
