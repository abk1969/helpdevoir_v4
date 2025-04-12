import React from 'react';
import { useStudentStore } from '../store/studentStore';
import { PlusCircle, GraduationCap, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TouchFeedback from '../components/common/TouchFeedback';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { getStudents, deleteStudent } = useStudentStore();
  const students = getStudents();
  const [studentToDelete, setStudentToDelete] = React.useState<string | null>(null);

  const handleDeleteStudent = (e: React.MouseEvent, studentId: string) => {
    e.stopPropagation();
    setStudentToDelete(studentId);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteStudent(studentToDelete);
        toast.success('Étudiant supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
      setStudentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Gérez les devoirs et le suivi scolaire</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/students/add"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-center space-x-4">
            <PlusCircle className="h-8 w-8 text-indigo-600" />
            <span className="text-lg font-medium text-gray-900">Ajouter un étudiant</span>
          </div>
        </Link>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Étudiants inscrits</h3>
                <p className="text-3xl font-bold text-indigo-600">{students.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Étudiants récents</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {students.map((student) => (
                <motion.li 
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <TouchFeedback onClick={() => navigate(`/students/${student.id}`)}>
                      <div className="flex items-center flex-1">
                        <div className="flex-shrink-0">
                          <GraduationCap className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">{student.firstName}</h3>
                          <p className="text-sm text-gray-500">{student.gradeLevel}</p>
                        </div>
                        <div className="ml-auto text-sm text-gray-500">{student.age} ans</div>
                      </div>
                    </TouchFeedback>
                    <TouchFeedback 
                      onClick={(e) => handleDeleteStudent(e, student.id)}
                      className="ml-4"
                    >
                      <div className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </div>
                    </TouchFeedback>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer l'étudiant"
        message="Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible."
        itemType="l'étudiant"
      />
    </div>
  );
}