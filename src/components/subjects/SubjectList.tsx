import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Subject } from '../../types';
import TouchFeedback from '../common/TouchFeedback';
import { useHomeworkStore } from '../../store/homeworkStore';
import { useStudentStore } from '../../store/studentStore';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { Settings, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface SubjectListProps {
  studentId: string;
  gradeLevel: string;
}

export default function SubjectList({ studentId, gradeLevel }: SubjectListProps) {
  const { getHomeworksBySubject } = useHomeworkStore();
  const { getStudentById, toggleSubjectActive } = useStudentStore();
  const { isDyslexiaMode } = useAccessibilityStore();

  const student = getStudentById(studentId);
  const subjects = student?.subjects || [];

  const getHomeworkCount = (subjectId: string) => {
    const homeworks = getHomeworksBySubject(studentId, subjectId);
    return homeworks.filter(hw => !hw.completed).length;
  };

  const handleToggleSubject = (e: React.MouseEvent, subject: Subject) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSubjectActive(studentId, subject.id);
    toast.success(
      `${subject.name} ${subject.isActive ? 'désactivée' : 'activée'}`,
      { id: `toggle-${subject.id}` } // Évite les toasts en double
    );
  };

  if (!student) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <div className="flex items-center text-yellow-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Étudiant non trouvé</p>
        </div>
      </div>
    );
  }

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
          const homeworkCount = getHomeworkCount(subject.id);
          const Icon = subject.icon;
          
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
              className={`${!subject.isActive ? 'opacity-60 hover:opacity-80' : ''} transition-opacity`}
            >
              <div className={`relative rounded-xl shadow-sm hover:shadow-md transition-all ${subject.color} group`}>
                <Link
                  to={subject.isActive ? `/students/${studentId}/subjects/${subject.id}` : '#'}
                  className={`block p-6 text-white ${!subject.isActive ? 'cursor-not-allowed' : ''}`}
                  onClick={(e) => !subject.isActive && e.preventDefault()}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-medium ${
                          isDyslexiaMode ? 'font-dyslexic' : ''
                        }`}>
                          {subject.name}
                        </h3>
                        {subject.description && (
                          <p className="text-sm text-white/80">{subject.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {homeworkCount > 0 && subject.isActive && (
                    <div className="mt-4">
                      <div className="inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-sm">
                        {homeworkCount} devoir{homeworkCount > 1 ? 's' : ''} en cours
                      </div>
                    </div>
                  )}

                  {!subject.isActive && (
                    <div className="mt-4">
                      <div className="inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-sm">
                        Matière désactivée
                      </div>
                    </div>
                  )}
                </Link>

                <TouchFeedback 
                  onClick={(e) => handleToggleSubject(e, subject)}
                  className="absolute top-4 right-4"
                >
                  <div 
                    className={`p-2 rounded-full transition-colors ${
                      subject.isActive 
                        ? 'bg-white/20 hover:bg-white/30' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    role="button"
                    aria-label={`${subject.isActive ? 'Désactiver' : 'Activer'} ${subject.name}`}
                    title={`${subject.isActive ? 'Désactiver' : 'Activer'} la matière`}
                  >
                    <Settings className="h-5 w-5" />
                  </div>
                </TouchFeedback>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}