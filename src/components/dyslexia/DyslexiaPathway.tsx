import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { Brain, BookOpen, Sparkles, Mic, Play, Award, BarChart2, Lightbulb, ArrowLeft } from 'lucide-react';
import PhonemeTraining from './exercises/PhonemeTraining';
import VisualTracking from './exercises/VisualTracking';
import SyllableBuilder from './exercises/SyllableBuilder';
import { useStudentStore } from '../../store/studentStore';

const exerciseModules = [
  {
    id: 'phonological',
    title: 'Conscience Phonologique',
    icon: Mic,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
    description: 'Exercices de reconnaissance et manipulation des sons',
    component: PhonemeTraining
  },
  {
    id: 'visual',
    title: 'Traitement Visuel',
    icon: BookOpen,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
    description: 'Amélioration de la perception visuelle et du suivi de ligne',
    component: VisualTracking
  },
  {
    id: 'syllables',
    title: 'Construction de Syllabes',
    icon: Brain,
    color: 'bg-green-100',
    iconColor: 'text-green-600',
    description: 'Apprentissage des syllabes et construction de mots',
    component: SyllableBuilder
  }
];

export default function DyslexiaPathway() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const { isDyslexiaMode } = useAccessibilityStore();
  const getStudents = useStudentStore((state) => state.getStudents);
  const student = getStudents().find(s => s.id === studentId);

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Étudiant non trouvé</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  const SelectedExercise = selectedModule 
    ? exerciseModules.find(m => m.id === selectedModule)?.component 
    : null;

  return (
    <div className={`min-h-screen ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => selectedModule ? setSelectedModule(null) : navigate(`/students/${studentId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {selectedModule ? 'Retour aux exercices' : 'Retour au profil'}
        </button>

        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Parcours Dyslexie - {student.firstName}
          </h1>
          <p className="text-gray-600">
            Exercices personnalisés pour améliorer la lecture et l'écriture
          </p>
        </header>

        {selectedModule && SelectedExercise ? (
          <SelectedExercise />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exerciseModules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module.id)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow text-left"
                >
                  <div className={`${module.color} p-6`}>
                    <div className="flex items-center mb-4">
                      <Icon className={`h-8 w-8 ${module.iconColor}`} />
                      <h3 className="ml-3 text-xl font-semibold">{module.title}</h3>
                    </div>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}