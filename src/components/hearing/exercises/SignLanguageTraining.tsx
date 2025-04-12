import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HandMetal, Video, Check, RefreshCw, Award } from 'lucide-react';
import SignLanguageRecognition from './SignLanguageRecognition';
import TouchFeedback from '../../common/TouchFeedback';

const signs = [
  { id: 'bonjour', name: 'Bonjour', video: 'https://example.com/lsf/bonjour.mp4' },
  { id: 'merci', name: 'Merci', video: 'https://example.com/lsf/merci.mp4' },
  { id: 'svp', name: 'S\'il vous plaît', video: 'https://example.com/lsf/svp.mp4' }
];

export default function SignLanguageTraining() {
  const [currentSign, setCurrentSign] = useState(0);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGestureDetected = (gesture: string) => {
    if (gesture === signs[currentSign].id) {
      setScore(score + 1);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setCurrentSign((prev) => (prev + 1) % signs.length);
      }, 1500);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Apprentissage de la LSF</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vidéo de démonstration */}
          <div>
            <h3 className="text-lg font-medium mb-4">Signe à reproduire :</h3>
            <div className="aspect-video bg-gray-900 rounded-lg mb-4">
              <video
                src={signs[currentSign].video}
                className="w-full h-full rounded-lg"
                controls
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">{signs[currentSign].name}</p>
              <TouchFeedback onClick={() => setCurrentSign((prev) => (prev + 1) % signs.length)}>
                <div className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                  <RefreshCw className="h-5 w-5" />
                </div>
              </TouchFeedback>
            </div>
          </div>

          {/* Zone de pratique */}
          <div>
            <h3 className="text-lg font-medium mb-4">Votre pratique :</h3>
            <SignLanguageRecognition
              onGestureDetected={handleGestureDetected}
              targetGesture={signs[currentSign].id}
            />
          </div>
        </div>

        {/* Score et progression */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Progression</h3>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">{score} points</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 rounded-full h-2 transition-all duration-500"
              style={{ width: `${(score / (signs.length * 2)) * 100}%` }}
            />
          </div>
        </div>

        {/* Message de succès */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5" />
              <span>Excellent ! Continuez ainsi !</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}