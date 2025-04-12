import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  ZoomIn,
  Volume2,
  Lightbulb,
  ArrowLeft,
  Palette,
  Settings,
  Maximize2,
  MessageSquare,
  Award,
  Headphones
} from 'lucide-react';
import ColorContrastExercise from './exercises/ColorContrastExercise';
import TextToSpeechReader from './exercises/TextToSpeechReader';
import GestureControl from './exercises/GestureControl';
import VoiceNavigation from './exercises/VoiceNavigation';

const exerciseModules = [
  {
    id: 'contrast',
    title: 'Contraste et Couleurs',
    icon: Palette,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
    description: 'Exercices d\'adaptation du contraste et des couleurs',
    component: ColorContrastExercise,
    features: [
      'Ajustement dynamique du contraste',
      'Modes de couleur personnalisés',
      'Filtres de correction chromatique',
      'Préréglages pour daltonisme'
    ]
  },
  {
    id: 'audio',
    title: 'Navigation Audio',
    icon: Headphones,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
    description: 'Navigation et lecture audio intelligente',
    component: TextToSpeechReader,
    features: [
      'Lecture audio naturelle',
      'Contrôle de la vitesse',
      'Navigation par voix',
      'Description audio des images'
    ]
  },
  {
    id: 'gestures',
    title: 'Contrôle Gestuel',
    icon: Maximize2,
    color: 'bg-green-100',
    iconColor: 'text-green-600',
    description: 'Navigation par gestes et commandes',
    component: GestureControl,
    features: [
      'Commandes gestuelles',
      'Zoom intelligent',
      'Navigation tactile',
      'Retour haptique'
    ]
  },
  {
    id: 'voice',
    title: 'Assistant Vocal',
    icon: MessageSquare,
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    description: 'Assistant vocal intelligent',
    component: VoiceNavigation,
    features: [
      'Commandes vocales naturelles',
      'Navigation contextuelle',
      'Aide intelligente',
      'Dictée vocale'
    ]
  }
];

export default function VisualImpairmentPathway() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [contrast, setContrast] = useState(100);

  // Active le mode haute visibilité par défaut
  useEffect(() => {
    document.documentElement.classList.add('high-contrast');
    return () => {
      document.documentElement.classList.remove('high-contrast');
    };
  }, []);

  const handleKeyboardNavigation = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (selectedModule) {
        setSelectedModule(null);
      } else {
        navigate(`/students/${studentId}`);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardNavigation);
    return () => {
      window.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, [selectedModule]);

  const SelectedExercise = selectedModule 
    ? exerciseModules.find(m => m.id === selectedModule)?.component 
    : null;

  const announceContent = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => selectedModule ? setSelectedModule(null) : navigate(`/students/${studentId}`)}
            className="flex items-center text-lg font-medium p-4 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-indigo-500"
            onFocus={() => announceContent('Bouton retour')}
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            {selectedModule ? 'Retour aux exercices' : 'Retour au profil'}
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:ring-indigo-500"
              aria-label="Augmenter la taille du texte"
            >
              <ZoomIn className="h-6 w-6" />
            </button>
            <button
              onClick={() => announceContent('Page du parcours adapté pour malvoyants')}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:ring-indigo-500"
              aria-label="Lire la page"
            >
              <Volume2 className="h-6 w-6" />
            </button>
          </div>
        </div>

        <header className="text-center mb-12">
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ fontSize: `${fontSize}px` }}
          >
            Parcours Adapté - Malvoyants
          </h1>
          <p 
            className="text-xl text-gray-600"
            style={{ fontSize: `${fontSize * 0.75}px` }}
          >
            Apprentissage personnalisé avec support audio et visuel adapté
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
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Adaptation Visuelle</h3>
                <p className="text-gray-600">Contraste et taille optimisés pour votre vision</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Support Audio</h3>
                <p className="text-gray-600">Navigation et lecture audio intelligente</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personnalisation</h3>
                <p className="text-gray-600">Interface adaptée à vos besoins</p>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => setShowIntro(false)}
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500"
              >
                Commencer les exercices
              </button>
            </div>
          </motion.div>
        )}

        {!showIntro && !selectedModule && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exerciseModules.map((module) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer focus-within:ring-4 focus-within:ring-indigo-500"
                  onClick={() => setSelectedModule(module.id)}
                  onFocus={() => announceContent(module.title + ': ' + module.description)}
                  tabIndex={0}
                  role="button"
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

        <AnimatePresence mode="wait">
          {selectedModule && SelectedExercise && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <SelectedExercise 
                fontSize={fontSize}
                contrast={contrast}
                onContrastChange={setContrast}
                announceContent={announceContent}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}