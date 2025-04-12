import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

export type SubscriptionTier = 'freemium' | 'essential' | 'family' | 'premium';

interface QuotaLimits {
  maxPrompts: number;
  maxTokens: number;
  cooldownHours: number;
}

const QUOTA_LIMITS: Record<SubscriptionTier, QuotaLimits> = {
  freemium: {
    maxPrompts: 10,
    maxTokens: 1000,
    cooldownHours: 24
  },
  essential: {
    maxPrompts: 50,
    maxTokens: 5000,
    cooldownHours: 12
  },
  family: {
    maxPrompts: 100,
    maxTokens: 10000,
    cooldownHours: 6
  },
  premium: {
    maxPrompts: 500,
    maxTokens: 50000,
    cooldownHours: 1
  }
};

interface AIQuotaState {
  promptsUsed: number;
  tokensUsed: number;
  lastResetTime: string;
  isQuotaExceeded: boolean;
  nextResetTime: string | null;
  incrementUsage: (tokens: number) => boolean;
  resetQuota: () => void;
  getRemainingQuota: () => { prompts: number; tokens: number };
  getTimeUntilReset: () => number;
}

export const useAIQuotaStore = create<AIQuotaState>()(
  persist(
    (set, get) => ({
      promptsUsed: 0,
      tokensUsed: 0,
      lastResetTime: new Date().toISOString(),
      isQuotaExceeded: false,
      nextResetTime: null,

      incrementUsage: (tokens: number) => {
        const subscription = useAuthStore.getState().parent?.subscription?.plan || 'freemium';
        const limits = QUOTA_LIMITS[subscription as SubscriptionTier];
        const currentState = get();

        // Vérifier si le quota est déjà dépassé
        if (currentState.isQuotaExceeded) {
          return false;
        }

        // Vérifier si l'ajout dépasserait les limites
        if (currentState.promptsUsed + 1 > limits.maxPrompts ||
            currentState.tokensUsed + tokens > limits.maxTokens) {
          
          const nextReset = new Date();
          nextReset.setHours(nextReset.getHours() + limits.cooldownHours);

          set({
            isQuotaExceeded: true,
            nextResetTime: nextReset.toISOString()
          });

          return false;
        }

        // Incrémenter l'utilisation
        set({
          promptsUsed: currentState.promptsUsed + 1,
          tokensUsed: currentState.tokensUsed + tokens
        });

        return true;
      },

      resetQuota: () => {
        set({
          promptsUsed: 0,
          tokensUsed: 0,
          lastResetTime: new Date().toISOString(),
          isQuotaExceeded: false,
          nextResetTime: null
        });
      },

      getRemainingQuota: () => {
        const subscription = useAuthStore.getState().parent?.subscription?.plan || 'freemium';
        const limits = QUOTA_LIMITS[subscription as SubscriptionTier];
        const { promptsUsed, tokensUsed } = get();

        return {
          prompts: Math.max(0, limits.maxPrompts - promptsUsed),
          tokens: Math.max(0, limits.maxTokens - tokensUsed)
        };
      },

      getTimeUntilReset: () => {
        const { nextResetTime } = get();
        if (!nextResetTime) return 0;

        const now = new Date();
        const reset = new Date(nextResetTime);
        return Math.max(0, reset.getTime() - now.getTime());
      }
    }),
    {
      name: 'ai-quota-storage',
      version: 1
    }
  )
);