import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save,
  RotateCcw,
  Clock,
  Download,
  Upload,
  Check,
  AlertTriangle,
  Archive,
  CloudOff,
  Database
} from 'lucide-react';
import { backupSystem } from '../../utils/backup';
import { versionControl } from '../../utils/versionControl';
import TouchFeedback from '../common/TouchFeedback';
import toast from 'react-hot-toast';

export default function BackupManager() {
  const [backups, setBackups] = useState<any[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = () => {
    const loadedBackups = backupSystem.getBackups();
    setBackups(loadedBackups);
  };

  const createBackup = async () => {
    try {
      const backupId = backupSystem.createBackup({
        timestamp: new Date().toISOString(),
        version: versionControl.getCurrentVersion()
      });
      
      toast.success('Sauvegarde créée avec succès');
      loadBackups();
      return backupId;
    } catch (error) {
      toast.error('Erreur lors de la création de la sauvegarde');
      return null;
    }
  };

  const restoreBackup = async (id: string) => {
    setIsRestoring(true);
    try {
      const success = await backupSystem.restoreBackup(id);
      if (success) {
        toast.success('Restauration réussie');
        window.location.reload();
      } else {
        throw new Error('Échec de la restauration');
      }
    } catch (error) {
      toast.error('Erreur lors de la restauration');
    } finally {
      setIsRestoring(false);
      setShowConfirmation(false);
    }
  };

  const exportBackup = (backup: any) => {
    const dataStr = JSON.stringify(backup.data);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportName = `backup_${backup.timestamp.split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  };

  const importBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content);
        const backupId = await createBackup();
        if (backupId) {
          await backupSystem.restoreBackup(backupId);
          toast.success('Sauvegarde importée avec succès');
          loadBackups();
        }
      } catch (error) {
        toast.error('Erreur lors de l\'importation');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Gestionnaire de sauvegardes</h2>
          <div className="flex space-x-4">
            <TouchFeedback onClick={createBackup}>
              <div className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg">
                <Save className="h-5 w-5 mr-2" />
                Nouvelle sauvegarde
              </div>
            </TouchFeedback>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={importBackup}
                className="hidden"
              />
              <div className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg">
                <Upload className="h-5 w-5 mr-2" />
                Importer
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {backups.length === 0 ? (
            <div className="text-center py-12">
              <CloudOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune sauvegarde disponible</p>
            </div>
          ) : (
            backups.map((backup) => (
              <motion.div
                key={backup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Database className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Version {backup.version}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(backup.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <TouchFeedback onClick={() => exportBackup(backup)}>
                      <div className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        <Download className="h-5 w-5" />
                      </div>
                    </TouchFeedback>
                    <TouchFeedback onClick={() => {
                      setSelectedBackup(backup.id);
                      setShowConfirmation(true);
                    }}>
                      <div className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        <RotateCcw className="h-5 w-5" />
                      </div>
                    </TouchFeedback>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal de confirmation */}
      <AnimatePresence>
        {showConfirmation && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowConfirmation(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 z-50 w-[90vw] max-w-md"
            >
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Confirmer la restauration
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Cette action remplacera toutes les données actuelles. Cette opération est irréversible.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <TouchFeedback onClick={() => setShowConfirmation(false)}>
                  <div className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
                    Annuler
                  </div>
                </TouchFeedback>
                <TouchFeedback 
                  onClick={() => selectedBackup && restoreBackup(selectedBackup)}
                  disabled={isRestoring}
                >
                  <div className={`px-4 py-2 bg-yellow-600 text-white rounded-lg ${
                    isRestoring ? 'opacity-50 cursor-not-allowed' : ''
                  }`}>
                    {isRestoring ? 'Restauration...' : 'Restaurer'}
                  </div>
                </TouchFeedback>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}