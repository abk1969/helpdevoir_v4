import React from 'react';
import { useAIQuota } from '../../hooks/useAIQuota';
import QuotaDisplay from './QuotaDisplay';
import QuotaExceededModal from './QuotaExceededModal';

interface AIAssistantProps {
  children: React.ReactNode;
}

export default function AIAssistant({ children }: AIAssistantProps) {
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
      
      <div className="relative">
        {children}
      </div>

      <QuotaExceededModal
        isOpen={showQuotaModal}
        onClose={closeQuotaModal}
        timeLeft={formatTimeLeft(timeUntilReset)}
        isFreemium={isFreemium}
      />
    </div>
  );
}