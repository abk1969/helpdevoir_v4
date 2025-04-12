```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain,
  Image as ImageIcon,
  Calculator,
  BookOpen,
  Microscope,
  MessageSquare,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { AIAssistanceType } from '../../utils/ai';
import TouchFeedback from '../common/TouchFeedback';

interface AIAssistanceSelectorProps {
  onSelect: (type: AIAssistanceType) => void;
  selectedType: AIAssistanceType | null;
}

const assistanceTypes = [
  {
    type: AIAssistanceType.HOMEWORK_HELP,
    icon: Brain,
    title: 'Aide générale',
    description: 'Assistance et conseils pour le devoir',
    color: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  {
    type: AIAssistanceType.IMAGE_ANALYSIS,
    icon: ImageIcon,
    title: 'Analyse d\'image',
    description: 'Comprendre un document ou un schéma',
    color: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    type: AIAssistanceType.MATH_PROBLEM,
    icon: Calculator,
    title: 'Problème de maths',
    description: 'Résolution pas à pas',
    color: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    type: AIAssistanceType.LANGUAGE_CORRECTION,
    icon: BookOpen,
    title: 'Correction linguistique',
    description: 'Amélioration de l\'expression écrite',
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    type: AIAssistanceType.SCIENCE_EXPLANATION,
    icon: Microscope,
    title: 'Explication scientifique',
    description: 'Comprendre les concepts scientifiques',
    color: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
];

export default function AIAssistanceSelector({
  onSelect,
  selectedType
}: AIAssistanceSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
          <Sparkles className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Comment puis-je t'aider ?
        </h2>
        <p className="text-gray-600">
          Choisis le type d'assistance dont tu as besoin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assistanceTypes.map(({ type, icon: Icon, title, description, color, iconColor }) => (
          <TouchFeedback key={type} onClick={() => onSelect(type)}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl ${color} ${
                selectedType === type ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg bg-white/50 ${iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </motion.div>
          </TouchFeedback>
        ))}
      </div>

      {selectedType && (
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-50 p-4 rounded-lg inline-flex items-center"
          >
            <Lightbulb className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-indigo-700">
              {assistanceTypes.find(t => t.type === selectedType)?.description}
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
}
```