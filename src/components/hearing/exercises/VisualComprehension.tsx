import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Check, X, ArrowRight, Award } from 'lucide-react';

const exercises = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
    question: 'Que voyez-vous sur l\'image ?',
    options: [
      'Une pomme sur un livre',
      'Une orange sur une table',
      'Un livre sans fruit',
      'Plusieurs livres empilés'
    ],
    correct: 0
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8',
    question: 'Quel objet est présent sur le bureau ?',
    options: [
      'Un ordinateur portable',
      'Une tablette',
      'Un cahier ouvert',
      'Une calculatrice'
    ],
    correct: 0
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1522661067900-ab829854a57f',
    question: 'Quelle activité est représentée ?',
    options: [
      'L\'écriture',
      'La lecture',
      'Le dessin',
      'La peinture'
    ],
    correct: 1
  }
];

export default function VisualComprehension() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === exercises[currentExercise].correct) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">
        Compréhension Visuelle
      </h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={exercises[currentExercise].image}
            alt="Exercise"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            {exercises[currentExercise].question}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {exercises[currentExercise].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
                className={`p-4 rounded-lg text-left transition-colors ${
                  selectedAnswer === index
                    ? index === exercises[currentExercise].correct
                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                      : 'bg-red-100 text-red-700 border-2 border-red-500'
                    : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                } ${showFeedback && index === exercises[currentExercise].correct 
                    ? 'ring-2 ring-green-500' 
                    : ''
                }`}
              >
                <div className="flex items-center">
                  {showFeedback && (
                    <span className="mr-2">
                      {index === exercises[currentExercise].correct ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : selectedAnswer === index ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : null}
                    </span>
                  )}
                  {option}
                </div>
              </motion.button>
            ))}
          </div>

          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-6 ${
                selectedAnswer === exercises[currentExercise].correct
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <div className="flex items-center">
                {selectedAnswer === exercises[currentExercise].correct ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    <span>Excellent ! C'est la bonne réponse.</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 mr-2" />
                    <span>
                      La bonne réponse était : {
                        exercises[currentExercise].options[exercises[currentExercise].correct]
                      }
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="font-medium">Score : {score}/{exercises.length}</span>
            </div>
            {showFeedback && currentExercise < exercises.length - 1 && (
              <button
                onClick={nextExercise}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Suivant
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            )}
            {showFeedback && currentExercise === exercises.length - 1 && (
              <div className="text-center text-lg font-medium text-indigo-600">
                Exercices terminés ! Score final : {score}/{exercises.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}