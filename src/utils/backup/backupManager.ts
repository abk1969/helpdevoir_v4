import { v4 as uuidv4 } from 'uuid';
import { useStudentStore } from '../../store/studentStore';
import { useSubjectStore } from '../../store/subjectStore';
import { useHomeworkStore } from '../../store/homeworkStore';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { errorHandler } from '../errorHandler';
import toast from 'react-hot-toast';

export interface BackupMetadata {
  id: string;
  timestamp: string;
  version: string;
  type: 'auto' | 'manual' | 'checkpoint';
  description?: string;
  tags: string[];
}

export interface BackupData {
  metadata: BackupMetadata;
  data: {
    students: any[];
    subjects: any[];
    homeworks: any[];
    settings: any;
    aiSettings?: any;
  };
}

class BackupManager {
  private static instance: BackupManager;
  private backups: Map<string, BackupData>;
  private currentVersion: string;
  private autoSaveInterval: number = 5 * 60 * 1000; // 5 minutes
  private maxBackups: number = 50;
  private autoSaveTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.backups = new Map();
    this.currentVersion = '1.0.0';
    this.loadBackups();
    this.initializeAutoSave();
  }

  static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager();
    }
    return BackupManager.instance;
  }

  private initializeAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    this.autoSaveTimer = setInterval(() => {
      this.createAutoBackup().catch(error => {
        errorHandler.handleError(error as Error, 'Auto backup');
      });
    }, this.autoSaveInterval);
  }

  private async loadBackups(): Promise<void> {
    try {
      const savedBackups = localStorage.getItem('backups');
      if (savedBackups) {
        const parsedBackups = JSON.parse(savedBackups);
        if (Array.isArray(parsedBackups)) {
          parsedBackups.forEach((backup: BackupData) => {
            if (backup?.metadata?.id) {
              this.backups.set(backup.metadata.id, backup);
            }
          });
        }
      }
    } catch (error) {
      errorHandler.handleError(error as Error, 'Loading backups');
    }
  }

  private saveBackups(): void {
    try {
      const backupsArray = Array.from(this.backups.values());
      localStorage.setItem('backups', JSON.stringify(backupsArray));
    } catch (error) {
      errorHandler.handleError(error as Error, 'Saving backups');
    }
  }

  async createBackup(description?: string, tags: string[] = [], type: 'manual' | 'checkpoint' = 'manual'): Promise<string> {
    try {
      const data = await this.collectBackupData();
      if (!data) {
        throw new Error('Failed to collect backup data');
      }

      const backup: BackupData = {
        metadata: {
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          version: this.currentVersion,
          type,
          description,
          tags
        },
        data
      };

      this.backups.set(backup.metadata.id, backup);
      this.pruneOldBackups();
      this.saveBackups();
      
      toast.success('Sauvegarde créée avec succès');
      return backup.metadata.id;
    } catch (error) {
      errorHandler.handleError(error as Error, 'Creating backup');
      throw error;
    }
  }

  private async createAutoBackup(): Promise<void> {
    try {
      const data = await this.collectBackupData();
      if (!data) return;

      const backup: BackupData = {
        metadata: {
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          version: this.currentVersion,
          type: 'auto',
          tags: ['auto']
        },
        data
      };

      this.backups.set(backup.metadata.id, backup);
      this.pruneOldBackups();
      this.saveBackups();
    } catch (error) {
      errorHandler.handleError(error as Error, 'Auto backup');
    }
  }

  private async collectBackupData() {
    try {
      return {
        students: useStudentStore.getState().getStudents(),
        subjects: useSubjectStore.getState().subjects,
        homeworks: useHomeworkStore.getState().homeworks,
        settings: useAccessibilityStore.getState(),
        aiSettings: {} // À implémenter avec les paramètres AI
      };
    } catch (error) {
      errorHandler.handleError(error as Error, 'Collecting backup data');
      return null;
    }
  }

  private pruneOldBackups(): void {
    const backupsArray = Array.from(this.backups.values())
      .sort((a, b) => new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime());

    // Garder tous les checkpoints et les sauvegardes manuelles récentes
    const manualAndCheckpoints = backupsArray.filter(
      b => b.metadata.type !== 'auto'
    );
    const autoBackups = backupsArray.filter(b => b.metadata.type === 'auto');

    const backupsToKeep = [
      ...manualAndCheckpoints,
      ...autoBackups.slice(0, this.maxBackups - manualAndCheckpoints.length)
    ];

    this.backups = new Map(
      backupsToKeep.map(backup => [backup.metadata.id, backup])
    );
  }

  async restoreBackup(id: string): Promise<boolean> {
    try {
      const backup = this.backups.get(id);
      if (!backup) {
        throw new Error('Sauvegarde non trouvée');
      }

      // Créer une sauvegarde avant la restauration
      await this.createBackup('Pre-restore checkpoint', ['pre-restore'], 'checkpoint');

      // Restaurer les données
      await this.restoreData(backup.data);

      toast.success('Restauration effectuée avec succès');
      return true;
    } catch (error) {
      errorHandler.handleError(error as Error, 'Restoring backup');
      return false;
    }
  }

  private async restoreData(data: BackupData['data']): Promise<void> {
    try {
      const studentStore = useStudentStore.getState();
      const subjectStore = useSubjectStore.getState();
      const homeworkStore = useHomeworkStore.getState();
      const accessibilityStore = useAccessibilityStore.getState();

      // Restaurer les données dans l'ordre correct
      if (data.students) {
        data.students.forEach(student => studentStore.addStudent(student));
      }
      if (data.subjects) {
        data.subjects.forEach(subject => subjectStore.addSubject(subject));
      }
      if (data.homeworks) {
        data.homeworks.forEach(homework => homeworkStore.addHomework(homework));
      }
      if (data.settings) {
        accessibilityStore.updateSettings(data.settings);
      }
    } catch (error) {
      throw new Error(`Erreur lors de la restauration des données: ${error}`);
    }
  }

  getBackups(): BackupData[] {
    return Array.from(this.backups.values())
      .sort((a, b) => new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime());
  }

  setAutoSaveInterval(minutes: number): void {
    this.autoSaveInterval = minutes * 60 * 1000;
    this.initializeAutoSave();
  }

  setMaxBackups(count: number): void {
    this.maxBackups = count;
    this.pruneOldBackups();
  }

  cleanup(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
  }
}

export const backupManager = BackupManager.getInstance();