import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Image as ImageIcon, Video, HandMetal } from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';

interface Instruction {
  type: 'image' | 'video' | 'signLanguage';
  url: string;
  description: string;
}

interface VisualInstructionEditorProps {
  instructions: Instruction[];
  onChange: (instructions: Instruction[]) => void;
}

export default function VisualInstructionEditor({
  instructions,
  onChange
}: VisualInstructionEditorProps) {
  const handleRemoveInstruction = (index: number) => {
    const newInstructions = instructions.filter((_, i) => i !== index);
    onChange(newInstructions);
  };

  const handleUpdateDescription = (index: number, description: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = { ...newInstructions[index], description };
    onChange(newInstructions);
  };

  const getIcon = (type: Instruction['type']) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'signLanguage':
        return HandMetal;
    }
  };

  if (instructions.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">
          Ajoutez des images ou des vidéos pour illustrer le devoir
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {instructions.map((instruction, index) => {
          const Icon = getIcon(instruction.type);
          
          return (
            <motion.div
              key={instruction.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Icon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {instruction.type === 'image' ? 'Image' : 
                     instruction.type === 'video' ? 'Vidéo' : 
                     'Langue des signes'}
                  </span>
                </div>
                <TouchFeedback onClick={() => handleRemoveInstruction(index)}>
                  <div className="p-1 hover:bg-gray-200 rounded-full">
                    <X className="h-4 w-4 text-gray-500" />
                  </div>
                </TouchFeedback>
              </div>

              <div className="mb-4">
                {instruction.type === 'image' ? (
                  <img
                    src={instruction.url}
                    alt={instruction.description}
                    className="w-full rounded-lg"
                  />
                ) : (
                  <video
                    src={instruction.url}
                    controls
                    className="w-full rounded-lg"
                  />
                )}
              </div>

              <div className="relative">
                <textarea
                  value={instruction.description}
                  onChange={(e) => handleUpdateDescription(index, e.target.value)}
                  placeholder="Ajoutez une description..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
                <div className="absolute right-2 top-2">
                  <Edit2 className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}