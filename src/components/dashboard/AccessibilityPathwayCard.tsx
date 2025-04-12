import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Ear, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AccessibilityPathwayCardProps {
  type: 'dyslexia' | 'hearing' | 'visual';
  studentId: string;
  isEnabled: boolean;
}

const pathwayConfig = {
  dyslexia: {
    title: 'Parcours Dyslexie',
    description: 'Exercices adaptés pour les élèves dyslexiques',
    icon: Brain,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
    path: '/dyslexia'
  },
  hearing: {
    title: 'Parcours Malentendants',
    description: 'Support visuel et langue des signes',
    icon: Ear,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
    path: '/hearing'
  },
  visual: {
    title: 'Parcours Malvoyants',
    description: 'Navigation audio et contraste adapté',
    icon: Eye,
    color: 'bg-green-100',
    iconColor: 'text-green-600',
    path: '/visual'
  }
};

export default function AccessibilityPathwayCard({
  type,
  studentId,
  isEnabled
}: AccessibilityPathwayCardProps) {
  if (!isEnabled) return null;

  const config = pathwayConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`${config.color} rounded-xl p-6 shadow-sm hover:shadow-md transition-all mx-4 md:mx-0`}
    >
      <div className="flex items-center mb-4">
        <Icon className={`h-8 w-8 ${config.iconColor}`} />
        <h3 className="ml-3 text-xl font-semibold">{config.title}</h3>
      </div>
      <p className="text-gray-600 mb-6">{config.description}</p>
      <Link
        to={`/students/${studentId}${config.path}`}
        className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-gray-900 hover:bg-gray-50 transition-colors touch-button"
      >
        Accéder au parcours
      </Link>
    </motion.div>
  );
}