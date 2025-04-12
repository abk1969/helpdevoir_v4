import React from 'react';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { Homework } from '../../types';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface DyslexiaHomeworkCardProps {
  homework: Homework;
  onToggleComplete: () => void;
}

export default function DyslexiaHomeworkCard({
  homework,
  onToggleComplete
}: DyslexiaHomeworkCardProps) {
  const { font, fontSize, lineSpacing, colorScheme } = useAccessibilityStore();

  const getBackgroundColor = () => {
    switch (colorScheme) {
      case 'cream':
        return 'bg-[#f5f5dc]';
      case 'blue':
        return 'bg-[#e6f3ff]';
      case 'yellow':
        return 'bg-[#fafad2]';
      default:
        return 'bg-white';
    }
  };

  const getDueStatus = () => {
    const dueDate = new Date(homework.dueDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { color: 'text-red-500', text: 'En retard' };
    } else if (diffDays === 0) {
      return { color: 'text-orange-500', text: 'Pour aujourd\'hui' };
    } else if (diffDays <= 2) {
      return { color: 'text-yellow-500', text: 'Bientôt' };
    }
    return { color: 'text-green-500', text: 'À venir' };
  };

  const status = getDueStatus();

  return (
    <div
      className={`${getBackgroundColor()} rounded-lg p-6 shadow-md transition-shadow hover:shadow-lg`}
      style={{
        fontFamily: font === 'opendyslexic' ? 'OpenDyslexic' : font,
        fontSize: `${fontSize}px`,
        lineHeight: lineSpacing
      }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900">{homework.title}</h3>
          <p className="text-gray-600" style={{ maxWidth: '80ch' }}>
            {homework.description}
          </p>
        </div>
        <button
          onClick={onToggleComplete}
          className={`p-2 rounded-full transition-colors ${
            homework.completed
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          <CheckCircle className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className="text-gray-600">
            {new Date(homework.dueDate).toLocaleDateString()}
          </span>
        </div>
        <div className={`flex items-center space-x-1 ${status.color}`}>
          <AlertCircle className="h-5 w-5" />
          <span>{status.text}</span>
        </div>
      </div>

      {homework.attachments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Fichiers joints :
          </h4>
          <div className="flex flex-wrap gap-2">
            {homework.attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              >
                {attachment.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}