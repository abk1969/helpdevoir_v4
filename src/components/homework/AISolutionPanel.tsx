import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAITutorStore } from '../../store/aiTutorStore';
import { Brain, Eye, Ear, ChevronDown, ChevronUp, BookOpen, Video, Volume2 } from 'lucide-react';
import { Student } from '../../types';

interface AISolutionPanelProps {
  homeworkId: string;
  student: Student;
}

export default function AISolutionPanel({ homeworkId, student }: AISolutionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getSolutionForHomework, generateSolution } = useAITutorStore();
  const solution = getSolutionForHomework(homeworkId);

  const handleGenerateSolution = async () => {
    await generateSolution(homeworkId, "Contenu du devoir...", {
      hasDyslexia: student.hasDyslexia,
      visuallyImpaired: student.visuallyImpaired,
      hearingImpaired: student.hearingImpaired
    });
  };

  if (!solution) {
    return (
      <div className="mt-6">
        <button
          onClick={handleGenerateSolution}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 touch-button"
        >
          Générer une solution IA
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all touch-button"
      >
        <div className="flex items-center space-x-3">
          <Brain className="h-5 w-5 text-indigo-600" />
          <span className="font-medium">Solution IA</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 p-4 bg-white rounded-lg shadow-sm"
        >
          {/* Version standard */}
          <div>
            <h3 className="text-lg font-medium mb-4">Solution détaillée</h3>
            <div className="space-y-4">
              {solution.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Versions adaptées */}
          {solution.adaptedContent && (
            <div className="space-y-4">
              {student.hasDyslexia && solution.adaptedContent.dyslexia && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Brain className="h-5 w-5 text-purple-600 mr-2" />
                    <h4 className="font-medium">Version adaptée dyslexie</h4>
                  </div>
                  <p className="font-dyslexic">{solution.adaptedContent.dyslexia}</p>
                </div>
              )}

              {student.visuallyImpaired && solution.adaptedContent.visual && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Eye className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-medium">Version adaptée malvoyants</h4>
                  </div>
                  <div className="flex space-x-3">
                    <button className="p-2 bg-white rounded-lg touch-button">
                      <Volume2 className="h-5 w-5 text-green-600" />
                    </button>
                    <p className="text-lg">{solution.adaptedContent.visual}</p>
                  </div>
                </div>
              )}

              {student.hearingImpaired && solution.adaptedContent.hearing && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Ear className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium">Version adaptée malentendants</h4>
                  </div>
                  <div className="space-y-3">
                    <p>{solution.adaptedContent.hearing}</p>
                    <div className="flex space-x-3">
                      <button className="flex items-center px-3 py-2 bg-white rounded-lg touch-button">
                        <Video className="h-5 w-5 text-blue-600 mr-2" />
                        <span>Voir en LSF</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ressources complémentaires */}
          <div>
            <h3 className="text-lg font-medium mb-4">Ressources complémentaires</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {solution.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors touch-button"
                >
                  <BookOpen className="h-5 w-5 text-gray-600 mr-2" />
                  <span>Ressource {index + 1}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}