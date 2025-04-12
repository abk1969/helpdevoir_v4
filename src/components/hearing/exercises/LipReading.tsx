import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ZoomIn, Award, Check } from 'lucide-react';
import TouchFeedback from '../../common/TouchFeedback';

const words = [
  ['chat', 'chien', 'cheval', 'chameau'],
  ['maison', 'maître', 'matin', 'marche'],
  ['petit', 'poire', 'pomme', 'poire'],
  ['rouge', 'roule', 'route', 'roue']
];

export default function LipReading() {
  const [currentSequence, setCurrentSequence] = useState(0);
  const [highlightedWord, setHighlightedWord] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setHighlightedWord((prev) => {
          if (prev === words[currentSequence].length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSequence, speed]);

  const startExercise = () => {
    setHighlightedWord(0);
    setIsPlaying(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = answer.toLowerCase() === words[currentSequence][highlightedWord].toLowerCase();
    if (isCorrect) {
      setScore(score + 1);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setAnswer('');
        setHighlightedWord((prev) => (prev + 1) % words[currentSequence].length);
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8">
        Lecture Labiale
      </h2>

      <div className="mb-8">
        <div className="flex justify-center space-x-8">
          {words[currentSequence].map((word, index) => (
            <div
              key={index}
              className={`text-2xl font-bold transition-all duration-200 ${
                index === highlightedWord
                  ? 'text-purple-600 transform scale-110'
                  : 'text-gray-400'
              }`}
            >
              {word}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <TouchFeedback onClick={startExercise}>
          <div className="flex items-center bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Commencer
              </>
            )}
          </div>
        </TouchFeedback>

        <TouchFeedback onClick={() => setHighlightedWord(0)}>
          <div className="flex items-center bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
            <RotateCcw className="h-5 w-5 mr-2" />
            Réinitialiser
          </div>
        </TouchFeedback>
      </div>

      <div className="flex items-center justify-center space-x-4 mb-8">
        <span className="text-sm text-gray-600">Vitesse :</span>
        <input
          type="range"
          min="500"
          max="2000"
          step="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-48"
        />
        <span className="text-sm text-gray-600">
          {speed / 1000}s
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Votre réponse :
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Tapez le mot que vous voyez..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Vérifier
        </button>
      </form>

      <AnimatePresence>
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
      </AnimatePresence>

      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Award className="h-6 w-6 text-yellow-500" />
          <span className="text-xl font-bold">Score : {score}</span>
        </div>
      </div>
    </div>
  );
}