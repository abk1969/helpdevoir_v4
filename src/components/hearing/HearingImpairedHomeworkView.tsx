```tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ear,
  HandMetal,
  Video,
  Image as ImageIcon,
  Settings,
  CheckCircle,
  Clock,
  Calendar,
  Lightbulb
} from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';
import { Homework } from '../../types';

interface HearingImpairedHomeworkViewProps {
  homework: Homework;
  onToggleComplete: () => void;
}

export default function HearingImpairedHomeworkView({
  homework,
  onToggleComplete
}: HearingImpairedHomeworkViewProps) {
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const visualInstructions = homework.visualInstructions || [];
  const signLanguageVideo = homework.signLanguageVideo;
  const visualSteps = homework.visualSteps || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* En-tête */}
      <div className="bg-blue-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Ear className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">{homework.title}</h3>
          </div>
          <TouchFeedback onClick={() => setShowSettings(!showSettings)}>
            <div className="p-2 rounded-full bg-white/20 hover:bg-white/30">
              <Settings className="h-5 w-5" />
            </div>
          </TouchFeedback>
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
        {/* Vidéo en langue des signes */}
        {signLanguageVideo && (
          <div className="mb-6">
            <h4 className="flex items-center text-lg font-medium mb-4">
              <HandMetal className="h-5 w-5 text-blue-600 mr-2" />
              Instructions en langue des signes
            </h4>
            <video
              src={signLanguageVideo}
              controls
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* Instructions visuelles */}
        {visualInstructions.length > 0 && (
          <div className="mb-6">
            <h4 className="flex items-center text-lg font-medium mb-4">
              <ImageIcon className="h-5 w-5 text-blue-600 mr-2" />
              Support visuel
            </h4>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentInstructionIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {visualInstructions[currentInstructionIndex].type === 'image' ? (
                    <img
                      src={visualInstructions[currentInstructionIndex].url}
                      alt={visualInstructions[currentInstructionIndex].description}
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <video
                      src={visualInstructions[currentInstructionIndex].url}
                      controls
                      className="w-full rounded-lg"
                    />
                  )}
                  <p className="mt-2 text-gray-600">
                    {visualInstructions[currentInstructionIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {visualInstructions.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {visualInstructions.map((_, index) => (
                    <TouchFeedback
                      key={index}
                      onClick={() => setCurrentInstructionIndex(index)}
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        index === currentInstructionIndex
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      }`} />
                    </TouchFeedback>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Étapes visuelles */}
        {visualSteps.length > 0 && (
          <div className="mb-6">
            <h4 className="flex items-center text-lg font-medium mb-4">
              <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
              Étapes à suivre
            </h4>
            <div className="space-y-4">
              {visualSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <h5 className="font-medium mb-2">
                    Étape {index + 1}: {step.title}
                  </h5>
                  <p className="text-gray-600">{step.content}</p>
                  {step.image && (
                    <img
                      src={step.image}
                      alt={step.title}
                      className="mt-2 rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description textuelle */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-gray-600">{homework.description}</p>
        </div>

        {/* Statut */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Ear className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-sm text-gray-600">
              Adapté pour les malentendants
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