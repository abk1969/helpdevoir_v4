import React from 'react';
import type { Student } from '../types';
import { Link } from 'react-router-dom';

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
}

export default function StudentCard({ student, onClick }: StudentCardProps) {
  // Filtrer les matières actives
  const activeSubjects = student.subjects.filter(subject => subject.isActive !== false);

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{student.firstName}</h3>
      <div className="flex justify-between items-center mb-4">
        <p className="text-indigo-600 font-semibold">{student.gradeLevel}</p>
        <p className="text-gray-500 text-sm">{student.age} ans</p>
      </div>

      {activeSubjects.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {activeSubjects.slice(0, 4).map((subject, index) => {
            const Icon = subject.icon;
            return (
              <div
                key={subject.id}
                className={`${subject.color} p-3 rounded-lg flex items-center gap-2 text-white hover:opacity-90 transition-opacity`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm truncate">{subject.name}</span>
              </div>
            );
          })}
          {activeSubjects.length > 4 && (
            <div className="text-center text-gray-500 text-sm mt-2">
              +{activeSubjects.length - 4} autres matières
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Aucune matière active</p>
      )}

      {student.hasDyslexia || student.hearingImpaired || student.visuallyImpaired ? (
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
          {student.hasDyslexia && (
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Dyslexie</span>
          )}
          {student.hearingImpaired && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Malentendant</span>
          )}
          {student.visuallyImpaired && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Malvoyant</span>
          )}
        </div>
      ) : null}
    </div>
  );
}