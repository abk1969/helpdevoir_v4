```tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  Type, 
  Palette, 
  Brain, 
  ZoomIn, 
  ZoomOut,
  Lightbulb,
  Clock,
  Calendar,
  CheckCircle,
  Settings,
  Eye
} from 'lucide-react';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import TouchFeedback from '../common/TouchFeedback';
import { Homework } from '../../types';

interface DyslexiaHomeworkViewProps {
  homework: Homework;
  onToggleComplete: () => void;
}

const colorSchemes = [
  { id: 'cream', name: 'Crème', bg: 'bg-[#f5f5dc]', text: 'text-gray-900' },
  { id: 'blue', name: 'Bleu clair', bg: 'bg-[#e6f3ff]', text: 'text-gray-900' },
  { id: 'yellow', name: 'Jaune pâle', bg: 'bg-[#fafad2]', text: 'text-gray-900' }
];

export default function DyslexiaHomeworkView({
  homework,
  onToggleComplete
}: DyslexiaHomeworkViewProps) {
  const [fontSize, setFontSize] = useState(homework.dyslexiaSettings?.fontSize || 18);
  const [colorScheme, setColorScheme] = useState(homework.dyslexiaSettings?.colorScheme || 'cream');
  const [lineSpacing, setLineSpacing] = useState(homework.dyslexiaSettings?.lineSpacing || 2);
  const [showSettings, setShowSettings] = useState(false);
  const { isDyslexiaMode } = useAccessibilityStore();

  const readText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  const getCurrentColorScheme = () => {
    const scheme = colorSchemes.find(s => s.id === colorScheme);
    return scheme || colorSchemes[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${
        isDyslexiaMode ? 'font-dyslexic' : ''
      }`}
    >
      {/* En-tête */}
      <div className={`p-6 ${getCurrentColorScheme().bg}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Brain className="h-6 w-6 text-purple-600" />
            <h3 
              className="text-xl font-bold"
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
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div 
          className={`mb-6 ${getCurrentColorScheme().bg} p-4 rounded-lg`}
          style={{ 
            fontSize: `${fontSize}px`,
            lineHeight: lineSpacing
          }}
        >
          <p>{homework.description}</p>
          <TouchFeedback 
            onClick={() => readText(homework.description)}
            className="mt-4"
          >
            <div className="inline-flex items-center px-3 py-1 bg-white/50 rounded-full text-sm">
              <Volume2 className="h-4 w-4 mr-2" />
              Écouter la description
            </div>
          </TouchFeedback>
        </div>

        {/* Paramètres d'affichage */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Paramètres d'affichage
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Taille du texte */}
                  <div>
                    <label className="flex items-center text-sm text-gray-700 mb-2">
                      <Type className="h-4 w-4 mr-2" />
                      Taille du texte
                    </label>
                    <div className="flex items-center space-x-2">
                      <TouchFeedback onClick={() => setFontSize(Math.max(14, fontSize - 2))}>
                        <div className="p-1 rounded bg-gray-200">
                          <ZoomOut className="h-4 w-4" />
                        </div>
                      </TouchFeedback>
                      <input
                        type="range"
                        min="14"
                        max="24"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="flex-1"
                      />
                      <TouchFeedback onClick={() => setFontSize(Math.min(24, fontSize + 2))}>
                        <div className="p-1 rounded bg-gray-200">
                          <ZoomIn className="h-4 w-4" />
                        </div>
                      </TouchFeedback>
                    </div>
                  </div>

                  {/* Espacement des lignes */}
                  <div>
                    <label className="flex items-center text-sm text-gray-700 mb-2">
                      <Type className="h-4 w-4 mr-2" />
                      Espacement
                    </label>
                    <input
                      type="range"
                      min="1.5"
                      max="3"
                      step="0.5"
                      value={lineSpacing}
                      onChange={(e) => setLineSpacing(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Couleur de fond */}
                  <div>
                    <label className="flex items-center text-sm text-gray-700 mb-2">
                      <Palette className="h-4 w-4 mr-2" />
                      Couleur de fond
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorSchemes.map((scheme) => (
                        <TouchFeedback
                          key={scheme.id}
                          onClick={() => setColorScheme(scheme.id)}
                        >
                          <div className={`p-2 rounded ${scheme.bg} ${scheme.text} text-center text-sm ${
                            colorScheme === scheme.id ? 'ring-2 ring-purple-500' : ''
                          }`}>
                            {scheme.name}
                          </div>
                        </TouchFeedback>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statut */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm text-gray-600">
              Adapté pour la dyslexie
            </span>
          </div>
          <TouchFeedback onClick={onToggleComplete}>
            <div className={`p-2 rounded-full ${
              homework.completed 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}>
              <CheckCircle className="h-6 w-6" />
            </div>
          </TouchFeedback>
        </div>
      </div>
    </motion.div>
  );
}
```