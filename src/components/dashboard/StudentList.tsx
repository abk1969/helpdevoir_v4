import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../../types';
import { GraduationCap, ChevronRight, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import TouchFeedback from '../common/TouchFeedback';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import { useStudentStore } from '../../store/studentStore';
import toast from 'react-hot-toast';

interface StudentListProps {
  students: Student[];
}

export default function StudentList({ students }: StudentListProps) {
  const navigate = useNavigate();
  const { deleteStudent } = useStudentStore();
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const handleDelete = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    setStudentToDelete(student);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      toast.success('Étudiant supprimé avec succès');
      setStudentToDelete(null);
    }
  };

  if (students.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun étudiant</h3>
        <p className="text-gray-500 mb-6">Commencez par ajouter un étudiant pour gérer ses devoirs.</p>
        <TouchFeedback onClick={() => navigate('/students/add')}>
          <div className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg">
            Ajouter un étudiant
          </div>
        </TouchFeedback>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 px-4 md:px-0">
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4 flex items-center justify-between">
              <TouchFeedback onClick={() => navigate(`/students/${student.id}`)}>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{student.firstName}</h3>
                    <p className="text-sm text-gray-500">
                      {student.gradeLevel} • {student.age} ans
                    </p>
                  </div>
                </div>
              </TouchFeedback>

              <div className="flex items-center space-x-4">
                <TouchFeedback onClick={(e) => handleDelete(e, student)}>
                  <div className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </div>
                </TouchFeedback>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <DeleteConfirmationModal
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer l'étudiant"
        message={`Êtes-vous sûr de vouloir supprimer ${studentToDelete?.firstName} ? Cette action est irréversible et supprimera également tous les devoirs associés.`}
        itemType="l'étudiant"
      />
    </>
  );
}