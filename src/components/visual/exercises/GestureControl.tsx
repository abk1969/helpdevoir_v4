import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Move, ZoomIn, ZoomOut, RotateCw, Hand } from 'lucide-react';
import TouchFeedback from '../../common/TouchFeedback';

interface GestureControlProps {
  fontSize: number;
  announceContent: (text: string) => void;
}

export default function GestureControl({
  fontSize,
  announceContent
}: GestureControlProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isGestureMode, setIsGestureMode] = useState(false);

  useEffect(() => {
    if (isGestureMode) {
      // Ici, nous utiliserions MediaPipe Hands pour la détection des gestes
      announceContent('Mode gestes activé');
    }
  }, [isGestureMode, announceContent]);

  const handleGesture = (type: string) => {
    switch (type) {
      case 'zoom-in':
        setScale(prev => Math.min(prev + 0.1, 2));
        announceContent('Zoom avant');
        break;
      case 'zoom-out':
        setScale(prev => Math.max(prev - 0.1, 0.5));
        announceContent('Zoom arrière');
        break;
      case 'rotate':
        setRotation(prev => prev + 90);
        announceContent('Rotation de 90 degrés');
        break;
      case 'reset':
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
        announceContent('Position réinitialisée');
        break;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Contrôle par Gestes</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Commandes */}
          <div>
            <h3 className="text-lg font-medium mb-4">Commandes disponibles</h3>
            <div className="space-y-4">
              <TouchFeedback onClick={() => handleGesture('zoom-in')}>
                <div className="flex items-center w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <ZoomIn className="h-5 w-5 mr-3" />
                  <span>Zoom avant</span>
                </div>
              </TouchFeedback>

              <TouchFeedback onClick={() => handleGesture('zoom-out')}>
                <div className="flex items-center w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <ZoomOut className="h-5 w-5 mr-3" />
                  <span>Zoom arrière</span>
                </div>
              </TouchFeedback>

              <TouchFeedback onClick={() => handleGesture('rotate')}>
                <div className="flex items-center w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <RotateCw className="h-5 w-5 mr-3" />
                  <span>Rotation</span>
                </div>
              </TouchFeedback>

              <TouchFeedback onClick={() => handleGesture('reset')}>
                <div className="flex items-center w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <Move className="h-5 w-5 mr-3" />
                  <span>Réinitialiser</span>
                </div>
              </TouchFeedback>
            </div>
          </div>

          {/* Zone de test */}
          <div>
            <h3 className="text-lg font-medium mb-4">Zone de test</h3>
            <motion.div
              className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
              drag
              dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              whileDrag={{ scale: 1.1 }}
              animate={{
                scale,
                rotate: rotation,
                x: position.x,
                y: position.y
              }}
              onDragEnd={(e, info) => {
                setPosition({
                  x: position.x + info.offset.x,
                  y: position.y + info.offset.y
                });
                announceContent('Position mise à jour');
              }}
            >
              <div 
                className="text-center p-4"
                style={{ fontSize: `${fontSize}px` }}
              >
                <Hand className="h-12 w-12 mx-auto mb-2" />
                <p>Zone interactive</p>
                <p className="text-sm text-gray-600">Faites glisser pour déplacer</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mode gestes */}
        <div className="mt-8">
          <TouchFeedback onClick={() => setIsGestureMode(!isGestureMode)}>
            <div className={`w-full p-4 rounded-lg text-center ${
              isGestureMode 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              {isGestureMode ? 'Désactiver' : 'Activer'} le mode gestes
            </div>
          </TouchFeedback>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Instructions</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Utilisez les boutons pour tester les différentes commandes</li>
            <li>La zone interactive peut être déplacée avec le curseur</li>
            <li>Double-tapez pour zoomer rapidement</li>
            <li>Faites un geste de pincement pour zoomer/dézoomer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}