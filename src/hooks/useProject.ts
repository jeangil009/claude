import { useState, useCallback, useMemo, useEffect } from 'react';
import { Project, Activity, EVMMetrics, ChartDataPoint, ActivitySummary, TrendAnalysis } from '../types';
import {
  calculateAllEVMMetrics,
  generateSCurveData,
  generateActivitySummaries,
  analyzeTrends,
  generateRecommendations,
  createSnapshot
} from '../utils/evmCalculations';
import { sampleProject } from '../data/sampleProject';
import { v4 as uuidv4 } from 'uuid';
import { parseISO } from 'date-fns';

const STORAGE_KEY = 'evm-pro-project';

// Valida lo mínimo para no romper la app con un JSON ajeno o corrupto
function isProject(value: unknown): value is Project {
  const p = value as Project;
  return (
    !!p &&
    typeof p === 'object' &&
    typeof p.name === 'string' &&
    typeof p.startDate === 'string' &&
    typeof p.plannedEndDate === 'string' &&
    typeof p.budget === 'number' &&
    Array.isArray(p.activities)
  );
}

function loadStoredProject(): Project | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isProject(parsed) ? parsed : null;
  } catch {
    return null; // localStorage bloqueado o contenido inválido
  }
}

export function useProject() {
  const [project, setProject] = useState<Project>(() => loadStoredProject() ?? sampleProject);

  // Persistir en el navegador en cada cambio
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch {
      // Sin almacenamiento disponible: la app sigue funcionando en memoria
    }
  }, [project]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  // Guardar un corte de avance a una fecha (reemplaza el de la misma fecha)
  const saveSnapshot = useCallback((dateStr: string) => {
    setProject(prev => {
      const snap = createSnapshot(prev, parseISO(dateStr));
      const others = (prev.history ?? []).filter(h => h.date !== snap.date);
      return { ...prev, history: [...others, snap].sort((a, b) => a.date.localeCompare(b.date)) };
    });
  }, []);

  const deleteSnapshot = useCallback((dateStr: string) => {
    setProject(prev => ({
      ...prev,
      history: (prev.history ?? []).filter(h => h.date !== dateStr)
    }));
  }, []);

  // Importar un JSON exportado (acepta { project } o el proyecto directo).
  // Devuelve el proyecto importado, o null si el contenido no era válido.
  const importProjectData = useCallback((data: unknown): Project | null => {
    const candidate = (data as { project?: unknown })?.project ?? data;
    if (!isProject(candidate)) return null;
    setProject(candidate);
    return candidate;
  }, []);

  // Reiniciar a datos de ejemplo
  const resetToSampleData = useCallback(() => {
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
    saveSnapshot,
    deleteSnapshot,
    exportProjectData,
    importProjectData,
    resetToSampleData
  };
}
