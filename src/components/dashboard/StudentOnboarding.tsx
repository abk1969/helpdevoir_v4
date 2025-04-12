import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Student } from '../../types';
import { Book, Brain, Ear, Eye, ArrowRight } from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';

interface StudentOnboardingProps {
  student: Student;
}

export default function StudentOnboarding({ student }: StudentOnboardingProps) {
  const navigate = useNavigate();

  const pathways = [
    {
      id: 'subjects',
      title: 'Matières',
      description: 'Commencer avec les matières standard',
      icon: Book,
      color: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      path: `/students/${student.id}`
    },
    ...(student.hasDyslexia ? [{
      id: 'dyslexia',
      title: 'Parcours Dyslexie',
      description: 'Exercices adaptés pour la dyslexie',
      icon: Brain,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      path: `/students/${student.id}/dyslexia`
    }] : []),
    ...(student.hearingImpaired ? [{
      id: 'hearing',
      title: 'Parcours Malentendant',
      description: 'Support visuel et langue des signes',
      icon: Ear,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      path: `/students/${student.id}/hearing`
    }] : []),
    ...(student.visuallyImpaired ? [{
      id: 'visual',
      title: 'Parcours Malvoyant',
      description: 'Navigation audio et contraste adapté',
      icon: Eye,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      path: `/students/${student.id}/visual`
    }] : [])
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Bienvenue, {student.firstName} !
        </h1>
        <p className="text-xl text-gray-600">
          Choisissez votre parcours pour commencer
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pathways.map((pathway, index) => {
          const Icon = pathway.icon;
          return (
            <TouchFeedback
              key={pathway.id}
              onClick={() => navigate(pathway.path)}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.1 }
                }}
                className={`${pathway.color} p-6 rounded-xl shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className={`h-8 w-8 ${pathway.iconColor}`} />
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold">{pathway.title}</h3>
                      <p className="text-gray-600">{pathway.description}</p>
                    </div>
                  </div>
                  <ArrowRight className={`h-6 w-6 ${pathway.iconColor}`} />
                </div>
              </motion.div>
            </TouchFeedback>
          );
        })}
      </div>
    </div>
  );
}