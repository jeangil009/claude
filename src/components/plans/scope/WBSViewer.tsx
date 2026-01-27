import { useState } from 'react';
import {
  GitBranch,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  FolderOpen,
  Folder,
  Package,
  DollarSign,
  Clock,
  User
} from 'lucide-react';
import type { WBSElement, WBSDictionaryEntry } from '../../../types/pmbok';

interface WBSViewerProps {
  wbs: WBSElement;
  dictionary: WBSDictionaryEntry[];
  onUpdateWBS: (wbs: WBSElement) => void;
  onUpdateDictionary: (dictionary: WBSDictionaryEntry[]) => void;
  readOnly?: boolean;
}

export function WBSViewer({ wbs, dictionary, onUpdateWBS, onUpdateDictionary, readOnly = false }: WBSViewerProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([wbs.id]));
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'chart' | 'table'>('tree');
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [showDictionary, setShowDictionary] = useState(false);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (node: WBSElement) => {
      allIds.add(node.id);
      node.children?.forEach(collectIds);
    };
    collectIds(wbs);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set([wbs.id]));
  };

  const findNode = (root: WBSElement, id: string): WBSElement | null => {
    if (root.id === id) return root;
    for (const child of root.children || []) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const updateNode = (root: WBSElement, id: string, updates: Partial<WBSElement>): WBSElement => {
    if (root.id === id) {
      return { ...root, ...updates };
    }
    return {
      ...root,
      children: root.children?.map(child => updateNode(child, id, updates)) || []
    };
  };

  const addChildNode = (parentId: string) => {
    const parent = findNode(wbs, parentId);
    if (!parent) return;

    const newCode = `${parent.code}.${(parent.children?.length || 0) + 1}`;
    const newNode: WBSElement = {
      id: crypto.randomUUID(),
      code: newCode,
      name: 'Nuevo elemento',
      description: '',
      level: parent.level + 1,
      parentId: parentId,
      children: [],
      isWorkPackage: true
    };

    const updatedWBS = updateNode(wbs, parentId, {
      children: [...(parent.children || []), newNode],
      isWorkPackage: false
    });
    onUpdateWBS(updatedWBS);
    setExpandedNodes(new Set([...expandedNodes, parentId]));
  };

  const deleteNode = (nodeId: string) => {
    const removeNode = (root: WBSElement): WBSElement => {
      return {
        ...root,
        children: root.children?.filter(child => child.id !== nodeId).map(removeNode) || []
      };
    };
    onUpdateWBS(removeNode(wbs));
    if (selectedNode === nodeId) setSelectedNode(null);
  };

  const getDictionaryEntry = (wbsCode: string): WBSDictionaryEntry | undefined => {
    return dictionary.find(d => d.wbsCode === wbsCode);
  };

  const renderTreeNode = (node: WBSElement, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode === node.id;
    const isEditing = editingNode === node.id;
    const dictEntry = getDictionaryEntry(node.code);

    return (
      <div key={node.id} className="select-none">
        <div
          className={`
            flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors
            ${isSelected ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-50'}
          `}
          style={{ paddingLeft: `${depth * 24 + 12}px` }}
          onClick={() => setSelectedNode(node.id)}
        >
          {/* Expand/Collapse button */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }}
            className={`p-0.5 rounded hover:bg-gray-200 ${!hasChildren && 'invisible'}`}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {/* Icon */}
          {node.isWorkPackage ? (
            <Package className="w-5 h-5 text-blue-500" />
          ) : isExpanded ? (
            <FolderOpen className="w-5 h-5 text-amber-500" />
          ) : (
            <Folder className="w-5 h-5 text-amber-500" />
          )}

          {/* Content */}
          {isEditing ? (
            <div className="flex-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={node.code}
                onChange={(e) => onUpdateWBS(updateNode(wbs, node.id, { code: e.target.value }))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm font-mono"
              />
              <input
                type="text"
                value={node.name}
                onChange={(e) => onUpdateWBS(updateNode(wbs, node.id, { name: e.target.value }))}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => setEditingNode(null)}
                className="p-1 text-green-600 hover:text-green-800"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingNode(null)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <span className="font-mono text-sm text-gray-500 min-w-[60px]">{node.code}</span>
              <span className="flex-1 text-sm text-gray-900">{node.name}</span>

              {/* Metrics badges */}
              {node.plannedCost && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {new Intl.NumberFormat('es-MX').format(node.plannedCost)}
                </span>
              )}
              {node.plannedDuration && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {node.plannedDuration}d
                </span>
              )}
              {dictEntry?.responsiblePerson && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {dictEntry.responsiblePerson}
                </span>
              )}

              {/* Actions */}
              {!readOnly && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingNode(node.id); }}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); addChildNode(node.id); }}
                    className="p-1 text-gray-400 hover:text-green-600"
                    title="Agregar hijo"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  {node.level > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div>
            {node.children?.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderOrgChart = () => {
    const renderChartNode = (node: WBSElement) => {
      const hasChildren = node.children && node.children.length > 0;
      const isSelected = selectedNode === node.id;

      return (
        <div key={node.id} className="flex flex-col items-center">
          {/* Node box */}
          <div
            className={`
              relative px-4 py-3 rounded-lg border-2 cursor-pointer transition-all
              min-w-[150px] text-center
              ${isSelected
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : node.isWorkPackage
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }
            `}
            onClick={() => setSelectedNode(node.id)}
          >
            <p className="font-mono text-xs text-gray-500 mb-1">{node.code}</p>
            <p className="font-medium text-sm text-gray-900">{node.name}</p>
            {node.plannedCost && (
              <p className="text-xs text-gray-500 mt-1">
                ${new Intl.NumberFormat('es-MX').format(node.plannedCost)}
              </p>
            )}
          </div>

          {/* Children connector and nodes */}
          {hasChildren && (
            <>
              {/* Vertical line down */}
              <div className="w-0.5 h-6 bg-gray-300" />

              {/* Horizontal line */}
              {node.children!.length > 1 && (
                <div
                  className="h-0.5 bg-gray-300"
                  style={{
                    width: `${(node.children!.length - 1) * 180}px`
                  }}
                />
              )}

              {/* Children */}
              <div className="flex gap-4 pt-6 relative">
                {node.children?.map((child, index) => (
                  <div key={child.id} className="relative">
                    {/* Vertical connector to child */}
                    <div className="absolute left-1/2 -top-6 w-0.5 h-6 bg-gray-300 -translate-x-1/2" />
                    {renderChartNode(child)}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    };

    return (
      <div className="overflow-auto p-8">
        <div className="inline-flex justify-center min-w-full">
          {renderChartNode(wbs)}
        </div>
      </div>
    );
  };

  const renderTable = () => {
    const flattenWBS = (node: WBSElement, rows: WBSElement[] = []): WBSElement[] => {
      rows.push(node);
      node.children?.forEach(child => flattenWBS(child, rows));
      return rows;
    };

    const rows = flattenWBS(wbs);

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código WBS</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo Planificado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duración</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map(row => {
              const dictEntry = getDictionaryEntry(row.code);
              return (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 cursor-pointer ${selectedNode === row.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedNode(row.id)}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm" style={{ paddingLeft: `${row.level * 16}px` }}>
                      {row.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.level}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      row.isWorkPackage
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {row.isWorkPackage ? 'Paquete de Trabajo' : 'Cuenta de Control'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {row.plannedCost
                      ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(row.plannedCost)
                      : '-'
                    }
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {row.plannedDuration ? `${row.plannedDuration} días` : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {dictEntry?.responsiblePerson || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderNodeDetails = () => {
    if (!selectedNode) {
      return (
        <div className="p-6 text-center text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Selecciona un elemento del WBS para ver sus detalles</p>
        </div>
      );
    }

    const node = findNode(wbs, selectedNode);
    if (!node) return null;

    const dictEntry = getDictionaryEntry(node.code);

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-sm text-gray-500">{node.code}</span>
            <h3 className="text-lg font-semibold text-gray-900">{node.name}</h3>
          </div>
          <span className={`px-3 py-1 text-sm rounded-full ${
            node.isWorkPackage
              ? 'bg-blue-100 text-blue-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {node.isWorkPackage ? 'Paquete de Trabajo' : 'Cuenta de Control'}
          </span>
        </div>

        {node.description && (
          <div>
            <label className="text-sm font-medium text-gray-700">Descripción</label>
            <p className="text-sm text-gray-600 mt-1">{node.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <label className="text-xs text-gray-500">Costo Planificado</label>
            <p className="text-lg font-semibold text-gray-900">
              {node.plannedCost
                ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(node.plannedCost)
                : 'No definido'
              }
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <label className="text-xs text-gray-500">Duración Planificada</label>
            <p className="text-lg font-semibold text-gray-900">
              {node.plannedDuration ? `${node.plannedDuration} días` : 'No definida'}
            </p>
          </div>
        </div>

        {dictEntry && (
          <>
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Diccionario del WBS</h4>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Responsable</label>
                  <p className="text-sm text-gray-600">{dictEntry.responsiblePerson || 'No asignado'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Descripción del Trabajo</label>
                  <p className="text-sm text-gray-600">{dictEntry.workDescription || 'Sin descripción'}</p>
                </div>

                {dictEntry.acceptanceCriteria?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Criterios de Aceptación</label>
                    <ul className="mt-1 space-y-1">
                      {dictEntry.acceptanceCriteria.map((criteria, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {dictEntry.risks?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Riesgos Identificados</label>
                    <ul className="mt-1 space-y-1">
                      {dictEntry.risks.map((risk, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <GitBranch className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Estructura de Desglose del Trabajo (EDT/WBS)</h2>
              <p className="text-sm text-gray-500">Work Breakdown Structure</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1.5 text-sm rounded ${
                  viewMode === 'tree' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                Árbol
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-3 py-1.5 text-sm rounded ${
                  viewMode === 'chart' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                Organigrama
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-sm rounded ${
                  viewMode === 'table' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                Tabla
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
          >
            Expandir Todo
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
          >
            Colapsar Todo
          </button>
          <div className="w-px h-5 bg-gray-300 mx-2" />
          <button
            onClick={() => setShowDictionary(!showDictionary)}
            className={`px-3 py-1.5 text-sm rounded ${
              showDictionary ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            Diccionario WBS
          </button>
        </div>

        {!readOnly && (
          <button
            onClick={() => addChildNode(wbs.id)}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Agregar Elemento
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex">
        {/* Main view */}
        <div className={`flex-1 ${showDictionary ? 'border-r border-gray-200' : ''}`}>
          {viewMode === 'tree' && (
            <div className="p-4 max-h-[600px] overflow-auto">
              {renderTreeNode(wbs)}
            </div>
          )}
          {viewMode === 'chart' && renderOrgChart()}
          {viewMode === 'table' && renderTable()}
        </div>

        {/* Details panel */}
        {showDictionary && (
          <div className="w-96 bg-gray-50 border-l border-gray-200">
            {renderNodeDetails()}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-6">
            <span className="text-gray-600">
              Total Elementos: <strong className="text-gray-900">
                {(() => {
                  let count = 0;
                  const countNodes = (node: WBSElement) => {
                    count++;
                    node.children?.forEach(countNodes);
                  };
                  countNodes(wbs);
                  return count;
                })()}
              </strong>
            </span>
            <span className="text-gray-600">
              Paquetes de Trabajo: <strong className="text-gray-900">
                {(() => {
                  let count = 0;
                  const countWP = (node: WBSElement) => {
                    if (node.isWorkPackage) count++;
                    node.children?.forEach(countWP);
                  };
                  countWP(wbs);
                  return count;
                })()}
              </strong>
            </span>
            <span className="text-gray-600">
              Niveles: <strong className="text-gray-900">
                {(() => {
                  let maxLevel = 0;
                  const findMax = (node: WBSElement) => {
                    if (node.level > maxLevel) maxLevel = node.level;
                    node.children?.forEach(findMax);
                  };
                  findMax(wbs);
                  return maxLevel + 1;
                })()}
              </strong>
            </span>
          </div>
          <span className="text-gray-600">
            Costo Total Estimado: <strong className="text-gray-900">
              {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
                (() => {
                  let total = 0;
                  const sumCost = (node: WBSElement) => {
                    if (node.isWorkPackage && node.plannedCost) {
                      total += node.plannedCost;
                    }
                    node.children?.forEach(sumCost);
                  };
                  sumCost(wbs);
                  return total;
                })()
              )}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
