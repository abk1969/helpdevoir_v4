import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight } from 'lucide-react';
import TouchFeedback from '../../common/TouchFeedback';

interface DyslexiaExerciseCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  progress?: number;
}

export default function DyslexiaExerciseCard({
  title,
  description,
  icon,
  color,
  onClick,
  progress
}: DyslexiaExerciseCardProps) {
  return (
    <TouchFeedback onClick={onClick}>
      <motion.div
        className={`${color} p-6 rounded-xl shadow-sm hover:shadow-md transition-all`}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon}
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
          <ArrowRight className="h-6 w-6 text-white opacity-75" />
        </div>
        
        <p className="text-white/90 mb-4">{description}</p>
        
        {progress !== undefined && (
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-white/75 mt-2">
              Progression : {progress}%
            </p>
          </div>
        )}
      </motion.div>
    </TouchFeedback>
  );
}