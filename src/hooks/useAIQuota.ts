import { useState, useCallback } from 'react';
import { useAIQuotaStore } from '../store/aiQuotaStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export function useAIQuota() {
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const { parent } = useAuthStore();
  const { 
    incrementUsage,
    isQuotaExceeded,
    getRemainingQuota,
    getTimeUntilReset
  } = useAIQuotaStore();

  const checkQuota = useCallback((tokens: number) => {
    if (isQuotaExceeded) {
      setShowQuotaModal(true);
      return false;
    }

    const canProceed = incrementUsage(tokens);
    if (!canProceed) {
      setShowQuotaModal(true);
      toast.error('Limite d\'utilisation atteinte', {
        id: 'quota-exceeded',
        duration: 4000
      });
      return false;
    }

    const remaining = getRemainingQuota();
    if (remaining.prompts <= 2 || remaining.tokens <= 200) {
      toast.warning(
        `Il ne vous reste que ${remaining.prompts} prompts et ${remaining.tokens} tokens`, 
        { id: 'quota-warning' }
      );
    }

    return true;
  }, [isQuotaExceeded, incrementUsage, getRemainingQuota]);

  const closeQuotaModal = useCallback(() => {
    setShowQuotaModal(false);
  }, []);

  return {
    checkQuota,
    showQuotaModal,
    closeQuotaModal,
    isFreemium: parent?.subscription?.plan === 'freemium',
    timeUntilReset: getTimeUntilReset(),
    remainingQuota: getRemainingQuota()
  };
}