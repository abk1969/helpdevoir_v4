import React, { useState, useEffect } from 'react';
import { Volume2, Mic } from 'lucide-react';

interface DyslexiaFriendlyEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function DyslexiaFriendlyEditor({
  initialValue = '',
  onChange,
  placeholder = 'Commencez à écrire ou utilisez la saisie vocale...',
  readOnly = false
}: DyslexiaFriendlyEditorProps) {
  const [content, setContent] = useState(initialValue);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange?.(newValue);
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setContent(transcript);
        onChange?.(transcript);
      };

      recognition.start();
    }
  };

  const readContent = () => {
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className="w-full min-h-[150px] p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 font-dyslexic text-lg"
          style={{ lineHeight: '1.8' }}
        />
        {!readOnly && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={startVoiceRecognition}
              className={`p-2 rounded-full ${
                isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Saisie vocale"
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={readContent}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              title="Lire le contenu"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}