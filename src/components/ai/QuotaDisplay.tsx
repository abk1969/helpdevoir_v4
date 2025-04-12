import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, AlertTriangle, Crown } from 'lucide-react';
import { useAIQuotaStore } from '../../store/aiQuotaStore';
import { useAuthStore } from '../../store/authStore';
import TouchFeedback from '../common/TouchFeedback';
import { useNavigate } from 'react-router-dom';

export default function QuotaDisplay() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { parent } = useAuthStore();
  const { 
    getRemainingQuota, 
    isQuotaExceeded,
    getTimeUntilReset
  } = useAIQuotaStore();

  const quota = getRemainingQuota();
  const subscription = parent?.subscription?.plan || 'freemium';

  useEffect(() => {
    if (!isQuotaExceeded) return;

    const updateTimeLeft = () => {
      const msLeft = getTimeUntilReset();
      if (msLeft <= 0) {
        useAIQuotaStore.getState().resetQuota();
        return;
      }

      const hours = Math.floor(msLeft / (1000 * 60 * 60));
      const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [isQuotaExceeded, getTimeUntilReset]);

  if (isQuotaExceeded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 border border-amber-200 rounded-lg p-4"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-amber-800">
              Limite d'utilisation atteinte
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              Vous pourrez à nouveau utiliser l'assistant dans {timeLeft}
            </p>
            {subscription === 'freemium' && (
              <TouchFeedback 
                onClick={() => navigate('/subscription')}
                className="mt-3"
              >
                <div className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg">
                  <Crown className="h-4 w-4 mr-2" />
                  Passer à un forfait supérieur
                </div>
              </TouchFeedback>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <Brain className="h-5 w-5 text-indigo-600" />
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              Prompts restants : {quota.prompts}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-sm font-medium text-gray-700">
              Tokens restants : {quota.tokens}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
              style={{ 
                width: `${(quota.prompts / (subscription === 'premium' ? 500 : 100)) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-500">
        <Clock className="h-4 w-4 mr-1" />
        Réinitialisation quotidienne
      </div>
    </div>
  );
}