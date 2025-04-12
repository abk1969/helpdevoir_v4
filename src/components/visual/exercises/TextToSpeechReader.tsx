import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  Mic
} from 'lucide-react';
import { motion } from 'framer-motion';
import TouchFeedback from '../../common/TouchFeedback';

interface TextToSpeechReaderProps {
  fontSize: number;
  announceContent: (text: string) => void;
}

export default function TextToSpeechReader({
  fontSize,
  announceContent
}: TextToSpeechReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const sampleText = `
    Bienvenue dans le lecteur audio adapté.
    Ce texte sera lu avec les paramètres que vous avez choisis.
    Vous pouvez ajuster la vitesse et le volume selon vos préférences.
    Utilisez les commandes de lecture pour naviguer dans le contenu.
  `;

  const startReading = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    utteranceRef.current = new SpeechSynthesisUtterance(sampleText);
    utteranceRef.current.lang = 'fr-FR';
    utteranceRef.current.rate = currentSpeed;
    utteranceRef.current.volume = isMuted ? 0 : volume;

    utteranceRef.current.onend = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utteranceRef.current);
    setIsPlaying(true);
  };

  const pauseReading = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
  };

  const resumeReading = () => {
    window.speechSynthesis.resume();
    setIsPlaying(true);
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? volume : 0;
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = true;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        announceContent(transcript);
      };

      recognition.start();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Lecteur Audio</h2>

        <div className="space-y-6">
          {/* Contrôles principaux */}
          <div className="flex justify-center items-center space-x-4">
            <TouchFeedback onClick={stopReading}>
              <div className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
                <SkipBack className="h-6 w-6" />
              </div>
            </TouchFeedback>

            <TouchFeedback onClick={isPlaying ? pauseReading : startReading}>
              <div className="p-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-700">
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </div>
            </TouchFeedback>

            <TouchFeedback onClick={stopReading}>
              <div className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
                <SkipForward className="h-6 w-6" />
              </div>
            </TouchFeedback>
          </div>

          {/* Contrôles de vitesse et volume */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vitesse de lecture
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={currentSpeed}
                onChange={(e) => setCurrentSpeed(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0.5x</span>
                <span>{currentSpeed}x</span>
                <span>2x</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume
              </label>
              <div className="flex items-center space-x-2">
                <TouchFeedback onClick={toggleMute}>
                  <div className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </div>
                </TouchFeedback>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de texte */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Texte à lire</h3>
          <div className="flex space-x-2">
            <TouchFeedback onClick={startVoiceRecognition}>
              <div className={`p-2 rounded-lg ${
                isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <Mic className="h-5 w-5" />
              </div>
            </TouchFeedback>
            <TouchFeedback onClick={() => {}}>
              <div className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                <Settings className="h-5 w-5" />
              </div>
            </TouchFeedback>
          </div>
        </div>
        <div 
          className="prose max-w-none"
          style={{ fontSize: `${fontSize}px` }}
        >
          <p>{sampleText}</p>
        </div>
      </div>
    </div>
  );
}