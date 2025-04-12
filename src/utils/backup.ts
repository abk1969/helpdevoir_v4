import { v4 as uuidv4 } from 'uuid';
import { Student, Subject, Homework } from '../types';

interface BackupData {
  id: string;
  timestamp: string;
  version: string;
  data: {
    students: Student[];
    subjects: Subject[];
    homeworks: Homework[];
    settings: any;
  };
}

class BackupSystem {
  private static instance: BackupSystem;
  private backups: BackupData[] = [];
  private currentVersion = '1.0.0';
  private maxBackups = 10;

  private constructor() {}

  static getInstance(): BackupSystem {
    if (!BackupSystem.instance) {
      BackupSystem.instance = new BackupSystem();
    }
    return BackupSystem.instance;
  }

  createBackup(data: any): string {
    const backup: BackupData = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      version: this.currentVersion,
      data: {
        students: data.students || [],
        subjects: data.subjects || [],
        homeworks: data.homeworks || [],
        settings: data.settings || {}
      }
    };

    // Garder uniquement les dernières sauvegardes
    if (this.backups.length >= this.maxBackups) {
      this.backups.shift();
    }

    this.backups.push(backup);
    this.saveToLocalStorage();

    return backup.id;
  }

  restoreBackup(id: string): boolean {
    const backup = this.backups.find(b => b.id === id);
    if (!backup) return false;

    try {
      // Restaurer les données
      localStorage.setItem('student-storage', JSON.stringify(backup.data.students));
      localStorage.setItem('subject-storage', JSON.stringify(backup.data.subjects));
      localStorage.setItem('homework-storage', JSON.stringify(backup.data.homeworks));
      localStorage.setItem('settings-storage', JSON.stringify(backup.data.settings));
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      return false;
    }
  }

  getBackups(): BackupData[] {
    return this.backups;
  }

  restoreVersion(version: string): boolean {
    const backup = this.backups.find(b => b.version === version);
    return backup ? this.restoreBackup(backup.id) : false;
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('backups', JSON.stringify(this.backups));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des backups:', error);
    }
  }

  loadFromLocalStorage() {
    try {
      const savedBackups = localStorage.getItem('backups');
      if (savedBackups) {
        this.backups = JSON.parse(savedBackups);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des backups:', error);
    }
  }

  // Restaurer une version spécifique (par exemple https://bolt.new/~/github-ptkwb2)
  restoreSpecificVersion(versionUrl: string): boolean {
    if (versionUrl === 'https://bolt.new/~/github-ptkwb2') {
      // Restaurer cette version spécifique
      const backup = this.backups.find(b => b.version === '1.0.0');
      return backup ? this.restoreBackup(backup.id) : false;
    }
    return false;
  }
}

export const backupSystem = BackupSystem.getInstance();