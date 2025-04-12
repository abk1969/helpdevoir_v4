import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye,
  Volume2,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  CheckCircle,
  Calendar,
  Clock,
  Settings
} from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';
import { Homework } from '../../types';

interface VisualImpairedHomeworkViewProps {
  homework: Homework;
  onToggleComplete: () => void;
}

export default function VisualImpairedHomeworkView({
  homework,
  onToggleComplete
}: VisualImpairedHomeworkViewProps) {
  const [fontSize, setFontSize] = useState(20);
  const [contrast, setContrast] = useState(150);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const readText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${
        isDarkMode ? 'dark' : ''
      }`}
      style={{ filter: `contrast(${contrast}%)` }}
    >
      {/* En-tête */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Eye className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 
              className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {homework.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <TouchFeedback onClick={() => readText(homework.title)}>
              <div className="p-2 rounded-full bg-white/20 hover:bg-white/30">
                <Volume2 className="h-5 w-5" />
              </div>
            </TouchFeedback>
            <TouchFeedback onClick={() => setShowSettings(!showSettings)}>
              <div className="p-2 rounded-full bg-white/20 hover:bg-white/30">
                <Settings className="h-5 w-5" />
              </div>
            </TouchFeedback>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Date limite : {new Date(homework.dueDate).toLocaleDateString()}</span>
          </div>
          {homework.estimatedTime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Temps estimé : {homework.estimatedTime} min</span>
            </div>
          )}
        </div>

        {/* Contrôles d'accessibilité */}
        {showSettings && (
          <div className="mt-4 p-4 bg-white/10 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Taille du texte
                </label>
                <div className="flex items-center space-x-2">
                  <TouchFeedback onClick={() => setFontSize(Math.max(14, fontSize - 2))}>
                    <div className="p-2 rounded-lg bg-white/20">
                      <ZoomOut className="h-4 w-4" />
                    </div>
                  </TouchFeedback>
                  <input
                    type="range"
                    min="14"
                    max="32"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="flex-1"
                  />
                  <TouchFeedback onClick={() => setFontSize(Math.min(32, fontSize + 2))}>
                    <div className="p-2 rounded-lg bg-white/20">
                      <ZoomIn className="h-4 w-4" />
                    </div>
                  </TouchFeedback>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contraste
                </label>
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mode
                </label>
                <TouchFeedback onClick={() => setIsDarkMode(!isDarkMode)}>
                  <div className="flex items-center justify-center p-2 rounded-lg bg-white/20">
                    {isDarkMode ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </div>
                </TouchFeedback>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        {/* Description */}
        <div 
          className={`mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="flex justify-between items-start mb-4">
            <p>{homework.description}</p>
            <TouchFeedback onClick={() => readText(homework.description)}>
              <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 ml-4">
                <Volume2 className="h-4 w-4" />
              </div>
            </TouchFeedback>
          </div>
        </div>

        {/* Description audio */}
        {homework.visualImpairedSettings?.hasAudioDescription && (
          <div className="mb-6">
            <button
              onClick={() => readText(homework.visualImpairedSettings?.audioDescription || '')}
              className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Volume2 className="h-5 w-5 mr-2" />
              Écouter la description détaillée
            </button>
          </div>
        )}

        {/* Statut */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Eye className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mr-2`} />
            <span className="text-sm">
              Adapté pour les malvoyants
            </span>
          </div>
          <TouchFeedback onClick={onToggleComplete}>
            <div className={`p-2 rounded-full ${
              homework.completed 
                ? 'bg-green-100 text-green-600' 
                : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-400'
                  } hover:bg-gray-200`
            }`}>
              <CheckCircle className="h-6 w-6" />
            </div>
          </TouchFeedback>
        </div>
      </div>
    </motion.div>
  );
}