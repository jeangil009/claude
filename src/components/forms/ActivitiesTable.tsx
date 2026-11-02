import { useState } from 'react';
import {
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Search,
  Plus,
  Filter
} from 'lucide-react';
import { Activity, ActivityCategory, CATEGORY_LABELS } from '../../types';
import { DEFAULT_CURRENCY, formatCurrency } from '../../utils/evmCalculations';
import { ProgressBar } from '../dashboard/ProgressBar';

interface ActivitiesTableProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
  onAdd: () => void;
  onUpdateProgress: (activityId: string, percentComplete: number, actualCost: number) => void;
  currency?: string;
}

type SortField = 'wbsCode' | 'name' | 'percentComplete' | 'plannedCost' | 'actualCost';
type SortOrder = 'asc' | 'desc';

export function ActivitiesTable({
  activities,
  onEdit,
  onDelete,
  onAdd,
  onUpdateProgress,
  currency = DEFAULT_CURRENCY
}: ActivitiesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ActivityCategory | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('wbsCode');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [editingProgress, setEditingProgress] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const [costValue, setCostValue] = useState(0);

  // Filtrar actividades
  const filteredActivities = activities.filter(activity => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.wbsCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.responsable.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Ordenar actividades
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'wbsCode':
        comparison = a.wbsCode.localeCompare(b.wbsCode, undefined, { numeric: true });
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'percentComplete':
        comparison = a.percentComplete - b.percentComplete;
        break;
      case 'plannedCost':
        comparison = a.plannedCost - b.plannedCost;
        break;
      case 'actualCost':
        comparison = a.actualCost - b.actualCost;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const startEditProgress = (activity: Activity) => {
    setEditingProgress(activity.id);
    setProgressValue(activity.percentComplete);
    setCostValue(activity.actualCost);
  };

  const saveProgress = (activityId: string) => {
    onUpdateProgress(activityId, progressValue, costValue);
    setEditingProgress(null);
  };

  const getVarianceColor = (planned: number, actual: number) => {
    if (actual === 0) return 'text-gray-500';
    const variance = planned - actual;
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-lg">
            Actividades del Proyecto
          </h3>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Actividad
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, WBS o responsable..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ActivityCategory | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">Todas las categorías</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('wbsCode')}
              >
                <div className="flex items-center gap-1">
                  WBS
                  {renderSortIcon("wbsCode")}
                </div>
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Actividad
                  {renderSortIcon("name")}
                </div>
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('percentComplete')}
              >
                <div className="flex items-center gap-1">
                  Progreso
                  {renderSortIcon("percentComplete")}
                </div>
              </th>
              <th
                className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('plannedCost')}
              >
                <div className="flex items-center gap-1 justify-end">
                  Planificado
                  {renderSortIcon("plannedCost")}
                </div>
              </th>
              <th
                className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('actualCost')}
              >
                <div className="flex items-center gap-1 justify-end">
                  Real
                  {renderSortIcon("actualCost")}
                </div>
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                EV
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedActivities.map((activity) => {
              const ev = activity.plannedCost * (activity.percentComplete / 100);
              const isEditing = editingProgress === activity.id;

              return (
                <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-gray-600">{activity.wbsCode}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{activity.name}</p>
                      <p className="text-xs text-gray-500">
                        {CATEGORY_LABELS[activity.category]} • {activity.responsable}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 min-w-[150px]">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={progressValue}
                          onChange={(e) => setProgressValue(Number(e.target.value))}
                          min="0"
                          max="100"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    ) : (
                      <ProgressBar
                        value={activity.percentComplete}
                        variant={
                          activity.percentComplete === 100
                            ? 'success'
                            : activity.percentComplete >= 50
                            ? 'info'
                            : 'default'
                        }
                        size="sm"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-gray-900">
                      {formatCurrency(activity.plannedCost, currency)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={costValue}
                        onChange={(e) => setCostValue(Number(e.target.value))}
                        min="0"
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                      />
                    ) : (
                      <span className={`text-sm font-medium ${getVarianceColor(activity.plannedCost, activity.actualCost)}`}>
                        {formatCurrency(activity.actualCost, currency)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-green-600 font-medium">
                      {formatCurrency(ev, currency)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveProgress(activity.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Guardar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setEditingProgress(null)}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                            title="Cancelar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditProgress(activity)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Actualizar progreso"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => onEdit(activity)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(activity.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron actividades</p>
          </div>
        )}
      </div>

      {/* Footer con totales */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Mostrando {sortedActivities.length} de {activities.length} actividades
          </span>
          <div className="flex gap-6">
            <div>
              <span className="text-gray-500">Total Planificado:</span>
              <span className="ml-2 font-semibold text-gray-900">
                {formatCurrency(sortedActivities.reduce((sum, a) => sum + a.plannedCost, 0), currency)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Total Real:</span>
              <span className="ml-2 font-semibold text-gray-900">
                {formatCurrency(sortedActivities.reduce((sum, a) => sum + a.actualCost, 0), currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
