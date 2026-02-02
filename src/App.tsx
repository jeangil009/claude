import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { ActivitiesTable } from './components/forms/ActivitiesTable';
import { ActivityForm } from './components/forms/ActivityForm';
import { ProjectSettings } from './components/forms/ProjectSettings';
import { useProject } from './hooks/useProject';
import { Activity } from './types';

// PMBOK Plan Components
import { ProjectManagementDashboard } from './components/plans/ProjectManagementDashboard';
import { ProjectCharterComponent } from './components/plans/integration/ProjectCharter';
import { WBSViewer } from './components/plans/scope/WBSViewer';
import { GanttChart } from './components/plans/schedule/GanttChart';
import { QualityPlan } from './components/plans/quality/QualityPlan';
import { ResourcePlan } from './components/plans/resources/ResourcePlan';
import { RiskMatrix } from './components/plans/risk/RiskMatrix';
import { StakeholderPlan } from './components/plans/stakeholder/StakeholderPlan';
import { HSEPlan } from './components/plans/hse/HSEPlan';

// Sample Data
import { sampleProjectManagementPlan } from './data/sampleProjectPlan';

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

  const [currentView, setCurrentView] = useState('project-plan');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [projectPlan, setProjectPlan] = useState(sampleProjectManagementPlan);

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
    const data = {
      project,
      metrics,
      projectPlan,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'project-plan':
        return (
          <ProjectManagementDashboard
            projectPlan={projectPlan}
            evmMetrics={metrics}
            onNavigateTo={setCurrentView}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            project={project}
            metrics={metrics}
            chartData={chartData}
            activitySummaries={activitySummaries}
            trends={trends}
            recommendations={recommendations}
          />
        );

      case 'activities':
        return (
          <ActivitiesTable
            activities={project.activities}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
            onAdd={handleAddActivity}
            onUpdateProgress={updateActivityProgress}
          />
        );

      case 'settings':
        return (
          <ProjectSettings
            project={project}
            onUpdate={updateProject}
            onRecalculateBudget={recalculateBudget}
            onExport={handleExport}
            onReset={resetToSampleData}
          />
        );

      case 'integration':
        return (
          <ProjectCharterComponent
            charter={projectPlan.projectCharter}
            onUpdate={(charter) => setProjectPlan({
              ...projectPlan,
              projectCharter: charter
            })}
          />
        );

      case 'scope':
        return (
          <WBSViewer
            wbs={projectPlan.scopeManagementPlan.wbs}
            dictionary={projectPlan.scopeManagementPlan.wbsDictionary}
            onUpdateWBS={(wbs) => setProjectPlan({
              ...projectPlan,
              scopeManagementPlan: {
                ...projectPlan.scopeManagementPlan,
                wbs
              }
            })}
            onUpdateDictionary={(dictionary) => setProjectPlan({
              ...projectPlan,
              scopeManagementPlan: {
                ...projectPlan.scopeManagementPlan,
                wbsDictionary: dictionary
              }
            })}
          />
        );

      case 'schedule':
        return (
          <GanttChart
            activities={projectPlan.scheduleManagementPlan.activities}
            dependencies={projectPlan.scheduleManagementPlan.dependencies}
            milestones={projectPlan.projectCharter.milestones}
            projectStart={projectPlan.projectCharter.timeline.startDate}
            projectEnd={projectPlan.projectCharter.timeline.endDate}
            onActivityClick={(activity) => console.log('Activity clicked:', activity)}
          />
        );

      case 'cost':
        // Redirect to EVM Dashboard for cost management
        return (
          <Dashboard
            project={project}
            metrics={metrics}
            chartData={chartData}
            activitySummaries={activitySummaries}
            trends={trends}
            recommendations={recommendations}
          />
        );

      case 'quality':
        return (
          <QualityPlan
            plan={projectPlan.qualityManagementPlan}
            onUpdate={(plan) => setProjectPlan({
              ...projectPlan,
              qualityManagementPlan: plan
            })}
          />
        );

      case 'resources':
        return (
          <ResourcePlan
            plan={projectPlan.resourceManagementPlan}
            onUpdate={(plan) => setProjectPlan({
              ...projectPlan,
              resourceManagementPlan: plan
            })}
          />
        );

      case 'communications':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Plan de Comunicaciones</h3>
              <p className="text-gray-600 mb-4">
                La matriz de comunicaciones y el plan de distribución de información están disponibles en la sección de configuración del proyecto.
              </p>
              <p className="text-sm text-gray-500">
                Incluye: Matriz de comunicaciones, calendario de reuniones, formatos de reportes y procedimientos de escalamiento.
              </p>
            </div>
          </div>
        );

      case 'risks':
        return (
          <RiskMatrix
            risks={projectPlan.riskManagementPlan.riskRegister}
            categories={projectPlan.riskManagementPlan.riskCategories}
            probabilityImpactMatrix={projectPlan.riskManagementPlan.probabilityImpactMatrix}
            onAddRisk={() => console.log('Add risk')}
            onEditRisk={(risk) => console.log('Edit risk:', risk)}
            onDeleteRisk={(riskId) => console.log('Delete risk:', riskId)}
            onViewRisk={(risk) => console.log('View risk:', risk)}
          />
        );

      case 'procurement':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Plan de Adquisiciones</h3>
              <p className="text-gray-600 mb-4">
                Gestión de contratos, proveedores y órdenes de compra del proyecto.
              </p>
              <div className="grid grid-cols-2 gap-4 text-left mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">{projectPlan.procurementManagementPlan.vendors.length}</p>
                  <p className="text-sm text-gray-500">Proveedores</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">{projectPlan.procurementManagementPlan.contracts.length}</p>
                  <p className="text-sm text-gray-500">Contratos</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'stakeholders':
        return (
          <StakeholderPlan
            plan={projectPlan.stakeholderManagementPlan}
            onUpdate={(plan) => setProjectPlan({
              ...projectPlan,
              stakeholderManagementPlan: plan
            })}
          />
        );

      case 'hse':
        return (
          <HSEPlan
            plan={projectPlan.hseManagementPlan}
            onUpdate={(plan) => setProjectPlan({
              ...projectPlan,
              hseManagementPlan: plan
            })}
          />
        );

      case 'changes':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Control de Cambios</h2>
                <p className="text-sm text-gray-500">Change Control Board (CCB)</p>
              </div>
            </div>

            {/* CCB Members */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Miembros del CCB</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projectPlan.changeManagementPlan.changeControlBoard.members.map((member, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded ${
                      member.votingRights ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {member.votingRights ? 'Con voto' : 'Sin voto'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Log */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Registro de Cambios</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridad</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impacto Costo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projectPlan.changeManagementPlan.changeLog.map(change => (
                      <tr key={change.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm">{change.number}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{change.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{change.description}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                            {change.type === 'scope' ? 'Alcance' :
                             change.type === 'schedule' ? 'Cronograma' :
                             change.type === 'cost' ? 'Costo' : change.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            change.priority === 'high' ? 'bg-red-100 text-red-700' :
                            change.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {change.priority === 'high' ? 'Alta' :
                             change.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {change.impactAnalysis?.costImpact.amount !== undefined && (
                            <span className={change.impactAnalysis.costImpact.amount >= 0 ? 'text-red-600' : 'text-green-600'}>
                              {change.impactAnalysis.costImpact.amount >= 0 ? '+' : ''}
                              ${change.impactAnalysis.costImpact.amount.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            change.status === 'approved' ? 'bg-green-100 text-green-700' :
                            change.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            change.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {change.status === 'approved' ? 'Aprobado' :
                             change.status === 'rejected' ? 'Rechazado' :
                             change.status === 'completed' ? 'Completado' :
                             change.status === 'submitted' ? 'Enviado' :
                             change.status === 'analysis' ? 'En Análisis' : change.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <ProjectManagementDashboard
            projectPlan={projectPlan}
            evmMetrics={metrics}
            onNavigateTo={setCurrentView}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        projectName={project.name}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
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
              <p className="font-medium text-gray-700">Sistema de Gestión de Proyectos de Construcción</p>
              <p>Basado en PMBOK 7ma Edición y estándares PMI</p>
            </div>
            <div className="text-sm text-gray-400">
              <p>Incluye: EVM, EDT/WBS, Gantt, Riesgos, Calidad, HSE</p>
              <p>Versión del Plan: {projectPlan.version}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
