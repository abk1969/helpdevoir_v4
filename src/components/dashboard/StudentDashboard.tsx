import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../store/studentStore';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { useHomeworkStore } from '../../store/homeworkStore';
import AccessibilityPathwayCard from './AccessibilityPathwayCard';
import SubjectList from '../subjects/SubjectList';
import TouchFeedback from '../common/TouchFeedback';
import PageContainer from '../common/PageContainer';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { getStudentById } = useStudentStore();
  const { isDyslexiaMode } = useAccessibilityStore();
  const { getHomeworksBySubject } = useHomeworkStore();
  
  const student = studentId ? getStudentById(studentId) : null;

  // Calculer le nombre total de devoirs en cours
  const getTotalPendingHomeworks = () => {
    if (!student) return 0;
    return student.subjects.reduce((total, subject) => {
      const homeworks = getHomeworksBySubject(studentId, subject.id);
      return total + homeworks.filter(hw => !hw.completed).length;
    }, 0);
  };

  if (!student) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Étudiant non trouvé</h2>
        <TouchFeedback onClick={() => navigate('/dashboard')}>
          <div className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour au tableau de bord
          </div>
        </TouchFeedback>
      </div>
    );
  }

  return (
    <PageContainer
      title={`Tableau de bord de ${student.firstName}`}
      showBack
      onBack={() => navigate('/students')}
    >
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* En-tête */}
        <header className="text-center">
          <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${
            isDyslexiaMode ? 'font-dyslexic' : ''
          }`}>
            {student.firstName}
          </h1>
          <div className="text-gray-600">
            <span>{student.gradeLevel}</span>
            <span className="mx-2">•</span>
            <span>{student.age} ans</span>
            {getTotalPendingHomeworks() > 0 && (
              <>
                <span className="mx-2">•</span>
                <span className="text-indigo-600 font-medium">
                  {getTotalPendingHomeworks()} devoir{getTotalPendingHomeworks() > 1 ? 's' : ''} en cours
                </span>
              </>
            )}
          </div>
        </header>

        {/* Parcours adaptés */}
        {(student.hasDyslexia || student.hearingImpaired || student.visuallyImpaired) && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {student.hasDyslexia && (
              <AccessibilityPathwayCard
                type="dyslexia"
                studentId={studentId}
                isEnabled={student.hasDyslexia}
              />
            )}
            {student.hearingImpaired && (
              <AccessibilityPathwayCard
                type="hearing"
                studentId={studentId}
                isEnabled={student.hearingImpaired}
              />
            )}
            {student.visuallyImpaired && (
              <AccessibilityPathwayCard
                type="visual"
                studentId={studentId}
                isEnabled={student.visuallyImpaired}
              />
            )}
          </section>
        )}

        {/* Liste des matières */}
        <section>
          <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${
            isDyslexiaMode ? 'font-dyslexic' : ''
          }`}>
            Matières
          </h2>
          <SubjectList 
            studentId={studentId}
            gradeLevel={student.gradeLevel}
          />
        </section>
      </motion.div>
    </PageContainer>
  );
}