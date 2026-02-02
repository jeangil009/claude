import { useState, useMemo, useRef } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Link2
} from 'lucide-react';
import { differenceInDays, addDays, format, startOfWeek, endOfWeek, eachDayOfInterval, isWeekend, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ScheduleActivity, ActivityDependency, Milestone } from '../../../types/pmbok';

interface GanttChartProps {
  activities: ScheduleActivity[];
  dependencies: ActivityDependency[];
  milestones: Milestone[];
  projectStart: string;
  projectEnd: string;
  onActivityClick?: (activity: ScheduleActivity) => void;
  onUpdateActivity?: (activity: ScheduleActivity) => void;
}

type ZoomLevel = 'day' | 'week' | 'month';

export function GanttChart({
  activities,
  dependencies,
  milestones,
  projectStart,
  projectEnd,
  onActivityClick,
  onUpdateActivity
}: GanttChartProps) {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('week');
  const [viewStart, setViewStart] = useState(new Date(projectStart));
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showCriticalPath, setShowCriticalPath] = useState(true);
  const [showDependencies, setShowDependencies] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const chartRef = useRef<HTMLDivElement>(null);

  const projectStartDate = parseISO(projectStart);
  const projectEndDate = parseISO(projectEnd);
  const totalProjectDays = differenceInDays(projectEndDate, projectStartDate) + 1;

  // Calculate visible range based on zoom level
  const visibleRange = useMemo(() => {
    const ranges = {
      day: 30,
      week: 90,
      month: 365
    };
    return ranges[zoomLevel];
  }, [zoomLevel]);

  // Generate time scale headers
  const timeScale = useMemo(() => {
    const endDate = addDays(viewStart, visibleRange);
    const days = eachDayOfInterval({ start: viewStart, end: endDate });

    if (zoomLevel === 'day') {
      return days.map(day => ({
        date: day,
        label: format(day, 'd', { locale: es }),
        isWeekend: isWeekend(day),
        isToday: format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      }));
    } else if (zoomLevel === 'week') {
      const weeks: { startDate: Date; endDate: Date; label: string; days: Date[] }[] = [];
      let currentWeekStart = startOfWeek(viewStart, { weekStartsOn: 1 });

      while (currentWeekStart <= endDate) {
        const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
        weeks.push({
          startDate: currentWeekStart,
          endDate: weekEnd,
          label: `Sem ${format(currentWeekStart, 'w', { locale: es })}`,
          days: eachDayOfInterval({
            start: currentWeekStart < viewStart ? viewStart : currentWeekStart,
            end: weekEnd > endDate ? endDate : weekEnd
          })
        });
        currentWeekStart = addDays(weekEnd, 1);
      }
      return weeks;
    } else {
      // Month view
      const months: { startDate: Date; label: string; days: number }[] = [];
      let currentDate = viewStart;

      while (currentDate <= endDate) {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInView = Math.min(
          differenceInDays(monthEnd, currentDate) + 1,
          differenceInDays(endDate, currentDate) + 1
        );

        months.push({
          startDate: monthStart,
          label: format(monthStart, 'MMMM yyyy', { locale: es }),
          days: daysInView
        });

        currentDate = addDays(monthEnd, 1);
      }
      return months;
    }
  }, [viewStart, visibleRange, zoomLevel]);

  // Calculate column width based on zoom
  const columnWidth = useMemo(() => {
    return {
      day: 30,
      week: 15,
      month: 4
    }[zoomLevel];
  }, [zoomLevel]);

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    if (filterCategory !== 'all') {
      // Filter by category if needed
    }

    // Sort by start date and WBS code
    return filtered.sort((a, b) => {
      const dateCompare = new Date(a.plannedStart).getTime() - new Date(b.plannedStart).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.wbsCode.localeCompare(b.wbsCode);
    });
  }, [activities, filterCategory]);

  // Calculate bar position and width
  const getBarStyle = (activity: ScheduleActivity) => {
    const activityStart = parseISO(activity.plannedStart);
    const activityEnd = parseISO(activity.plannedFinish);

    const startOffset = Math.max(0, differenceInDays(activityStart, viewStart));
    const endOffset = differenceInDays(activityEnd, viewStart);
    const barWidth = Math.max(1, endOffset - startOffset + 1);

    // Calculate actual progress bar if there's actual dates
    let actualWidth = 0;
    if (activity.actualStart) {
      const actualStart = parseISO(activity.actualStart);
      const actualEnd = activity.actualFinish ? parseISO(activity.actualFinish) : new Date();
      actualWidth = Math.max(0, differenceInDays(actualEnd, actualStart) + 1);
    }

    return {
      left: startOffset * columnWidth,
      width: barWidth * columnWidth,
      progressWidth: (activity.percentComplete / 100) * barWidth * columnWidth,
      actualWidth: actualWidth * columnWidth
    };
  };

  // Navigate timeline
  const navigateTimeline = (direction: 'prev' | 'next') => {
    const offset = direction === 'next' ? visibleRange / 2 : -visibleRange / 2;
    setViewStart(addDays(viewStart, offset));
  };

  const goToToday = () => {
    setViewStart(addDays(new Date(), -visibleRange / 4));
  };

  // Get status color
  const getStatusColor = (activity: ScheduleActivity) => {
    if (activity.percentComplete === 100) return 'bg-green-500';
    if (activity.isCritical) return 'bg-red-500';
    if (activity.totalFloat <= 0) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  // Render dependency lines (simplified)
  const renderDependencyLines = () => {
    if (!showDependencies) return null;

    return dependencies.map(dep => {
      const predecessor = activities.find(a => a.id === dep.predecessorId);
      const successor = activities.find(a => a.id === dep.successorId);

      if (!predecessor || !successor) return null;

      const predIndex = filteredActivities.findIndex(a => a.id === predecessor.id);
      const succIndex = filteredActivities.findIndex(a => a.id === successor.id);

      if (predIndex === -1 || succIndex === -1) return null;

      const predBar = getBarStyle(predecessor);
      const succBar = getBarStyle(successor);

      // Simple arrow from end of predecessor to start of successor
      const startX = predBar.left + predBar.width;
      const startY = predIndex * 40 + 20;
      const endX = succBar.left;
      const endY = succIndex * 40 + 20;

      return (
        <svg
          key={dep.id}
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: '100%',
            height: filteredActivities.length * 40,
            overflow: 'visible'
          }}
        >
          <path
            d={`M ${startX} ${startY} C ${startX + 20} ${startY}, ${endX - 20} ${endY}, ${endX} ${endY}`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>
        </svg>
      );
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Diagrama de Gantt</h2>
              <p className="text-sm text-gray-500">
                {format(projectStartDate, 'dd MMM yyyy', { locale: es })} - {format(projectEndDate, 'dd MMM yyyy', { locale: es })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Zoom controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setZoomLevel('day')}
                className={`px-3 py-1.5 text-sm rounded ${zoomLevel === 'day' ? 'bg-white shadow' : ''}`}
              >
                Día
              </button>
              <button
                onClick={() => setZoomLevel('week')}
                className={`px-3 py-1.5 text-sm rounded ${zoomLevel === 'week' ? 'bg-white shadow' : ''}`}
              >
                Semana
              </button>
              <button
                onClick={() => setZoomLevel('month')}
                className={`px-3 py-1.5 text-sm rounded ${zoomLevel === 'month' ? 'bg-white shadow' : ''}`}
              >
                Mes
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateTimeline('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Hoy
              </button>
              <button
                onClick={() => navigateTimeline('next')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showCriticalPath}
              onChange={(e) => setShowCriticalPath(e.target.checked)}
              className="rounded border-gray-300"
            />
            Mostrar Ruta Crítica
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showDependencies}
              onChange={(e) => setShowDependencies(e.target.checked)}
              className="rounded border-gray-300"
            />
            Mostrar Dependencias
          </label>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-500 rounded" /> Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded" /> Crítica
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded" /> Completada
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-orange-500 rounded" /> Sin Holgura
            </span>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="flex overflow-hidden">
        {/* Activity list (left panel) */}
        <div className="w-80 flex-shrink-0 border-r border-gray-200">
          {/* Header */}
          <div className="h-16 border-b border-gray-200 bg-gray-50 flex items-center px-4">
            <span className="text-sm font-medium text-gray-700">Actividades ({filteredActivities.length})</span>
          </div>

          {/* Activity rows */}
          <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
            {filteredActivities.map((activity, index) => (
              <div
                key={activity.id}
                className={`
                  h-10 flex items-center px-4 border-b border-gray-100 cursor-pointer
                  ${selectedActivity === activity.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  ${activity.isCritical && showCriticalPath ? 'border-l-4 border-l-red-500' : ''}
                `}
                onClick={() => {
                  setSelectedActivity(activity.id);
                  onActivityClick?.(activity);
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-400">{activity.wbsCode}</span>
                    <span className="text-sm text-gray-900 truncate">{activity.name}</span>
                    {activity.isMilestone && (
                      <span className="w-2 h-2 bg-purple-500 rotate-45" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{activity.duration}d</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    activity.percentComplete === 100 ? 'bg-green-100 text-green-700' :
                    activity.percentComplete > 0 ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.percentComplete}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart area (right panel) */}
        <div className="flex-1 overflow-x-auto" ref={chartRef}>
          {/* Time scale header */}
          <div className="h-16 border-b border-gray-200 bg-gray-50 flex">
            {zoomLevel === 'day' && (timeScale as { date: Date; label: string; isWeekend: boolean; isToday: boolean }[]).map((day, idx) => (
              <div
                key={idx}
                className={`
                  flex-shrink-0 flex flex-col items-center justify-center border-r border-gray-200
                  ${day.isWeekend ? 'bg-gray-100' : ''}
                  ${day.isToday ? 'bg-blue-100' : ''}
                `}
                style={{ width: columnWidth }}
              >
                <span className="text-xs text-gray-500">
                  {format(day.date, 'EEE', { locale: es })}
                </span>
                <span className="text-sm font-medium">{day.label}</span>
              </div>
            ))}

            {zoomLevel === 'week' && (timeScale as { startDate: Date; label: string; days: Date[] }[]).map((week, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 flex flex-col border-r border-gray-200"
                style={{ width: week.days.length * columnWidth }}
              >
                <div className="h-8 flex items-center justify-center border-b border-gray-200 bg-gray-100">
                  <span className="text-xs font-medium text-gray-700">{week.label}</span>
                </div>
                <div className="h-8 flex">
                  {week.days.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`flex items-center justify-center border-r border-gray-100 ${
                        isWeekend(day) ? 'bg-gray-50' : ''
                      }`}
                      style={{ width: columnWidth }}
                    >
                      <span className="text-xs text-gray-500">{format(day, 'd')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {zoomLevel === 'month' && (timeScale as { startDate: Date; label: string; days: number }[]).map((month, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 flex items-center justify-center border-r border-gray-200 bg-gray-100"
                style={{ width: month.days * columnWidth }}
              >
                <span className="text-sm font-medium text-gray-700 capitalize">{month.label}</span>
              </div>
            ))}
          </div>

          {/* Bars area */}
          <div className="relative" style={{ minWidth: visibleRange * columnWidth }}>
            {/* Grid lines */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: visibleRange }).map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-shrink-0 border-r ${
                    zoomLevel === 'day' && isWeekend(addDays(viewStart, idx))
                      ? 'bg-gray-50 border-gray-200'
                      : 'border-gray-100'
                  }`}
                  style={{ width: columnWidth }}
                />
              ))}
            </div>

            {/* Today line */}
            {(() => {
              const todayOffset = differenceInDays(new Date(), viewStart);
              if (todayOffset >= 0 && todayOffset <= visibleRange) {
                return (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                    style={{ left: todayOffset * columnWidth }}
                  />
                );
              }
              return null;
            })()}

            {/* Dependency lines */}
            {renderDependencyLines()}

            {/* Activity bars */}
            {filteredActivities.map((activity, index) => {
              const barStyle = getBarStyle(activity);

              return (
                <div
                  key={activity.id}
                  className={`
                    h-10 flex items-center border-b border-gray-100 relative
                    ${selectedActivity === activity.id ? 'bg-blue-50/50' : ''}
                  `}
                >
                  {activity.isMilestone ? (
                    // Milestone diamond
                    <div
                      className="absolute w-4 h-4 bg-purple-500 rotate-45 cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        left: barStyle.left - 8,
                        top: '50%',
                        transform: 'translateY(-50%) rotate(45deg)'
                      }}
                      onClick={() => onActivityClick?.(activity)}
                    />
                  ) : (
                    // Activity bar
                    <div
                      className="absolute h-6 rounded cursor-pointer group"
                      style={{
                        left: barStyle.left,
                        width: Math.max(barStyle.width, 4)
                      }}
                      onClick={() => onActivityClick?.(activity)}
                    >
                      {/* Background bar */}
                      <div className={`
                        absolute inset-0 rounded opacity-30
                        ${getStatusColor(activity)}
                      `} />

                      {/* Progress bar */}
                      <div
                        className={`
                          absolute inset-y-0 left-0 rounded-l
                          ${activity.percentComplete === 100 ? 'rounded-r' : ''}
                          ${getStatusColor(activity)}
                        `}
                        style={{ width: barStyle.progressWidth }}
                      />

                      {/* Activity name on bar */}
                      {barStyle.width > 60 && (
                        <span className="absolute inset-0 flex items-center px-2 text-xs text-white font-medium truncate">
                          {activity.name}
                        </span>
                      )}

                      {/* Tooltip */}
                      <div className="
                        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                        bg-gray-900 text-white text-xs rounded-lg px-3 py-2
                        opacity-0 group-hover:opacity-100 transition-opacity
                        pointer-events-none whitespace-nowrap z-20
                      ">
                        <p className="font-medium">{activity.name}</p>
                        <p>Inicio: {format(parseISO(activity.plannedStart), 'dd/MM/yyyy')}</p>
                        <p>Fin: {format(parseISO(activity.plannedFinish), 'dd/MM/yyyy')}</p>
                        <p>Duración: {activity.duration} días</p>
                        <p>Progreso: {activity.percentComplete}%</p>
                        {activity.isCritical && <p className="text-red-400">Ruta Crítica</p>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Milestones from props */}
            {milestones.map((milestone, idx) => {
              const milestoneDate = parseISO(milestone.plannedDate);
              const offset = differenceInDays(milestoneDate, viewStart);

              if (offset < 0 || offset > visibleRange) return null;

              return (
                <div
                  key={milestone.id}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: offset * columnWidth - 8 }}
                >
                  <div className={`
                    w-4 h-4 rotate-45 cursor-pointer hover:scale-110 transition-transform
                    ${milestone.status === 'achieved' ? 'bg-green-500' :
                      milestone.status === 'delayed' ? 'bg-red-500' :
                      milestone.status === 'at_risk' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }
                  `} />
                  <span className="text-xs text-gray-600 mt-1 whitespace-nowrap transform -rotate-45 origin-top-left">
                    {milestone.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-6">
            <span className="text-gray-600">
              Total Actividades: <strong className="text-gray-900">{activities.length}</strong>
            </span>
            <span className="text-gray-600">
              En Ruta Crítica: <strong className="text-red-600">
                {activities.filter(a => a.isCritical).length}
              </strong>
            </span>
            <span className="text-gray-600">
              Completadas: <strong className="text-green-600">
                {activities.filter(a => a.percentComplete === 100).length}
              </strong>
            </span>
            <span className="text-gray-600">
              Hitos: <strong className="text-purple-600">{milestones.length}</strong>
            </span>
          </div>
          <div className="flex gap-4">
            <span className="text-gray-600">
              Progreso General: <strong className="text-gray-900">
                {Math.round(activities.reduce((sum, a) => sum + a.percentComplete, 0) / activities.length)}%
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
