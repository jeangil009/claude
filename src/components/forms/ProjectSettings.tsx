import { useRef, useState } from 'react';
import { format } from 'date-fns';
import { Save, RotateCcw, Download, Upload, Settings, Camera, Trash2 } from 'lucide-react';
import { Project, ProjectStatus, STATUS_LABELS } from '../../types';
import { formatCurrency } from '../../utils/evmCalculations';

interface ProjectSettingsProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
  onRecalculateBudget: () => void;
  onExport: () => void;
  onReset: () => void;
  onSaveSnapshot: (date: string) => void;
  onDeleteSnapshot: (date: string) => void;
  onImport: (data: unknown) => Project | null;
}

export function ProjectSettings({
  project,
  onUpdate,
  onRecalculateBudget,
  onExport,
  onReset,
  onSaveSnapshot,
  onDeleteSnapshot,
  onImport
}: ProjectSettingsProps) {
  const [snapshotDate, setSnapshotDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    client: project.client,
    location: project.location,
    startDate: project.startDate,
    plannedEndDate: project.plannedEndDate,
    budget: project.budget,
    currency: project.currency,
    status: project.status
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = onImport(JSON.parse(await file.text()));
      if (imported) {
        // El formulario toma su estado inicial una sola vez: refrescarlo con lo importado
        setFormData({
          name: imported.name,
          description: imported.description,
          client: imported.client,
          location: imported.location,
          startDate: imported.startDate,
          plannedEndDate: imported.plannedEndDate,
          budget: imported.budget,
          currency: imported.currency,
          status: imported.status
        });
        setHasChanges(false);
        setImportMessage('Proyecto importado correctamente.');
      } else {
        setImportMessage('El archivo no tiene el formato de proyecto esperado.');
      }
    } catch {
      setImportMessage('No se pudo leer el archivo JSON.');
    }
    e.target.value = '';
  };

  const handleExportJSON = () => {
    const data = {
      project,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evm-${project.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Información del proyecto */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Información del Proyecto</h3>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Proyecto
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin Planificada
              </label>
              <input
                type="date"
                name="plannedEndDate"
                value={formData.plannedEndDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presupuesto (BAC)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  min="0"
                  step="10000"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="MXN">MXN - Peso Mexicano</option>
                <option value="USD">USD - Dólar Estadounidense</option>
                <option value="EUR">EUR - Euro</option>
                <option value="COP">COP - Peso Colombiano</option>
                <option value="ARS">ARS - Peso Argentino</option>
                <option value="CLP">CLP - Peso Chileno</option>
                <option value="PEN">PEN - Sol Peruano</option>
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                hasChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>

            <button
              onClick={onRecalculateBudget}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Recalcular Presupuesto
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de actividades */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Resumen del Proyecto</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Total Actividades</p>
            <p className="text-2xl font-bold text-blue-700">{project.activities.length}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600">Completadas</p>
            <p className="text-2xl font-bold text-green-700">
              {project.activities.filter(a => a.percentComplete === 100).length}
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-600">En Progreso</p>
            <p className="text-2xl font-bold text-amber-700">
              {project.activities.filter(a => a.percentComplete > 0 && a.percentComplete < 100).length}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-gray-700">
              {project.activities.filter(a => a.percentComplete === 0).length}
            </p>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Presupuesto Total (BAC)</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(project.budget, project.currency)}
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Suma de Actividades</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(
                project.activities.reduce((sum, a) => sum + a.plannedCost, 0),
                project.currency
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Cortes de avance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Camera className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Cortes de Avance</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Un corte guarda PV, EV y AC acumulados a una fecha, con el avance y costo real que tengan
          las actividades en este momento. Registre un corte en cada fecha de informe: con ellos la
          Curva S y la animación usan datos reales en lugar de una aproximación.
        </p>
        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div>
            <label htmlFor="snapshot-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha del corte</label>
            <input
              id="snapshot-date"
              type="date"
              value={snapshotDate}
              onChange={e => setSnapshotDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            onClick={() => snapshotDate && onSaveSnapshot(snapshotDate)}
            disabled={!snapshotDate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            <Camera className="w-4 h-4" />
            Guardar corte
          </button>
        </div>

        {(project.history ?? []).length === 0 ? (
          <p className="text-sm text-gray-500">Aún no hay cortes registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="snapshots-table">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2 pr-4 text-right">PV</th>
                  <th className="py-2 pr-4 text-right">EV</th>
                  <th className="py-2 pr-4 text-right">AC</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {(project.history ?? []).map(h => (
                  <tr key={h.date} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium text-gray-900">{h.date}</td>
                    <td className="py-2 pr-4 text-right">{formatCurrency(h.PV, project.currency)}</td>
                    <td className="py-2 pr-4 text-right">{formatCurrency(h.EV, project.currency)}</td>
                    <td className="py-2 pr-4 text-right">{formatCurrency(h.AC, project.currency)}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => onDeleteSnapshot(h.date)}
                        aria-label={`Eliminar corte ${h.date}`}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Acciones de datos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Gestión de Datos</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Proyecto (JSON)
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
          >
            <Upload className="w-4 h-4" />
            Importar Proyecto (JSON)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            className="hidden"
            data-testid="import-input"
          />

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar Datos de Ejemplo
          </button>
        </div>
        {importMessage && (
          <p className="text-sm text-blue-700 mt-3" role="status">{importMessage}</p>
        )}
        <p className="text-sm text-gray-500 mt-3">
          Nota: Los datos se guardan en este navegador (almacenamiento local) y se pierden si borra los datos del sitio.
          Exporte regularmente para mantener un respaldo.
        </p>
      </div>
    </div>
  );
}
