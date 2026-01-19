import { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, HelpCircle } from 'lucide-react';

interface FormulaItem {
  name: string;
  formula: string;
  description: string;
  value: string;
  interpretation?: string;
}

interface FormulaCardProps {
  title: string;
  formulas: FormulaItem[];
  defaultExpanded?: boolean;
}

export function FormulaCard({ title, formulas, defaultExpanded = false }: FormulaCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Calculator className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 animate-fadeIn">
          <div className="divide-y divide-gray-100">
            {formulas.map((formula, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{formula.name}</h4>
                      <div className="relative">
                        <button
                          onMouseEnter={() => setActiveTooltip(formula.name)}
                          onMouseLeave={() => setActiveTooltip(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </button>
                        {activeTooltip === formula.name && (
                          <div className="absolute left-6 top-0 z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                            <p className="font-medium mb-1">{formula.description}</p>
                            {formula.interpretation && (
                              <p className="text-gray-300 mt-2">
                                <span className="font-medium">Interpretación:</span> {formula.interpretation}
                              </p>
                            )}
                            <div className="absolute left-0 top-2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 font-mono bg-gray-50 px-2 py-1 rounded inline-block">
                      {formula.formula}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{formula.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
