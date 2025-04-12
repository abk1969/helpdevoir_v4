import React from 'react';
import type { Student } from '../types';

interface StudentCardProps extends Student {}

export default function StudentCard({ name, grade, subjects }: StudentCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
      <p className="text-indigo-600 font-semibold mb-4">{grade}</p>
      <div className="grid grid-cols-2 gap-3">
        {subjects.map((subject, index) => {
          const Icon = subject.icon;
          return (
            <button
              key={index}
              className={`${subject.color} p-4 rounded-lg flex items-center gap-3 text-white hover:opacity-90 transition-opacity`}
            >
              <Icon size={24} />
              <span className="font-medium">{subject.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
