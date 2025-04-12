// Export des configurations AI
export * from './aiConfig';

// Export des assistants et utilitaires
export * from './homeworkAssistant';

// Types pour l'IA
export interface AIModelConfig {
  name: string;
  maxTokens: number;
  temperature: number;
  provider: 'openai' | 'anthropic' | 'mistral' | 'aws' | 'replicate' | 'pistral';
}

// Configuration des modèles disponibles
export const AI_MODELS = {
  'claude-3-sonnet': {
    name: 'Claude 3 Sonnet',
    maxTokens: 4096,
    temperature: 0.7,
    provider: 'anthropic'
  },
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    maxTokens: 4096,
    temperature: 0.7,
    provider: 'openai'
  },
  'mistral-large': {
    name: 'Mistral Large',
    maxTokens: 4096,
    temperature: 0.7,
    provider: 'mistral'
  },
  'pistral-12b': {
    name: 'Pistral 12B',
    maxTokens: 4096,
    temperature: 0.7,
    provider: 'pistral'
  },
  'pistral-12b-instruct': {
    name: 'Pistral 12B Instruct',
    maxTokens: 4096,
    temperature: 0.7,
    provider: 'pistral'
  },
  'llama-2-70b': {
    name: 'Llama 2 70B',
    maxTokens: 4096,
    temperature: 0.7,
    provider: 'replicate'
  }
} as const;

// Types d'assistance disponibles
export enum AIAssistanceType {
  HOMEWORK_HELP = 'homework_help',
  IMAGE_ANALYSIS = 'image_analysis',
  MATH_PROBLEM = 'math_problem',
  LANGUAGE_CORRECTION = 'language_correction',
  SCIENCE_EXPLANATION = 'science_explanation'
}

// Interface pour les réponses de l'IA
export interface AIResponse {
  content: string;
  model: string;
  tokens: number;
  processingTime: number;
  timestamp: string;
}

// Utilitaires pour la gestion des prompts
export const createPrompt = (type: AIAssistanceType, content: string): string => {
  const prompts = {
    [AIAssistanceType.HOMEWORK_HELP]: 
      `En tant qu'assistant pédagogique, aide l'élève avec ce devoir: ${content}`,
    [AIAssistanceType.IMAGE_ANALYSIS]:
      `Analyse cette image de devoir et explique clairement ce qu'il faut faire: ${content}`,
    [AIAssistanceType.MATH_PROBLEM]:
      `Résous ce problème de mathématiques étape par étape: ${content}`,
    [AIAssistanceType.LANGUAGE_CORRECTION]:
      `Corrige ce texte en expliquant les erreurs: ${content}`,
    [AIAssistanceType.SCIENCE_EXPLANATION]:
      `Explique ce concept scientifique de manière simple: ${content}`
  };

  return prompts[type];
};

// Constantes pour les paramètres de l'IA
export const AI_CONSTANTS = {
  MAX_RETRIES: 3,
  TIMEOUT_MS: 30000,
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_MAX_TOKENS: 4096,
  RATE_LIMIT_REQUESTS: 10,
  RATE_LIMIT_WINDOW_MS: 60000
} as const;

// Types d'erreurs spécifiques à l'IA
export enum AIErrorType {
  INVALID_API_KEY = 'invalid_api_key',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  MODEL_OVERLOADED = 'model_overloaded',
  CONTEXT_LENGTH_EXCEEDED = 'context_length_exceeded',
  CONTENT_FILTERED = 'content_filtered',
  NETWORK_ERROR = 'network_error'
}

// Classe d'erreur personnalisée pour l'IA
export class AIError extends Error {
  constructor(
    public type: AIErrorType,
    message: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AIError';
  }
}