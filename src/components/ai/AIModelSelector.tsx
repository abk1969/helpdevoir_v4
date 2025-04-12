import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Star } from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';
import { useAIQuota } from '../../hooks/useAIQuota';

interface AIModelSelectorProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

const models = [
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    icon: Brain,
    description: 'Modèle le plus avancé, idéal pour l\'aide aux devoirs',
    tokens: 4000
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    icon: Sparkles,
    description: 'Excellent pour les explications détaillées',
    tokens: 4000
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    icon: Zap,
    description: 'Rapide et efficace pour les questions simples',
    tokens: 4000
  }
];

export default function AIModelSelector({
  selectedModel,
  onModelSelect
}: AIModelSelectorProps) {
  const { remainingQuota } = useAIQuota();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {models.map((model) => {
        const Icon = model.icon;
        const isSelected = selectedModel === model.id;
        const hasEnoughTokens = remainingQuota.tokens >= model.tokens;

        return (
          <TouchFeedback
            key={model.id}
            onClick={() => hasEnoughTokens && onModelSelect(model.id)}
            disabled={!hasEnoughTokens}
          >
            <motion.div
              whileHover={{ scale: hasEnoughTokens ? 1.02 : 1 }}
              className={`p-4 rounded-lg border-2 transition-colors ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!hasEnoughTokens ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon className={`h-5 w-5 ${
                  isSelected ? 'text-indigo-600' : 'text-gray-500'
                }`} />
                <h3 className="font-medium">{model.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{model.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                {model.tokens} tokens requis
              </div>
            </motion.div>
          </TouchFeedback>
        );
      })}
    </div>
  );
}