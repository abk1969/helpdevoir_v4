import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

interface AILoadingStateProps {
  message?: string;
  showSparkles?: boolean;
}

export default function AILoadingState({ 
  message = "L'assistant réfléchit...",
  showSparkles = true 
}: AILoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <Brain className="h-12 w-12 text-indigo-600" />
        {showSparkles && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="h-4 w-4 text-yellow-400" />
          </motion.div>
        )}
      </motion.div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}