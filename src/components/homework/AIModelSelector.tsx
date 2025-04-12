```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain,
  Zap,
  Sparkles,
  Star,
  Info,
  AlertTriangle
} from 'lucide-react';
import { AI_MODELS } from '../../utils/ai';
import { modelManager } from '../../utils/ai/modelManager';
import TouchFeedback from '../common/TouchFeedback';
import toast from 'react-hot-toast';

interface AIModelSelectorProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}

export default function AIModelSelector({
  selectedModel,
  onModelSelect
}: AIModelSelectorProps) {
  const stats = modelManager.getUsageStats();

  const getModelIcon = (provider: string) => {
    switch (provider) {
      case 'anthropic':
        return <Brain className="h-5 w-5" />;
      case 'openai':
        return <Sparkles className="h-5 w-5" />;
      case 'mistral':
      case 'pistral':
        return <Zap className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const handleModelSelect = (modelId: string) => {
    const modelConfig = AI_MODELS[modelId];
    const modelUsage = stats.usageByModel[modelId];
    
    // Vérifier si le modèle n'a pas atteint sa limite de tokens
    if (modelUsage && modelUsage.tokens > modelConfig.maxTokens * 0.9) {
      toast.error('Limite de tokens proche pour ce modèle');
      return;
    }

    onModelSelect(modelId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Sélection du modèle
        </h3>
        <TouchFeedback onClick={() => toast.success('Chaque modèle a ses spécificités')}>
          <div className="p-2 hover:bg-gray-100 rounded-full">
            <Info className="h-5 w-5 text-gray-500" />
          </div>
        </TouchFeedback>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(AI_MODELS).map(([id, model]) => {
          const modelUsage = stats.usageByModel[id];
          const usagePercentage = modelUsage 
            ? (modelUsage.tokens / model.maxTokens) * 100 
            : 0;

          return (
            <TouchFeedback key={id} onClick={() => handleModelSelect(id)}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedModel === id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`${
                      selectedModel === id ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {getModelIcon(model.provider)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{model.name}</h3>
                      <p className="text-sm text-gray-500">
                        {model.maxTokens.toLocaleString()} tokens
                      </p>
                    </div>
                  </div>
                  {usagePercentage > 80 && (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>

                {modelUsage && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Utilisation</span>
                      <span>{Math.round(usagePercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          usagePercentage > 90 
                            ? 'bg-red-500'
                            : usagePercentage > 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </TouchFeedback>
          );
        })}
      </div>
    </div>
  );
}
```