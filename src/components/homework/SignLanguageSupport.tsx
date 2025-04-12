import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Volume2, Play, Pause } from 'lucide-react';

interface SignLanguageProps {
  content: string;
}

export default function SignLanguageSupport({ content }: SignLanguageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Simulation d'une vidéo LSF
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Support LSF</h3>
        <button
          onClick={togglePlay}
          className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
        >
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Voir en LSF
            </>
          )}
        </button>
      </div>

      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <MessageSquare className="h-12 w-12 text-gray-400" />
          <span className="ml-2 text-gray-500">Vidéo LSF simulée</span>
        </motion.div>
      )}
    </div>
  );
}