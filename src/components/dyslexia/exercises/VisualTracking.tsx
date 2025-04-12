import React, { useState, useEffect } from 'react';
import { Eye, ArrowRight } from 'lucide-react';

const words = [
  ['chat', 'chien', 'cheval', 'chameau'],
  ['maison', 'maître', 'matin', 'marche'],
  ['petit', 'poire', 'pomme', 'poire'],
  ['rouge', 'roule', 'route', 'roue']
];

export default function VisualTracking() {
  const [currentSequence, setCurrentSequence] = useState(0);
  const [highlightedWord, setHighlightedWord] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8">
        Suivi Visuel
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
        <button
          onClick={startExercise}
          className="flex items-center bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          <Eye className="h-5 w-5 mr-2" />
          {isPlaying ? 'Réinitialiser' : 'Commencer'}
        </button>
      </div>

      <div className="flex items-center justify-center space-x-4">
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

      <div className="mt-8 text-center">
        <button
          onClick={() => setCurrentSequence((prev) => (prev + 1) % words.length)}
          className="flex items-center justify-center mx-auto text-purple-600 hover:text-purple-700"
        >
          Séquence suivante
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
}