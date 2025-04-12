import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Subject } from '../../types';
import TouchFeedback from '../common/TouchFeedback';
import { useHomeworkStore } from '../../store/homeworkStore';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { iconMap } from '../../data/subjects';
import { Settings } from 'lucide-react';

interface SubjectListProps {
  studentId: string;
  subjects: Subject[];
}

export default function SubjectList({ studentId, subjects }: SubjectListProps) {
  const { getHomeworksBySubject } = useHomeworkStore();
  const { isDyslexiaMode } = useAccessibilityStore();

  const getHomeworkCount = (subjectId: string) => {
    const homeworks = getHomeworksBySubject(studentId, subjectId);
    return homeworks.filter(hw => !hw.completed).length;
  };

  if (!subjects?.length) {
    return (
      <div className="text-center py-12">
        <h3 className={`text-lg font-medium text-gray-900 mb-2 ${
          isDyslexiaMode ? 'font-dyslexic' : ''
        }`}>
          Aucune matière disponible
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {subjects.map((subject, index) => {
          const Icon = iconMap[subject.icon] || iconMap.Book;
          const homeworkCount = getHomeworkCount(subject.id);
          
          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.2
              }}
            >
              <TouchFeedback>
                <Link
                  to={`/students/${studentId}/subjects/${subject.id}`}
                  className={`block p-6 rounded-xl shadow-sm hover:shadow-md transition-all ${
                    subject.color
                  } text-white ${
                    !subject.isActive ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Icon className="h-8 w-8" />
                      <div>
                        <h3 className={`text-lg font-medium ${
                          isDyslexiaMode ? 'font-dyslexic' : ''
                        }`}>
                          {subject.name}
                        </h3>
                        {subject.description && (
                          <p className="text-sm opacity-90">{subject.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                      <Settings className="h-5 w-5" />
                    </div>
                  </div>

                  {homeworkCount > 0 && (
                    <div className="mt-2 flex items-center justify-between">
                      <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        {homeworkCount} devoir{homeworkCount > 1 ? 's' : ''} en cours
                      </div>
                    </div>
                  )}
                </Link>
              </TouchFeedback>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}