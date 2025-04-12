import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student, Subject, Homework } from '../../types';
import DyslexiaHomeworkCard from './DyslexiaHomeworkCard';
import HearingImpairedHomeworkView from './HearingImpairedHomeworkView';
import VisualImpairedHomeworkView from './VisualImpairedHomeworkView';
import { useHomeworkStore } from '../../store/homeworkStore';
import { Book } from 'lucide-react';

interface HomeworkListProps {
  homeworks: Homework[];
  student: Student;
  subject: Subject;
}

export default function HomeworkList({ homeworks, student, subject }: HomeworkListProps) {
  const { toggleHomework } = useHomeworkStore();

  const getHomeworkComponent = (homework: Homework) => {
    if (student.hasDyslexia) {
      return (
        <DyslexiaHomeworkCard
          homework={homework}
          onToggleComplete={() => toggleHomework(homework.id)}
        />
      );
    }
    if (student.hearingImpaired) {
      return (
        <HearingImpairedHomeworkView
          homework={homework}
          onToggleComplete={() => toggleHomework(homework.id)}
        />
      );
    }
    if (student.visuallyImpaired) {
      return (
        <VisualImpairedHomeworkView
          homework={homework}
          onToggleComplete={() => toggleHomework(homework.id)}
        />
      );
    }
    return null;
  };

  if (homeworks.length === 0) {
    return (
      <div className="text-center py-12">
        <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun devoir</h3>
        <p className="text-gray-500">
          Commencez par ajouter un devoir pour {student.firstName}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {homeworks.map((homework) => (
          <motion.div
            key={homework.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {getHomeworkComponent(homework)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}