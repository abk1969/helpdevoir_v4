import React from 'react';
import { ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';
import toast from 'react-hot-toast';

interface AIFeedbackButtonsProps {
  onFeedback?: (type: 'like' | 'dislike' | 'report') => void;
}

export default function AIFeedbackButtons({ onFeedback }: AIFeedbackButtonsProps) {
  const handleFeedback = (type: 'like' | 'dislike' | 'report') => {
    onFeedback?.(type);
    switch (type) {
      case 'like':
        toast.success('Merci pour votre retour positif !');
        break;
      case 'dislike':
        toast.error('Désolé que la réponse ne vous ait pas satisfait');
        break;
      case 'report':
        toast.error('Contenu signalé, merci de votre vigilance');
        break;
    }
  };

  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <div className="flex space-x-4">
        <TouchFeedback onClick={() => handleFeedback('like')}>
          <div className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
            <ThumbsUp className="h-5 w-5" />
            <span className="text-sm">Utile</span>
          </div>
        </TouchFeedback>
        <TouchFeedback onClick={() => handleFeedback('dislike')}>
          <div className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
            <ThumbsDown className="h-5 w-5" />
            <span className="text-sm">Pas utile</span>
          </div>
        </TouchFeedback>
      </div>
      
      <TouchFeedback onClick={() => handleFeedback('report')}>
        <div className="flex items-center space-x-1 text-gray-600 hover:text-yellow-600">
          <Flag className="h-5 w-5" />
          <span className="text-sm">Signaler</span>
        </div>
      </TouchFeedback>
    </div>
  );
}