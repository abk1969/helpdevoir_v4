import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save,
  Clock,
  Tag,
  Download,
  Upload,
  Check,
  AlertTriangle,
  Archive,
  CloudOff,
  Database,
  RefreshCw
} from 'lucide-react';
import { backupManager, BackupData } from '../../utils/backup/backupManager';
import { versionManager } from '../../utils/backup/versionManager';
import TouchFeedback from '../common/TouchFeedback';
import toast from 'react-hot-toast';

export default function BackupDashboard() {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = () => {
    const loadedBackups = backupManager.getBackups();
    setBackups(loadedBackups);
  };

  const handleCreateBackup = async () => {
    try {
      const description = prompt('Description de la sauvegarde (optionnel):');
      const tags = prompt('Tags (séparés par des virgules):')?.split(',').map(t => t.trim()) || [];
      
      await backupManager.createBackup(description, tags);
      loadBackups();
    } catch (error) {
      toast.error('Erreur lors de la création de la sauvegarde');
    }
  };

  const handleRestore = async (id: string) => {
    setIsRestoring(true);
    try {
      const success = await backupManager.restoreBackup(id);
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

  const handleCreateVersion = async () => {
    try {
      const name = prompt('Nom de la version:');
      if (!name) return;

      const changes = prompt('Liste des changements (séparés par des virgules):')?.split(',').map(c => c.trim()) || [];
      const tags = prompt('Tags (séparés par des virgules):')?.split(',').map(t => t.trim()) || [];
      const isStable = confirm('Marquer cette version comme stable ?');

      await versionManager.createVersion(name, changes, tags, isStable);
      loadBackups();
    } catch (error) {
      toast.error('Erreur lors de la création de la version');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Sauvegardes et Versions</h2>
          <div className="flex space-x-4">
            <TouchFeedback onClick={handleCreateBackup}>
              <div className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg">
                <Save className="h-5 w-5 mr-2" />
                Nouvelle sauvegarde
              </div>
            </TouchFeedback>
            <TouchFeedback onClick={handleCreateVersion}>
              <div className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg">
                <Tag className="h-5 w-5 mr-2" />
                Nouvelle version
              </div>
            </TouchFeedback>
          </div>
        </div>

        {backups.length === 0 ? (
          <div className="text-center py-12">
            <CloudOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune sauvegarde disponible</p>
          </div>
        ) : (
          <div className="space-y-4">
            {backups.map((backup) => (
              <motion.div
                key={backup.metadata.id}
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
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">
                          {backup.metadata.type === 'auto' ? 'Sauvegarde automatique' : 
                           backup.metadata.type === 'checkpoint' ? 'Point de contrôle' : 
                           'Sauvegarde manuelle'}
                        </h3>
                        {backup.metadata.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(backup.metadata.timestamp).toLocaleString()}
                      </p>
                      {backup.metadata.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {backup.metadata.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <TouchFeedback onClick={() => {
                      setSelectedBackup(backup.metadata.id);
                      setShowConfirmation(true);
                    }}>
                      <div className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        <RefreshCw className="h-5 w-5" />
                      </div>
                    </TouchFeedback>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmation */}
      {showConfirmation && selectedBackup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Confirmer la restauration</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir restaurer cette sauvegarde ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <TouchFeedback onClick={() => setShowConfirmation(false)}>
                <div className="px-4 py-2 text-gray-600">
                  Annuler
                </div>
              </TouchFeedback>
              <TouchFeedback 
                onClick={() => handleRestore(selectedBackup)}
                disabled={isRestoring}
              >
                <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                  {isRestoring ? 'Restauration...' : 'Confirmer'}
                </div>
              </TouchFeedback>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}