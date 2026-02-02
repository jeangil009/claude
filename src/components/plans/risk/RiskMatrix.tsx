import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  TrendingDown,
  Plus,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign
} from 'lucide-react';
import type { Risk, RiskCategory, PIMatrixCell, RiskResponseType } from '../../../types/pmbok';

interface RiskMatrixProps {
  risks: Risk[];
  categories: RiskCategory[];
  probabilityImpactMatrix: PIMatrixCell[];
  onAddRisk: () => void;
  onEditRisk: (risk: Risk) => void;
  onDeleteRisk: (riskId: string) => void;
  onViewRisk: (risk: Risk) => void;
}

export function RiskMatrix({
  risks,
  categories,
  probabilityImpactMatrix,
  onAddRisk,
  onEditRisk,
  onDeleteRisk,
  onViewRisk
}: RiskMatrixProps) {
  const [viewMode, setViewMode] = useState<'matrix' | 'list' | 'heatmap'>('matrix');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'threat' | 'opportunity'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Risk>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  // Filter and sort risks
  const filteredRisks = useMemo(() => {
    let result = [...risks];

    if (filterPriority !== 'all') {
      result = result.filter(r => r.priority === filterPriority);
    }
    if (filterCategory !== 'all') {
      result = result.filter(r => r.category === filterCategory);
    }
    if (filterStatus !== 'all') {
      result = result.filter(r => r.status === filterStatus);
    }
    if (filterType !== 'all') {
      result = result.filter(r => r.type === filterType);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term) ||
        r.code.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });

    return result;
  }, [risks, filterPriority, filterCategory, filterStatus, filterType, searchTerm, sortField, sortDirection]);

  // Summary statistics
  const stats = useMemo(() => {
    const total = risks.length;
    const byPriority = {
      critical: risks.filter(r => r.priority === 'critical').length,
      high: risks.filter(r => r.priority === 'high').length,
      medium: risks.filter(r => r.priority === 'medium').length,
      low: risks.filter(r => r.priority === 'low').length
    };
    const threats = risks.filter(r => r.type === 'threat').length;
    const opportunities = risks.filter(r => r.type === 'opportunity').length;
    const totalEMV = risks.reduce((sum, r) => sum + (r.expectedMonetaryValue || 0), 0);
    const totalContingency = risks.reduce((sum, r) => sum + (r.contingencyBudget || 0), 0);

    return { total, byPriority, threats, opportunities, totalEMV, totalContingency };
  }, [risks]);

  // Priority colors
  const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
    critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
    high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
    low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' }
  };

  const statusLabels: Record<string, string> = {
    identified: 'Identificado',
    analyzed: 'Analizado',
    response_planned: 'Respuesta Planificada',
    monitoring: 'En Monitoreo',
    occurred: 'Ocurrido',
    closed: 'Cerrado'
  };

  const responseLabels: Record<RiskResponseType, string> = {
    avoid: 'Evitar',
    transfer: 'Transferir',
    mitigate: 'Mitigar',
    accept: 'Aceptar',
    exploit: 'Explotar',
    share: 'Compartir',
    enhance: 'Mejorar',
    escalate: 'Escalar'
  };

  // Render probability-impact matrix
  const renderPIMatrix = () => {
    const levels = [5, 4, 3, 2, 1];
    const impactLevels = [1, 2, 3, 4, 5];

    const getCellColor = (prob: number, impact: number) => {
      const score = prob * impact;
      if (score >= 15) return 'bg-red-500 hover:bg-red-600';
      if (score >= 10) return 'bg-orange-500 hover:bg-orange-600';
      if (score >= 5) return 'bg-yellow-400 hover:bg-yellow-500';
      return 'bg-green-400 hover:bg-green-500';
    };

    const getRisksInCell = (prob: number, impact: number) => {
      return filteredRisks.filter(r => r.probability === prob && r.impact === impact);
    };

    return (
      <div className="p-6">
        <div className="flex items-start gap-8">
          {/* Y-axis label */}
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-sm font-medium text-gray-700 transform -rotate-90 whitespace-nowrap">
              Probabilidad
            </span>
          </div>

          <div>
            {/* Matrix grid */}
            <div className="flex">
              {/* Y-axis values */}
              <div className="flex flex-col mr-2">
                {levels.map(level => (
                  <div
                    key={level}
                    className="h-20 flex items-center justify-end pr-2 text-sm text-gray-600"
                  >
                    {level === 5 ? 'Muy Alta' :
                     level === 4 ? 'Alta' :
                     level === 3 ? 'Media' :
                     level === 2 ? 'Baja' : 'Muy Baja'}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div>
                {levels.map(prob => (
                  <div key={prob} className="flex">
                    {impactLevels.map(impact => {
                      const cellRisks = getRisksInCell(prob, impact);
                      const hasThreats = cellRisks.some(r => r.type === 'threat');
                      const hasOpportunities = cellRisks.some(r => r.type === 'opportunity');

                      return (
                        <div
                          key={`${prob}-${impact}`}
                          className={`
                            w-20 h-20 flex flex-col items-center justify-center
                            ${getCellColor(prob, impact)}
                            border border-white/30 cursor-pointer
                            transition-colors relative group
                          `}
                          title={`P${prob} x I${impact} = ${prob * impact}`}
                        >
                          {cellRisks.length > 0 && (
                            <>
                              <span className="text-white font-bold text-lg">
                                {cellRisks.length}
                              </span>
                              <div className="flex gap-1 mt-1">
                                {hasThreats && (
                                  <AlertTriangle className="w-3 h-3 text-white" />
                                )}
                                {hasOpportunities && (
                                  <TrendingUp className="w-3 h-3 text-white" />
                                )}
                              </div>

                              {/* Tooltip */}
                              <div className="
                                absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                bg-gray-900 text-white text-xs rounded-lg p-3
                                opacity-0 group-hover:opacity-100 transition-opacity
                                pointer-events-none whitespace-nowrap z-20 min-w-[200px]
                              ">
                                <p className="font-medium mb-2">
                                  Riesgos en esta celda ({cellRisks.length})
                                </p>
                                <ul className="space-y-1">
                                  {cellRisks.slice(0, 5).map(risk => (
                                    <li key={risk.id} className="flex items-center gap-2">
                                      {risk.type === 'threat' ? (
                                        <AlertTriangle className="w-3 h-3 text-red-400" />
                                      ) : (
                                        <TrendingUp className="w-3 h-3 text-green-400" />
                                      )}
                                      <span className="truncate">{risk.title}</span>
                                    </li>
                                  ))}
                                  {cellRisks.length > 5 && (
                                    <li className="text-gray-400">
                                      +{cellRisks.length - 5} más...
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* X-axis labels */}
                <div className="flex mt-2">
                  {impactLevels.map(level => (
                    <div
                      key={level}
                      className="w-20 text-center text-sm text-gray-600"
                    >
                      {level === 1 ? 'Muy Bajo' :
                       level === 2 ? 'Bajo' :
                       level === 3 ? 'Medio' :
                       level === 4 ? 'Alto' : 'Muy Alto'}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-2 text-sm font-medium text-gray-700">
                  Impacto
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-400 rounded" /> Bajo (1-4)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-yellow-400 rounded" /> Medio (5-9)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-orange-500 rounded" /> Alto (10-14)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded" /> Crítico (15-25)
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render risk list
  const renderRiskList = () => {
    const handleSort = (field: keyof Risk) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('desc');
      }
    };

    const SortIcon = ({ field }: { field: keyof Risk }) => {
      if (sortField !== field) return null;
      return sortDirection === 'asc' ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      );
    };

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('code')}
              >
                <div className="flex items-center gap-1">
                  Código <SortIcon field="code" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-1">
                  Riesgo <SortIcon field="title" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Categoría
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('probability')}
              >
                <div className="flex items-center gap-1">
                  Prob. <SortIcon field="probability" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('impact')}
              >
                <div className="flex items-center gap-1">
                  Imp. <SortIcon field="impact" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center gap-1">
                  Score <SortIcon field="score" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Prioridad
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Respuesta
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Dueño
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRisks.map(risk => (
              <tr
                key={risk.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedRisk?.id === risk.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedRisk(risk)}
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-gray-600">{risk.code}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="max-w-xs">
                    <p className="font-medium text-gray-900 truncate">{risk.title}</p>
                    <p className="text-sm text-gray-500 truncate">{risk.description}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {risk.type === 'threat' ? (
                    <span className="flex items-center gap-1 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">Amenaza</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Oportunidad</span>
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {risk.category}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                    {risk.probability}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                    {risk.impact}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold ${
                    risk.score >= 15 ? 'bg-red-500' :
                    risk.score >= 10 ? 'bg-orange-500' :
                    risk.score >= 5 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}>
                    {risk.score}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[risk.priority].bg} ${priorityColors[risk.priority].text}`}>
                    {risk.priority === 'critical' ? 'Crítica' :
                     risk.priority === 'high' ? 'Alta' :
                     risk.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {responseLabels[risk.responseStrategy]}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    risk.status === 'closed' ? 'bg-green-100 text-green-800' :
                    risk.status === 'occurred' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {statusLabels[risk.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {risk.owner}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); onViewRisk(risk); }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditRisk(risk); }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteRisk(risk.id); }}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRisks.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron riesgos con los filtros aplicados</p>
          </div>
        )}
      </div>
    );
  };

  // Render heat map
  const renderHeatMap = () => {
    const categoryStats = categories.map(cat => {
      const catRisks = filteredRisks.filter(r => r.category === cat.id);
      const avgScore = catRisks.length > 0
        ? catRisks.reduce((sum, r) => sum + r.score, 0) / catRisks.length
        : 0;
      return {
        ...cat,
        riskCount: catRisks.length,
        avgScore,
        threats: catRisks.filter(r => r.type === 'threat').length,
        opportunities: catRisks.filter(r => r.type === 'opportunity').length,
        critical: catRisks.filter(r => r.priority === 'critical').length,
        high: catRisks.filter(r => r.priority === 'high').length
      };
    });

    return (
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryStats.map(cat => (
            <div
              key={cat.id}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg
                ${cat.avgScore >= 15 ? 'border-red-500 bg-red-50' :
                  cat.avgScore >= 10 ? 'border-orange-500 bg-orange-50' :
                  cat.avgScore >= 5 ? 'border-yellow-500 bg-yellow-50' :
                  cat.riskCount > 0 ? 'border-green-500 bg-green-50' :
                  'border-gray-200 bg-gray-50'}
              `}
              onClick={() => setFilterCategory(cat.id)}
            >
              <h4 className="font-medium text-gray-900 mb-2">{cat.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Riesgos:</span>
                  <span className="font-medium">{cat.riskCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Score Promedio:</span>
                  <span className="font-medium">{cat.avgScore.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Amenazas
                  </span>
                  <span className="font-medium">{cat.threats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Oportunidades
                  </span>
                  <span className="font-medium">{cat.opportunities}</span>
                </div>
                {(cat.critical > 0 || cat.high > 0) && (
                  <div className="pt-2 border-t">
                    <span className="text-xs text-gray-500">
                      {cat.critical} críticos, {cat.high} altos
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Registro de Riesgos</h2>
              <p className="text-sm text-gray-500">Matriz de Probabilidad e Impacto</p>
            </div>
          </div>

          <button
            onClick={onAddRisk}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo Riesgo
          </button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500">Total Riesgos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.byPriority.critical}</p>
            <p className="text-xs text-gray-500">Críticos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.byPriority.high}</p>
            <p className="text-xs text-gray-500">Altos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.byPriority.medium}</p>
            <p className="text-xs text-gray-500">Medios</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.byPriority.low}</p>
            <p className="text-xs text-gray-500">Bajos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('es-MX', { notation: 'compact' }).format(stats.totalEMV)}
            </p>
            <p className="text-xs text-gray-500">EMV Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('es-MX', { notation: 'compact' }).format(stats.totalContingency)}
            </p>
            <p className="text-xs text-gray-500">Contingencia</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* View mode toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 text-sm rounded ${viewMode === 'matrix' ? 'bg-white shadow' : ''}`}
            >
              Matriz
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1.5 text-sm rounded ${viewMode === 'heatmap' ? 'bg-white shadow' : ''}`}
            >
              Mapa de Calor
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
            >
              <option value="all">Todos los tipos</option>
              <option value="threat">Amenazas</option>
              <option value="opportunity">Oportunidades</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
            >
              <option value="all">Todas las prioridades</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
            >
              <option value="all">Todos los estados</option>
              <option value="identified">Identificado</option>
              <option value="analyzed">Analizado</option>
              <option value="response_planned">Respuesta Planificada</option>
              <option value="monitoring">En Monitoreo</option>
              <option value="occurred">Ocurrido</option>
              <option value="closed">Cerrado</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar riesgos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg w-64"
          />
        </div>
      </div>

      {/* Content */}
      {viewMode === 'matrix' && renderPIMatrix()}
      {viewMode === 'list' && renderRiskList()}
      {viewMode === 'heatmap' && renderHeatMap()}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Mostrando {filteredRisks.length} de {risks.length} riesgos
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              {stats.threats} amenazas
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              {stats.opportunities} oportunidades
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
