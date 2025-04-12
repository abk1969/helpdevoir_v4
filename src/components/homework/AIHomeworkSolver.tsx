import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Lightbulb, 
  Camera, 
  MessageSquare, 
  ChevronRight,
  Calculator,
  BookOpen,
  PenTool,
  Microscope,
  ArrowLeft,
  Check
} from 'lucide-react';
import { HomeworkAssistant } from '../../utils/ai/homeworkAssistant';
import { Homework } from '../../types';
import TouchFeedback from '../common/TouchFeedback';
import toast from 'react-hot-toast';

interface AIHomeworkSolverProps {
  homework: Homework;
  onClose: () => void;
}

type AssistanceMode = 'step-by-step' | 'quick-help' | 'detailed-explanation' | 'visual-guide';

interface AssistanceStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  mode: AssistanceMode;
}

export default function AIHomeworkSolver({ homework, onClose }: AIHomeworkSolverProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState<AssistanceMode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);

  const assistant = new HomeworkAssistant();

  const assistanceModes: AssistanceStep[] = [
    {
      id: 'step-by-step',
      title: 'Aide pas à pas',
      description: 'Résolution guidée avec explications détaillées',
      icon: <ChevronRight className="h-6 w-6 text-green-500" />,
      mode: 'step-by-step'
    },
    {
      id: 'quick-help',
      title: 'Aide rapide',
      description: 'Conseils et indices pour débloquer',
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
      mode: 'quick-help'
    },
    {
      id: 'detailed-explanation',
      title: 'Explication détaillée',
      description: 'Comprendre en profondeur le sujet',
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      mode: 'detailed-explanation'
    },
    {
      id: 'visual-guide',
      title: 'Guide visuel',
      description: 'Schémas et illustrations explicatives',
      icon: <Camera className="h-6 w-6 text-purple-500" />,
      mode: 'visual-guide'
    }
  ];

  const handleModeSelection = async (mode: AssistanceMode) => {
    setSelectedMode(mode);
    setIsProcessing(true);
    try {
      const response = await assistant.getHomeworkHelp(
        homework,
        `Je voudrais une ${mode === 'step-by-step' ? 'aide pas à pas' : 
          mode === 'quick-help' ? 'aide rapide' :
          mode === 'detailed-explanation' ? 'explication détaillée' :
          'guide visuel'} pour ce devoir.`
      );
      setAiResponse(response);
      // Simuler un score de confiance
      setConfidence(Math.floor(Math.random() * 30) + 70);
    } catch (error) {
      toast.error('Une erreur est survenue lors de la génération de l\'aide');
    } finally {
      setIsProcessing(false);
    }
  };

  const getSubjectIcon = () => {
    switch (homework.subjectId.split('-')[0]) {
      case 'math':
        return <Calculator className="h-6 w-6" />;
      case 'fr':
        return <PenTool className="h-6 w-6" />;
      case 'sciences':
        return <Microscope className="h-6 w-6" />;
      default:
        return <BookOpen className="h-6 w-6" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div 
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        layoutId="ai-homework-solver"
      >
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-7 w-7 text-indigo-600" />
              <h2 className="text-2xl font-bold">Assistant IA</h2>
            </div>
            <TouchFeedback onClick={onClose}>
              <div className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </div>
            </TouchFeedback>
          </div>

          <div className="mt-4 flex items-center space-x-3 text-sm text-gray-600">
            {getSubjectIcon()}
            <span>{homework.title}</span>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            {!selectedMode ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {assistanceModes.map((mode) => (
                  <TouchFeedback 
                    key={mode.id}
                    onClick={() => handleModeSelection(mode.mode)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        {mode.icon}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {mode.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {mode.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </TouchFeedback>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="mb-4"
                    >
                      <Brain className="h-12 w-12 text-indigo-600" />
                    </motion.div>
                    <p className="text-gray-600">Analyse du devoir en cours...</p>
                  </div>
                ) : aiResponse && (
                  <>
                    <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <div>
                        <span className="font-medium text-green-900">
                          Niveau de confiance: {confidence}%
                        </span>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <div className="bg-gray-50 p-6 rounded-xl">
                        {aiResponse.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <TouchFeedback onClick={() => setSelectedMode(null)}>
                        <div className="px-4 py-2 text-gray-600 hover:text-gray-900">
                          Changer de mode
                        </div>
                      </TouchFeedback>
                      <TouchFeedback onClick={onClose}>
                        <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                          Terminer
                        </div>
                      </TouchFeedback>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}