import React from 'react';
import { useStudentStore } from '../../store/studentStore';
import { PlusCircle, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const students = useStudentStore((state) => state.getStudents());
  const navigate = useNavigate();

  return (
    <div className="space-y-6 px-4 md:px-0">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Gérez les devoirs et le suivi scolaire</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all touch-button"
        >
          <Link
            to="/students/add"
            className="flex items-center justify-center space-x-4"
          >
            <PlusCircle className="h-8 w-8 text-indigo-600" />
            <span className="text-lg font-medium text-gray-900">Ajouter un étudiant</span>
          </Link>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-white p-6 rounded-xl shadow-sm touch-button"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Étudiants inscrits</h3>
                <p className="text-3xl font-bold text-indigo-600">{students.length}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {students.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Étudiants récents</h2>
          <div className="space-y-4">
            {students.map((student) => (
              <motion.div
                key={student.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/students/${student.id}`)}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all touch-button"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{student.firstName}</h3>
                      <p className="text-sm text-gray-500">{student.gradeLevel} • {student.age} ans</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}