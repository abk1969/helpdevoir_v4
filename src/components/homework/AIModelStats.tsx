```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain,
  DollarSign,
  BarChart2,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { modelManager } from '../../utils/ai/modelManager';
import { AI_MODELS } from '../../utils/ai';

interface AIModelStatsProps {
  days?: number;
}

export default function AIModelStats({ days = 30 }: AIModelStatsProps) {
  const stats = modelManager.getUsageStats(days);

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 3
    }).format(cost);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-medium">Statistiques d'utilisation IA</h3>
        </div>
        <span className="text-sm text-gray-500">
          Derniers {days} jours
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-center text-indigo-600 mb-2">
            <TrendingUp className="h-5 w-5 mr-2" />
            <span className="font-medium">Tokens utilisés</span>
          </div>
          <p className="text-2xl font-bold">
            {formatNumber(stats.totalTokens)}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center text-green-600 mb-2">
            <DollarSign className="h-5 w-5 mr-2" />
            <span className="font-medium">Coût total</span>
          </div>
          <p className="text-2xl font-bold">
            {formatCost(stats.totalCost)}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center text-blue-600 mb-2">
            <BarChart2 className="h-5 w-5 mr-2" />
            <span className="font-medium">Modèles utilisés</span>
          </div>
          <p className="text-2xl font-bold">
            {Object.keys(stats.usageByModel).length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Utilisation par modèle</h4>
        {Object.entries(stats.usageByModel).map(([modelId, usage]) => (
          <div
            key={modelId}
            className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
          >
            <div>
              <div className="flex items-center mb-1">
                <span className="font-medium text-gray-900">
                  {AI_MODELS[modelId]?.name || modelId}
                </span>
                {usage.tokens > AI_MODELS[modelId]?.maxTokens * 0.8 && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500 ml-2" />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {formatNumber(usage.tokens)} tokens
              </p>
            </div>
            <span className="text-gray-900 font-medium">
              {formatCost(usage.cost)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```