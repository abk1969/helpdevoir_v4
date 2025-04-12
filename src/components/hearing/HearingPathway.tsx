import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { 
  Ear, 
  HandMetal, 
  MessageSquare, 
  Eye, 
  Video, 
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import SignLanguageTraining from './exercises/SignLanguageTraining';
import VisualComprehension from './exercises/VisualComprehension';
import LipReading from './exercises/LipReading';

const exerciseModules = [
  {
    id: 'sign-language',
    title: 'Langue des Signes',
    icon: HandMetal,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
    description: 'Apprentissage interactif de la LSF avec reconnaissance gestuelle',
    component: SignLanguageTraining,
    features: [
      'Dictionnaire LSF interactif',
      'Exercices progressifs',
      'Reconnaissance gestuelle par IA',
      'Feedback en temps réel'
    ]
  },
  {
    id: 'visual-comprehension',
    title: 'Compréhension Visuelle',
    icon: Eye,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
    description: 'Renforcement de la compréhension par supports visuels',
    component: VisualComprehension,
    features: [
      'Cartes conceptuelles',
      'Schémas explicatifs',
      'Animations pédagogiques',
      'Exercices visuels'
    ]
  },
  {
    id: 'lip-reading',
    title: 'Lecture Labiale',
    icon: MessageSquare,
    color: 'bg-green-100',
    iconColor: 'text-green-600',
    description: 'Entraînement à la lecture sur les lèvres avec vidéos HD',
    component: LipReading,
    features: [
      'Vidéos haute définition',
      'Ralenti et zoom',
      'Exercices progressifs',
      'Feedback détaillé'
    ]
  }
];

export default function HearingPathway() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const SelectedExercise = selectedModule 
    ? exerciseModules.find(m => m.id === selectedModule)?.component 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => selectedModule ? setSelectedModule(null) : navigate(`/students/${studentId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {selectedModule ? 'Retour aux exercices' : 'Retour au profil'}
        </button>

        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Parcours Adapté - Malentendants
          </h1>
          <p className="text-gray-600">
            Apprentissage personnalisé avec support visuel et gestuel
          </p>
        </header>

        {showIntro && !selectedModule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HandMetal className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Communication Visuelle</h3>
                <p className="text-gray-600">Support visuel enrichi et langue des signes intégrée</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Vidéos Sous-titrées</h3>
                <p className="text-gray-600">Contenu multimédia adapté avec sous-titres et transcriptions</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Suivi Personnalisé</h3>
                <p className="text-gray-600">Progression adaptée et feedback visuel constant</p>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => setShowIntro(false)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Commencer les exercices
              </button>
            </div>
          </motion.div>
        )}

        {!showIntro && !selectedModule && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exerciseModules.map((module) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedModule(module.id)}
                >
                  <div className={`${module.color} p-6`}>
                    <div className="flex items-center mb-4">
                      <Icon className={`h-8 w-8 ${module.iconColor}`} />
                      <h3 className="ml-3 text-xl font-semibold">{module.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <ul className="space-y-2">
                      {module.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <Lightbulb className="h-4 w-4 mr-2 text-indigo-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {selectedModule && SelectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <SelectedExercise />
          </motion.div>
        )}
      </div>
    </div>
  );
}