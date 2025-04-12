import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';

interface AIFeedbackCardProps {
  response: string;
  confidence: number;
  onThumbsUp: () => void;
  onThumbsDown: () => void;
  onReport: () => void;
}

export default function AIFeedbackCard({
  response,
  confidence,
  onThumbsUp,
  onThumbsDown,
  onReport
}: AIFeedbackCardProps) {
  const getConfidenceColor = () => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
          <h3 className="font-medium">Réponse de l'IA</h3>
        </div>
        <span className={`font-medium ${getConfidenceColor()}`}>
          {confidence}% de confiance
        </span>
      </div>

      <div className="prose max-w-none mb-6">
        {response.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex space-x-4">
          <TouchFeedback onClick={onThumbsUp}>
            <div className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
              <ThumbsUp className="h-5 w-5" />
              <span className="text-sm">Utile</span>
            </div>
          </TouchFeedback>
          <TouchFeedback onClick={onThumbsDown}>
            <div className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
              <ThumbsDown className="h-5 w-5" />
              <span className="text-sm">Pas utile</span>
            </div>
          </TouchFeedback>
        </div>
        
        <TouchFeedback onClick={onReport}>
          <div className="flex items-center space-x-1 text-gray-600 hover:text-yellow-600">
            <Flag className="h-5 w-5" />
            <span className="text-sm">Signaler</span>
          </div>
        </TouchFeedback>
      </div>
    </motion.div>
  );
}