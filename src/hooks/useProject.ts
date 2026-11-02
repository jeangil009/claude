import { useState, useCallback, useMemo, useEffect } from 'react';
import { Project, Activity, EVMMetrics, ChartDataPoint, ActivitySummary, TrendAnalysis } from '../types';
import {
  calculateAllEVMMetrics,
  generateSCurveData,
  generateActivitySummaries,
  analyzeTrends,
  generateRecommendations
} from '../utils/evmCalculations';
import { sampleProject } from '../data/sampleProject';
import { clearStoredProject, loadProject, saveProject } from '../utils/projectStorage';
import { v4 as uuidv4 } from 'uuid';

export function useProject() {
  // Carga el proyecto guardado en el navegador; si no hay (o está dañado), usa el ejemplo
  const [project, setProject] = useState<Project>(() => loadProject() ?? sampleProject);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Guardar automáticamente cada cambio del proyecto
  useEffect(() => {
    saveProject(project);
  }, [project]);

  // Calcular métricas EVM
  const metrics: EVMMetrics = useMemo(() => {
    return calculateAllEVMMetrics(project, selectedDate);
  }, [project, selectedDate]);

  // Generar datos para gráfica de Curva S
  const chartData: ChartDataPoint[] = useMemo(() => {
    return generateSCurveData(project, 12);
  }, [project]);

  // Generar resumen de actividades
  const activitySummaries: ActivitySummary[] = useMemo(() => {
    return generateActivitySummaries(project);
  }, [project]);

  // Analizar tendencias
  const trends: TrendAnalysis = useMemo(() => {
    return analyzeTrends(metrics, chartData);
  }, [metrics, chartData]);

  // Generar recomendaciones
  const recommendations: string[] = useMemo(() => {
    return generateRecommendations(metrics);
  }, [metrics]);

  // Actualizar proyecto
  const updateProject = useCallback((updates: Partial<Project>) => {
    setProject(prev => ({ ...prev, ...updates }));
  }, []);

  // Agregar actividad
  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: uuidv4()
    };
    setProject(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity]
    }));
    return newActivity;
  }, []);

  // Actualizar actividad
  const updateActivity = useCallback((activityId: string, updates: Partial<Activity>) => {
    setProject(prev => ({
      ...prev,
      activities: prev.activities.map(act =>
        act.id === activityId ? { ...act, ...updates } : act
      )
    }));
  }, []);

  // Eliminar actividad
  const deleteActivity = useCallback((activityId: string) => {
    setProject(prev => ({
      ...prev,
      activities: prev.activities.filter(act => act.id !== activityId)
    }));
  }, []);

  // Actualizar progreso de actividad
  const updateActivityProgress = useCallback((
    activityId: string,
    percentComplete: number,
    actualCost: number
  ) => {
    setProject(prev => ({
      ...prev,
      activities: prev.activities.map(act =>
        act.id === activityId
          ? { ...act, percentComplete, actualCost }
          : act
      )
    }));
  }, []);

  // Recalcular presupuesto basado en actividades
  const recalculateBudget = useCallback(() => {
    const totalBudget = project.activities.reduce(
      (sum, act) => sum + act.plannedCost,
      0
    );
    setProject(prev => ({ ...prev, budget: totalBudget }));
  }, [project.activities]);

  // Exportar datos del proyecto
  const exportProjectData = useCallback(() => {
    return {
      project,
      metrics,
      chartData,
      activitySummaries,
      trends,
      recommendations,
      exportedAt: new Date().toISOString()
    };
  }, [project, metrics, chartData, activitySummaries, trends, recommendations]);

  // Importar datos del proyecto
  const importProjectData = useCallback((data: Project) => {
    setProject(data);
  }, []);

  // Reiniciar a datos de ejemplo
  const resetToSampleData = useCallback(() => {
    clearStoredProject();
    setProject(sampleProject);
  }, []);

  return {
    project,
    metrics,
    chartData,
    activitySummaries,
    trends,
    recommendations,
    selectedDate,
    setSelectedDate,
    updateProject,
    addActivity,
    updateActivity,
    deleteActivity,
    updateActivityProgress,
    recalculateBudget,
    exportProjectData,
    importProjectData,
    resetToSampleData
  };
}
