import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { HomeworkAttachment } from '../../types';

interface FileUploadProps {
  onFileSelect: (attachments: HomeworkAttachment[]) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const attachments: HomeworkAttachment[] = Array.from(files).map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: 'file',
        url: URL.createObjectURL(file),
        name: file.name,
        fileType: file.type,
        size: file.size
      }));
      onFileSelect(attachments);
    }
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const attachments: HomeworkAttachment[] = Array.from(files).map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: 'photo',
        url: URL.createObjectURL(file),
        name: file.name,
        fileType: file.type,
        size: file.size
      }));
      onFileSelect(attachments);
    }
  };

  return (
    <div className="flex gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />
      <input
        type="file"
        ref={photoInputRef}
        onChange={handlePhotoCapture}
        className="hidden"
        accept="image/*"
        capture="environment"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
      >
        <Upload className="h-5 w-5 mr-2" />
        Ajouter un fichier
      </button>
      
      <button
        type="button"
        onClick={() => photoInputRef.current?.click()}
        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
      >
        <Camera className="h-5 w-5 mr-2" />
        Prendre une photo
      </button>
    </div>
  );
}