import React from 'react';
import { useStudentStore } from '../store/studentStore';
import { Link } from 'react-router-dom';
import { PlusCircle, GraduationCap } from 'lucide-react';
import StudentList from '../components/dashboard/StudentList';

export default function StudentsPage() {
  const students = useStudentStore((state) => state.getStudents());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des étudiants</h1>
        <Link
          to="/students/add"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Ajouter un étudiant
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun étudiant</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter un étudiant pour gérer ses devoirs.
          </p>
        </div>
      ) : (
        <StudentList students={students} />
      )}
    </div>
  );
}