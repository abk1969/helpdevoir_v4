import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';

interface NavigationBarProps {
  title?: string;
  showBack?: boolean;
  showHome?: boolean;
  onBack?: () => void;
}

export default function NavigationBar({
  title,
  showBack = true,
  showHome = true,
  onBack
}: NavigationBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBack && (
            <TouchFeedback onClick={handleBack}>
              <div className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Retour</span>
              </div>
            </TouchFeedback>
          )}
          {title && (
            <h1 className="text-lg font-medium text-gray-900">{title}</h1>
          )}
        </div>

        {showHome && (
          <TouchFeedback onClick={() => navigate('/')}>
            <div className="flex items-center text-gray-600 hover:text-gray-900">
              <Home className="h-5 w-5 mr-2" />
              <span>Accueil</span>
            </div>
          </TouchFeedback>
        )}
      </div>
    </div>
  );
}