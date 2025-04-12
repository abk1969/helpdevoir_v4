import React from 'react';
import { motion } from 'framer-motion';
import { Save, Check, AlertTriangle } from 'lucide-react';
import { backupSystem } from '../../utils/backup';

interface BackupStatusProps {
  className?: string;
}

export default function BackupStatus({ className = '' }: BackupStatusProps) {
  const lastBackup = backupSystem.getBackups().slice(-1)[0];
  const timeSinceLastBackup = lastBackup 
    ? new Date().getTime() - new Date(lastBackup.timestamp).getTime()
    : null;

  const getStatusColor = () => {
    if (!timeSinceLastBackup) return 'text-gray-400';
    if (timeSinceLastBackup < 3600000) return 'text-green-500'; // < 1h
    if (timeSinceLastBackup < 86400000) return 'text-yellow-500'; // < 24h
    return 'text-red-500';
  };

  const getStatusIcon = () => {
    if (!timeSinceLastBackup) return Save;
    if (timeSinceLastBackup < 86400000) return Check;
    return AlertTriangle;
  };

  const StatusIcon = getStatusIcon();

  return (
    <motion.div 
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <StatusIcon className={`h-5 w-5 ${getStatusColor()}`} />
      <span className="text-sm text-gray-600">
        {lastBackup ? (
          `Dernière sauvegarde : ${new Date(lastBackup.timestamp).toLocaleString()}`
        ) : (
          'Aucune sauvegarde'
        )}
      </span>
    </motion.div>
  );
}