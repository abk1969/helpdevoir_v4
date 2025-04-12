import React from 'react';
import { useAIQuota } from '../../hooks/useAIQuota';
import QuotaDisplay from './QuotaDisplay';
import QuotaExceededModal from './QuotaExceededModal';
import AILoadingState from './AILoadingState';
import AIErrorState from './AIErrorState';

interface AIQuotaProviderProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export default function AIQuotaProvider({
  children,
  isLoading,
  error,
  onRetry
}: AIQuotaProviderProps) {
  const { 
    showQuotaModal, 
    closeQuotaModal, 
    isFreemium,
    timeUntilReset 
  } = useAIQuota();

  const formatTimeLeft = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-4">
      <QuotaDisplay />
      
      {isLoading ? (
        <AILoadingState />
      ) : error ? (
        <AIErrorState message={error.message} onRetry={onRetry} />
      ) : (
        <div className="relative">
          {children}
        </div>
      )}

      <QuotaExceededModal
        isOpen={showQuotaModal}
        onClose={closeQuotaModal}
        timeLeft={formatTimeLeft(timeUntilReset)}
        isFreemium={isFreemium}
      />
    </div>
  );
}