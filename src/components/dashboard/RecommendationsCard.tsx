import { Lightbulb } from 'lucide-react';

interface RecommendationsCardProps {
  recommendations: string[];
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Lightbulb className="w-5 h-5 text-amber-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Recomendaciones</h3>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {recommendations.map((rec, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700"
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs font-medium text-gray-600">
                {index + 1}
              </span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
