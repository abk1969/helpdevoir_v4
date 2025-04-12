import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TouchFeedback from '../../common/TouchFeedback';

interface SignLanguageRecognitionProps {
  onGestureDetected: (gesture: string) => void;
  targetGesture: string;
}

export default function SignLanguageRecognition({
  onGestureDetected,
  targetGesture
}: SignLanguageRecognitionProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [hasWebcamPermission, setHasWebcamPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // Check webcam permissions
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setHasWebcamPermission(true))
      .catch(() => setHasWebcamPermission(false));
  }, []);

  useEffect(() => {
    if (isRecording) {
      // Here we would integrate with MediaPipe Hands for real gesture recognition
      // For now, we'll simulate gesture detection
      const timer = setTimeout(() => {
        const isCorrect = Math.random() > 0.5;
        setFeedback(isCorrect ? 'success' : 'error');
        onGestureDetected(isCorrect ? targetGesture : 'incorrect');
        setIsRecording(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isRecording, targetGesture, onGestureDetected]);

  if (hasWebcamPermission === false) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Accès à la caméra requis
        </h3>
        <p className="text-red-600">
          Pour utiliser la reconnaissance des signes, veuillez autoriser l'accès à votre caméra.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          className="w-full h-full object-cover"
          mirrored
        />
        
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
            >
              {feedback === 'success' ? (
                <CheckCircle className="h-24 w-24 text-green-500" />
              ) : (
                <XCircle className="h-24 w-24 text-red-500" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex justify-center">
        <TouchFeedback
          onClick={() => {
            setIsRecording(true);
            setFeedback(null);
          }}
        >
          <div
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 ${
              isRecording
                ? 'bg-red-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            } transition-colors`}
          >
            <Camera className="h-5 w-5" />
            <span>{isRecording ? 'Enregistrement...' : 'Commencer'}</span>
          </div>
        </TouchFeedback>
      </div>
    </div>
  );
}