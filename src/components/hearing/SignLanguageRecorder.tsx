import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, StopCircle, RefreshCw, Check, X } from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';

interface SignLanguageRecorderProps {
  onRecordingComplete: (videoUrl: string) => void;
  onCancel: () => void;
}

export default function SignLanguageRecorder({
  onRecordingComplete,
  onCancel
}: SignLanguageRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra:', error);
      throw new Error('Impossible d\'accéder à la caméra');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const resetRecording = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleSave = () => {
    if (previewUrl) {
      onRecordingComplete(previewUrl);
    }
  };

  const handleCancel = () => {
    resetRecording();
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          src={previewUrl || undefined}
        />
      </div>

      <div className="flex justify-center space-x-4">
        {!isRecording && !previewUrl && (
          <TouchFeedback onClick={startRecording}>
            <div className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg">
              <Camera className="h-5 w-5 mr-2" />
              Commencer l'enregistrement
            </div>
          </TouchFeedback>
        )}

        {isRecording && (
          <TouchFeedback onClick={stopRecording}>
            <div className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg">
              <StopCircle className="h-5 w-5 mr-2" />
              Arrêter l'enregistrement
            </div>
          </TouchFeedback>
        )}

        {previewUrl && !isRecording && (
          <motion.div 
            className="flex space-x-4" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            <TouchFeedback onClick={resetRecording}>
              <div className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                <RefreshCw className="h-5 w-5 mr-2" />
                Recommencer
              </div>
            </TouchFeedback>
            <TouchFeedback onClick={handleSave}>
              <div className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg">
                <Check className="h-5 w-5 mr-2" />
                Utiliser cette vidéo
              </div>
            </TouchFeedback>
            <TouchFeedback onClick={handleCancel}>
              <div className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg">
                <X className="h-5 w-5 mr-2" />
                Annuler
              </div>
            </TouchFeedback>
          </motion.div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        {isRecording ? (
          <p className="text-red-500">Enregistrement en cours...</p>
        ) : (
          <p>Enregistrez une vidéo en langue des signes pour expliquer le devoir</p>
        )}
      </div>
    </div>
  );
}