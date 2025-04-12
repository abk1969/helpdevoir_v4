import React, { useState } from 'react';
import { Volume2, Shuffle, Check } from 'lucide-react';

const syllables = {
  simple: ['ma', 'pa', 'ta', 'ra', 'sa'],
  complex: ['pla', 'bra', 'cra', 'dra', 'tra'],
  advanced: ['tion', 'ment', 'ble', 'pre', 'che']
};

export default function SyllableBuilder() {
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<keyof typeof syllables>('simple');
  const [feedback, setFeedback] = useState('');

  const playSound = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  const addSyllable = (syllable: string) => {
    setSelectedSyllables([...selectedSyllables, syllable]);
    playSound(syllable);
  };

  const checkWord = () => {
    const word = selectedSyllables.join('');
    // Ici, vous pourriez avoir une API ou une base de données de mots valides
    playSound(word);
    setFeedback('Mot créé !');
    setTimeout(() => setFeedback(''), 2000);
  };

  const shuffleSyllables = () => {
    setSelectedSyllables([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8">
        Constructeur de Syllabes
      </h2>

      <div className="mb-6">
        <div className="flex justify-center space-x-4">
          {Object.keys(syllables).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level as keyof typeof syllables)}
              className={`px-4 py-2 rounded-lg ${
                difficulty === level
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          {syllables[difficulty].map((syllable) => (
            <button
              key={syllable}
              onClick={() => addSyllable(syllable)}
              className="px-6 py-3 bg-gray-100 rounded-lg text-xl font-bold hover:bg-gray-200 transition-colors"
            >
              {syllable}
              <Volume2
                className="h-4 w-4 ml-2 inline-block text-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  playSound(syllable);
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-2xl font-bold mb-4">
          {selectedSyllables.length > 0 ? selectedSyllables.join('') : '_ _ _'}
        </div>
        {selectedSyllables.length > 0 && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={checkWord}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Check className="h-5 w-5 mr-2" />
              Vérifier
            </button>
            <button
              onClick={shuffleSyllables}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Shuffle className="h-5 w-5 mr-2" />
              Réinitialiser
            </button>
          </div>
        )}
      </div>

      {feedback && (
        <div className="text-center text-green-600 font-bold">
          {feedback}
        </div>
      )}
    </div>
  );
}