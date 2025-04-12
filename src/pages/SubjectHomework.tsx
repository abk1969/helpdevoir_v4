import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentStore } from '../store/studentStore';
import { useSubjectStore } from '../store/subjectStore';
import { useHomeworkStore } from '../store/homeworkStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowLeft } from 'lucide-react';
import HomeworkForm from '../components/homework/HomeworkForm';
import DyslexiaHomeworkForm from '../components/homework/DyslexiaHomeworkForm';
import HearingImpairedHomeworkForm from '../components/homework/HearingImpairedHomeworkForm';
import VisualImpairedHomeworkForm from '../components/homework/VisualImpairedHomeworkForm';
import HomeworkList from '../components/homework/HomeworkList';
import TouchFeedback from '../components/common/TouchFeedback';
import PageContainer from '../components/common/PageContainer';
import toast from 'react-hot-toast';

export default function SubjectHomework() {
  const { studentId, subjectId } = useParams();
  const navigate = useNavigate();
  const [isAddingHomework, setIsAddingHomework] = useState(false);

  const { getStudentById } = useStudentStore();
  const { getSubjectById } = useSubjectStore();
  const { getHomeworksBySubject, addHomework } = useHomeworkStore();

  if (!studentId || !subjectId) {
    return <div>Paramètres manquants</div>;
  }

  const student = getStudentById(studentId);
  const subject = getSubjectById(subjectId);
  const homeworks = getHomeworksBySubject(studentId, subjectId);

  if (!student || !subject) {
    return <div>Étudiant ou matière non trouvé</div>;
  }

  const getHomeworkForm = () => {
    if (student.hasDyslexia) {
      return DyslexiaHomeworkForm;
    }
    if (student.hearingImpaired) {
      return HearingImpairedHomeworkForm;
    }
    if (student.visuallyImpaired) {
      return VisualImpairedHomeworkForm;
    }
    return HomeworkForm;
  };

  const HomeworkFormComponent = getHomeworkForm();

  const handleHomeworkSubmit = async (data: any) => {
    try {
      await addHomework({
        ...data,
        studentId,
        subjectId
      });
      setIsAddingHomework(false);
      toast.success('Devoir créé avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la création du devoir');
    }
  };

  return (
    <PageContainer
      title={`${subject.name} - ${student.firstName}`}
      showBack
      onBack={() => navigate(`/students/${studentId}`)}
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Devoirs</h1>
            <p className="text-gray-600">
              Gérez les devoirs de {student.firstName} en {subject.name}
            </p>
          </div>

          {!isAddingHomework && (
            <TouchFeedback onClick={() => setIsAddingHomework(true)}>
              <div className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg">
                <Plus className="h-5 w-5 mr-2" />
                Ajouter un devoir
              </div>
            </TouchFeedback>
          )}
        </div>

        {/* Formulaire d'ajout */}
        <AnimatePresence>
          {isAddingHomework && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HomeworkFormComponent
                studentId={studentId}
                subjectId={subjectId}
                onSubmit={handleHomeworkSubmit}
                onCancel={() => setIsAddingHomework(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des devoirs */}
        {!isAddingHomework && (
          <HomeworkList
            homeworks={homeworks}
            student={student}
            subject={subject}
          />
        )}
      </div>
    </PageContainer>
  );
}