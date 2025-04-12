import React from 'react';
import { X, Link as LinkIcon, Mail, MessageCircle } from 'lucide-react';
import { Homework } from '../../types';
import toast from 'react-hot-toast';

interface ShareModalProps {
  homework: Homework;
  onClose: () => void;
}

export default function ShareModal({ homework, onClose }: ShareModalProps) {
  const shareUrl = `${window.location.origin}/homework/${homework.id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Lien copié !');
    } catch (err) {
      toast.error('Erreur lors de la copie du lien');
    }
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(`Devoir: ${homework.title}`);
    const body = encodeURIComponent(`Voici le devoir "${homework.title}"\n\n${homework.description}\n\nLien: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareByWhatsApp = () => {
    const text = encodeURIComponent(`Devoir: ${homework.title}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Partager le devoir</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={copyLink}
            className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
          >
            <LinkIcon className="h-5 w-5" />
            <span>Copier le lien</span>
          </button>

          <button
            onClick={shareByEmail}
            className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
          >
            <Mail className="h-5 w-5" />
            <span>Partager par email</span>
          </button>

          <button
            onClick={shareByWhatsApp}
            className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Partager via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}