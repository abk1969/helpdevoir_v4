import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';

interface AIErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function AIErrorState({
  message = "Une erreur est survenue lors de la génération de la réponse",
  onRetry
}: AIErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <p className="text-red-600 text-center mb-4">{message}</p>
      {onRetry && (
        <TouchFeedback onClick={onRetry}>
          <div className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </div>
        </TouchFeedback>
      )}
    </div>
  );
}