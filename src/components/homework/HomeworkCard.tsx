import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Brain } from 'lucide-react';
import { Homework } from '../../types';
import TouchFeedback from '../common/TouchFeedback';
import AIHomeworkSolver from './AIHomeworkSolver';

interface HomeworkCardProps {
  homework: Homework;
  onToggleComplete: () => void;
}

export default function HomeworkCard({ homework, onToggleComplete }: HomeworkCardProps) {
  const [showAIHelper, setShowAIHelper] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">{homework.title}</h3>
            <TouchFeedback onClick={() => setShowAIHelper(true)}>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                <Brain className="h-5 w-5" />
              </div>
            </TouchFeedback>
          </div>

          <p className="text-gray-600 mb-4">{homework.description}</p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(homework.dueDate).toLocaleDateString()}</span>
            </div>
            {homework.estimatedTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{homework.estimatedTime} min</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showAIHelper && (
        <AIHomeworkSolver
          homework={homework}
          onClose={() => setShowAIHelper(false)}
        />
      )}
    </>
  );
}