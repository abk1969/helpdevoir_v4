import React, { useState } from 'react';
import { Play, Volume2, Check, X } from 'lucide-react';

const phonemes = [
  { sound: 'an', words: ['enfant', 'blanc', 'champ'] },
  { sound: 'on', words: ['maison', 'pont', 'rond'] },
  { sound: 'in', words: ['lapin', 'matin', 'fin'] },
  { sound: 'ou', words: ['loup', 'roue', 'bout'] }
];

export default function PhonemeTraining() {
  const [currentPhoneme, setCurrentPhoneme] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const playSound = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (word: string) => {
    const correct = phonemes[currentPhoneme].words.includes(word);
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setScore(score + 1);

    setTimeout(() => {
      setShowFeedback(false);
      setCurrentPhoneme((prev) => (prev + 1) % phonemes.length);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8">
        Entraînement aux Phonèmes
      </h2>

      <div className="text-center mb-8">
        <div className="text-4xl font-bold mb-4">
          Son "{phonemes[currentPhoneme].sound}"
        </div>
        <button
          onClick={() => playSound(phonemes[currentPhoneme].sound)}
          className="flex items-center justify-center mx-auto bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <Volume2 className="h-5 w-5 mr-2" />
          Écouter le son
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {phonemes[currentPhoneme].words.map((word) => (
          <div key={word} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <button
              onClick={() => handleAnswer(word)}
              className="text-xl hover:text-purple-600 transition-colors"
            >
              {word}
            </button>
            <button
              onClick={() => playSound(word)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {showFeedback && (
        <div className={`text-center p-4 rounded-lg ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isCorrect ? (
            <div className="flex items-center justify-center">
              <Check className="h-6 w-6 mr-2" />
              Excellent !
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <X className="h-6 w-6 mr-2" />
              Essaie encore !
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-8">
        <p className="text-xl font-semibold">Score: {score}</p>
      </div>
    </div>
  );
}