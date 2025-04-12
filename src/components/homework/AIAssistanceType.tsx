import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb,
  Image as ImageIcon,
  Calculator,
  BookOpen,
  Microscope
} from 'lucide-react';
import { AIAssistanceType } from '../../utils/ai';
import TouchFeedback from '../common/TouchFeedback';

interface AIAssistanceTypeProps {
  selectedType: AIAssistanceType;
  onTypeSelect: (type: AIAssistanceType) => void;
}

const assistanceTypes = [
  {
    type: AIAssistanceType.HOMEWORK_HELP,
    icon: Lightbulb,
    title: 'Aide générale',
    description: 'Assistance et conseils pour le devoir'
  },
  {
    type: AIAssistanceType.IMAGE_ANALYSIS,
    icon: ImageIcon,
    title: 'Analyse d\'image',
    description: 'Comprendre un document ou un schéma'
  },
  {
    type: AIAssistanceType.MATH_PROBLEM,
    icon: Calculator,
    title: 'Problème de maths',
    description: 'Résolution pas à pas'
  },
  {
    type: AIAssistanceType.LANGUAGE_CORRECTION,
    icon: BookOpen,
    title: 'Correction linguistique',
    description: 'Amélioration de l\'expression écrite'
  },
  {
    type: AIAssistanceType.SCIENCE_EXPLANATION,
    icon: Microscope,
    title: 'Explication scientifique',
    description: 'Comprendre les concepts scientifiques'
  }
];

export default function AIAssistanceType({
  selectedType,
  onTypeSelect
}: AIAssistanceTypeProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assistanceTypes.map(({ type, icon: Icon, title, description }) => (
        <TouchFeedback key={type} onClick={() => onTypeSelect(type)}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedType === type
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`mt-1 ${
                selectedType === type ? 'text-indigo-600' : 'text-gray-500'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
          </motion.div>
        </TouchFeedback>
      ))}
    </div>
  );
}