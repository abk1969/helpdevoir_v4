import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MessageSquare
} from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';

interface AIAnalysisResultProps {
  result: {
    text: string;
    confidence: number;
    model: string;
    processingTime: number;
  };
  onFeedback?: (type: 'like' | 'dislike' | 'report') => void;
}

export default function AIAnalysisResult({
  result,
  onFeedback
}: AIAnalysisResultProps) {
  const getConfidenceColor = () => {
    if (result.confidence >= 0.9) return 'text-green-600';
    if (result.confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-indigo-600" />
          <div>
            <h3 className="font-medium text-gray-900">Analyse IA</h3>
            <p className="text-sm text-gray-500">
              via {result.model} • {result.processingTime}ms
            </p>
          </div>
        </div>
        <div className={`flex items-center ${getConfidenceColor()}`}>
          {result.confidence >= 0.7 ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 mr-2" />
          )}
          <span className="font-medium">
            {Math.round(result.confidence * 100)}% de confiance
          </span>
        </div>
      </div>

      <div className="prose max-w-none mb-6">
        {result.text.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>

      {onFeedback && (
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex space-x-4">
            <TouchFeedback onClick={() => onFeedback('like')}>
              <div className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
                <ThumbsUp className="h-5 w-5" />
                <span className="text-sm">Utile</span>
              </div>
            </TouchFeedback>
            <TouchFeedback onClick={() => onFeedback('dislike')}>
              <div className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
                <ThumbsDown className="h-5 w-5" />
                <span className="text-sm">Pas utile</span>
              </div>
            </TouchFeedback>
          </div>
          
          <TouchFeedback onClick={() => onFeedback('report')}>
            <div className="flex items-center space-x-1 text-gray-600 hover:text-yellow-600">
              <Flag className="h-5 w-5" />
              <span className="text-sm">Signaler</span>
            </div>
          </TouchFeedback>
        </div>
      )}
    </motion.div>
  );
}