import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentStore } from '../store/studentStore';
import { useAccessibilityStore } from '../store/accessibilityStore';
import AccessibilityPathwayCard from '../components/dashboard/AccessibilityPathwayCard';
import SubjectList from '../components/dashboard/SubjectList';
import TouchFeedback from '../components/common/TouchFeedback';
import PageContainer from '../components/common/PageContainer';

export default function StudentDashboard() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { getStudentById } = useStudentStore();
  const { isDyslexiaMode } = useAccessibilityStore();
  
  const student = studentId ? getStudentById(studentId) : null;

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Étudiant non trouvé</h2>
        <TouchFeedback onClick={() => navigate('/dashboard')}>
          <div className="mt-4 text-indigo-600 hover:text-indigo-800">
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
      <div className="space-y-8">
        <header className="text-center">
          <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${
            isDyslexiaMode ? 'font-dyslexic' : ''
          }`}>
            {student.firstName}
          </h1>
          <p className="text-gray-600">
            {student.gradeLevel} • {student.age} ans
          </p>
        </header>

        {/* Parcours adaptés */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AccessibilityPathwayCard
            type="dyslexia"
            studentId={studentId!}
            isEnabled={student.hasDyslexia}
          />
          <AccessibilityPathwayCard
            type="hearing"
            studentId={studentId!}
            isEnabled={student.hearingImpaired}
          />
          <AccessibilityPathwayCard
            type="visual"
            studentId={studentId!}
            isEnabled={student.visuallyImpaired}
          />
        </section>

        {/* Liste des matières */}
        <section>
          <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${
            isDyslexiaMode ? 'font-dyslexic' : ''
          }`}>
            Matières
          </h2>
          <SubjectList studentId={studentId!} subjects={student.subjects} />
        </section>
      </div>
    </PageContainer>
  );
}