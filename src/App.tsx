import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { ActivitiesTable } from './components/forms/ActivitiesTable';
import { ActivityForm } from './components/forms/ActivityForm';
import { ProjectSettings } from './components/forms/ProjectSettings';
import { useProject } from './hooks/useProject';
import { Activity } from './types';
import { exportFullReport } from './utils/exportUtils';

function App() {
  const {
    project,
    metrics,
    chartData,
    activitySummaries,
    trends,
    recommendations,
    updateProject,
    addActivity,
    updateActivity,
    deleteActivity,
    updateActivityProgress,
    recalculateBudget,
    resetToSampleData
  } = useProject();

  const [currentView, setCurrentView] = useState('dashboard');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleAddActivity = () => {
    setEditingActivity(null);
    setShowActivityForm(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowActivityForm(true);
  };

  const handleSaveActivity = (activityData: Omit<Activity, 'id'> | Activity) => {
    if ('id' in activityData) {
      updateActivity(activityData.id, activityData);
    } else {
      addActivity(activityData);
    }
    setShowActivityForm(false);
    setEditingActivity(null);
  };

  const handleDeleteActivity = (activityId: string) => {
    setShowDeleteConfirm(activityId);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteActivity(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleExport = () => {
    exportFullReport(project, metrics, activitySummaries);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        projectName={project.name}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            project={project}
            metrics={metrics}
            chartData={chartData}
            activitySummaries={activitySummaries}
            trends={trends}
            recommendations={recommendations}
          />
        )}

        {currentView === 'activities' && (
          <ActivitiesTable
            activities={project.activities}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
            onAdd={handleAddActivity}
            onUpdateProgress={updateActivityProgress}
          />
        )}

        {currentView === 'settings' && (
          <ProjectSettings
            project={project}
            onUpdate={updateProject}
            onRecalculateBudget={recalculateBudget}
            onExport={handleExport}
            onReset={resetToSampleData}
          />
        )}
      </main>

      {/* Modal de formulario de actividad */}
      {showActivityForm && (
        <ActivityForm
          activity={editingActivity || undefined}
          onSave={handleSaveActivity}
          onCancel={() => {
            setShowActivityForm(false);
            setEditingActivity(null);
          }}
          isEditing={!!editingActivity}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Está seguro de que desea eliminar esta actividad? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              <p className="font-medium text-gray-700">EVM Pro - Sistema de Valor Ganado</p>
              <p>Gestión de proyectos de construcción con técnica de Earned Value Management</p>
            </div>
            <div className="text-sm text-gray-400">
              <p>Desarrollado para control de proyectos</p>
              <p>Basado en estándares PMBOK</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
