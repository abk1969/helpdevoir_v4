import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Play, Square, Volume2, Settings } from 'lucide-react';

interface VoiceNavigationProps {
  fontSize: number;
  announceContent: (text: string) => void;
}

export default function VoiceNavigation({
  fontSize,
  announceContent
}: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commands, setCommands] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);

  const availableCommands = [
    { command: 'aller à l\'accueil', action: 'Navigation vers la page d\'accueil' },
    { command: 'ouvrir les paramètres', action: 'Ouverture des paramètres' },
    { command: 'augmenter la taille', action: 'Augmentation de la taille du texte' },
    { command: 'diminuer la taille', action: 'Diminution de la taille du texte' },
    { command: 'activer le lecteur', action: 'Activation du lecteur d\'écran' },
    { command: 'désactiver le lecteur', action: 'Désactivation du lecteur d\'écran' }
  ];

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        announceContent('Écoute des commandes vocales activée');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        announceContent('Écoute des commandes vocales désactivée');
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setTranscript(transcript);

        // Vérification des commandes
        availableCommands.forEach(({ command, action }) => {
          if (transcript.toLowerCase().includes(command)) {
            setCommands(prev => [...prev, `${command} → ${action}`]);
            announceContent(action);
          }
        });
      };

      recognitionRef.current.start();
    } else {
      announceContent('La reconnaissance vocale n\'est pas supportée par votre navigateur');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Navigation Vocale</h2>

        {/* Contrôles principaux */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center px-6 py-3 rounded-lg ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white`}
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5 mr-2" />
                Arrêter l'écoute
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" />
                Commencer l'écoute
              </>
            )}
          </button>
        </div>

        {/* Zone de transcription */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Transcription en direct</h3>
          <div 
            className="min-h-[100px] p-4 bg-gray-50 rounded-lg"
            style={{ fontSize: `${fontSize}px` }}
          >
            {transcript || 'Parlez pour voir la transcription...'}
          </div>
        </div>

        {/* Commandes détectées */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Commandes détectées</h3>
          <div className="space-y-2">
            {commands.map((command, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-green-50 text-green-700 rounded-lg"
              >
                {command}
              </motion.div>
            ))}
            {commands.length === 0 && (
              <p className="text-gray-500">Aucune commande détectée</p>
            )}
          </div>
        </div>

        {/* Liste des commandes disponibles */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Commandes disponibles</h3>
          <div className="grid grid-cols-2 gap-4">
            {availableCommands.map(({ command, action }) => (
              <div 
                key={command}
                className="p-3 bg-white rounded-lg"
              >
                <p className="font-medium">{command}</p>
                <p className="text-sm text-gray-600">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}