import { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { Activity, ActivityCategory, CATEGORY_LABELS } from '../../types';

interface ActivityFormProps {
  activity?: Activity;
  onSave: (activity: Omit<Activity, 'id'> | Activity) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function ActivityForm({ activity, onSave, onCancel, isEditing = false }: ActivityFormProps) {
  const [formData, setFormData] = useState({
    wbsCode: activity?.wbsCode || '',
    name: activity?.name || '',
    description: activity?.description || '',
    plannedStartDate: activity?.plannedStartDate || new Date().toISOString().split('T')[0],
    plannedEndDate: activity?.plannedEndDate || (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split('T')[0]; })(),
    actualStartDate: activity?.actualStartDate || '',
    actualEndDate: activity?.actualEndDate || '',
    plannedCost: activity?.plannedCost || 0,
    actualCost: activity?.actualCost || 0,
    percentComplete: activity?.percentComplete || 0,
    responsable: activity?.responsable || '',
    category: activity?.category || 'otros' as ActivityCategory
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.wbsCode.trim()) newErrors.wbsCode = 'El código WBS es requerido';
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.plannedStartDate) newErrors.plannedStartDate = 'La fecha de inicio es requerida';
    if (!formData.plannedEndDate) newErrors.plannedEndDate = 'La fecha de fin es requerida';
    if (formData.plannedCost < 0) newErrors.plannedCost = 'El costo no puede ser negativo';
    if (formData.percentComplete < 0 || formData.percentComplete > 100) {
      newErrors.percentComplete = 'El progreso debe estar entre 0 y 100';
    }
    if (new Date(formData.plannedEndDate) < new Date(formData.plannedStartDate)) {
      newErrors.plannedEndDate = 'La fecha de fin debe ser posterior a la de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && activity) {
      onSave({ ...formData, id: activity.id });
    } else {
      onSave(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    // Limpiar error al modificar campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar Actividad' : 'Nueva Actividad'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código WBS *
              </label>
              <input
                type="text"
                name="wbsCode"
                value={formData.wbsCode}
                onChange={handleChange}
                placeholder="Ej: 1.2.3"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.wbsCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.wbsCode && <p className="text-red-500 text-xs mt-1">{errors.wbsCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Actividad *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre descriptivo de la actividad"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Descripción detallada de la actividad"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Fechas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio Planificada *
              </label>
              <input
                type="date"
                name="plannedStartDate"
                value={formData.plannedStartDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.plannedStartDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.plannedStartDate && <p className="text-red-500 text-xs mt-1">{errors.plannedStartDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin Planificada *
              </label>
              <input
                type="date"
                name="plannedEndDate"
                value={formData.plannedEndDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.plannedEndDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.plannedEndDate && <p className="text-red-500 text-xs mt-1">{errors.plannedEndDate}</p>}
            </div>
          </div>

          {/* Fechas reales (solo en edición) */}
          {isEditing && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio Real
                </label>
                <input
                  type="date"
                  name="actualStartDate"
                  value={formData.actualStartDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin Real
                </label>
                <input
                  type="date"
                  name="actualEndDate"
                  value={formData.actualEndDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Costos y progreso */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo Planificado (BAC)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  name="plannedCost"
                  value={formData.plannedCost}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.plannedCost ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.plannedCost && <p className="text-red-500 text-xs mt-1">{errors.plannedCost}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo Real (AC)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  name="actualCost"
                  value={formData.actualCost}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                % Completado
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="percentComplete"
                  value={formData.percentComplete}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="5"
                  className={`w-full px-3 py-2 pr-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.percentComplete ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
              {errors.percentComplete && <p className="text-red-500 text-xs mt-1">{errors.percentComplete}</p>}
            </div>
          </div>

          {/* Responsable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable
            </label>
            <input
              type="text"
              name="responsable"
              value={formData.responsable}
              onChange={handleChange}
              placeholder="Nombre del responsable"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isEditing ? 'Guardar Cambios' : 'Agregar Actividad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
