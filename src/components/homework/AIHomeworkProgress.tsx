import React from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface AIHomeworkProgressProps {
  progress: number;
  status: 'analyzing' | 'generating' | 'complete' | 'error';
  estimatedTime?: number;
}

export default function AIHomeworkProgress({ progress, status, estimatedTime }: AIHomeworkProgressProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'analyzing':
        return <Brain className="h-5 w-5 text-indigo-600" />;
      case 'generating':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'analyzing':
        return 'Analyse du devoir en cours...';
      case 'generating':
        return 'Génération de la solution...';
      case 'complete':
        return 'Solution générée avec succès !';
      case 'error':
        return 'Une erreur est survenue';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>
        {estimatedTime && status !== 'complete' && (
          <span className="text-sm text-gray-500">
            ~{estimatedTime}s restantes
          </span>
        )}
      </div>

      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`absolute left-0 top-0 h-full rounded-full ${
            status === 'error' ? 'bg-red-500' :
            status === 'complete' ? 'bg-green-500' :
            'bg-indigo-600'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}