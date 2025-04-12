```typescript
import { AIModelConfig, AI_MODELS } from './index';
import { errorHandler } from '../errorHandler';

export interface ModelUsage {
  modelId: string;
  tokens: number;
  timestamp: string;
  cost: number;
}

class ModelManager {
  private static instance: ModelManager;
  private usageHistory: ModelUsage[] = [];
  private currentModel: string = 'claude-3-sonnet';
  private maxTokensPerRequest: number = 4096;

  private constructor() {
    this.loadUsageHistory();
  }

  static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  private loadUsageHistory(): void {
    try {
      const savedHistory = localStorage.getItem('ai-model-usage');
      if (savedHistory) {
        this.usageHistory = JSON.parse(savedHistory);
      }
    } catch (error) {
      errorHandler.handleError(error as Error, 'Loading AI model usage history');
    }
  }

  private saveUsageHistory(): void {
    try {
      localStorage.setItem('ai-model-usage', JSON.stringify(this.usageHistory));
    } catch (error) {
      errorHandler.handleError(error as Error, 'Saving AI model usage history');
    }
  }

  setCurrentModel(modelId: string): void {
    if (!AI_MODELS[modelId]) {
      throw new Error(`Modèle non supporté: ${modelId}`);
    }
    this.currentModel = modelId;
  }

  getCurrentModel(): string {
    return this.currentModel;
  }

  getModelConfig(modelId: string): AIModelConfig {
    const config = AI_MODELS[modelId];
    if (!config) {
      throw new Error(`Configuration non trouvée pour le modèle: ${modelId}`);
    }
    return config;
  }

  recordUsage(modelId: string, tokens: number): void {
    const cost = this.calculateCost(modelId, tokens);
    const usage: ModelUsage = {
      modelId,
      tokens,
      timestamp: new Date().toISOString(),
      cost
    };

    this.usageHistory.push(usage);
    this.saveUsageHistory();
  }

  private calculateCost(modelId: string, tokens: number): number {
    // Prix par 1000 tokens (en USD)
    const prices: Record<string, number> = {
      'claude-3-sonnet': 0.015,
      'gpt-4-turbo': 0.01,
      'mistral-large': 0.008,
      'pistral-12b': 0.006,
      'llama-2-70b': 0.005
    };

    const pricePerToken = (prices[modelId] || 0.01) / 1000;
    return tokens * pricePerToken;
  }

  getUsageStats(days: number = 30): {
    totalTokens: number;
    totalCost: number;
    usageByModel: Record<string, { tokens: number; cost: number }>;
  } {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const recentUsage = this.usageHistory.filter(
      usage => new Date(usage.timestamp) >= cutoff
    );

    const stats = {
      totalTokens: 0,
      totalCost: 0,
      usageByModel: {} as Record<string, { tokens: number; cost: number }>
    };

    recentUsage.forEach(usage => {
      stats.totalTokens += usage.tokens;
      stats.totalCost += usage.cost;

      if (!stats.usageByModel[usage.modelId]) {
        stats.usageByModel[usage.modelId] = { tokens: 0, cost: 0 };
      }
      stats.usageByModel[usage.modelId].tokens += usage.tokens;
      stats.usageByModel[usage.modelId].cost += usage.cost;
    });

    return stats;
  }

  getTokenLimit(modelId: string): number {
    return AI_MODELS[modelId]?.maxTokens || this.maxTokensPerRequest;
  }

  setMaxTokensPerRequest(tokens: number): void {
    this.maxTokensPerRequest = tokens;
  }

  clearUsageHistory(): void {
    this.usageHistory = [];
    this.saveUsageHistory();
  }
}

export const modelManager = ModelManager.getInstance();
```