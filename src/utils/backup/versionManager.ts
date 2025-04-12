import { v4 as uuidv4 } from 'uuid';
import { backupManager } from './backupManager';
import { errorHandler } from '../errorHandler';
import toast from 'react-hot-toast';

export interface Version {
  id: string;
  name: string;
  timestamp: string;
  changes: string[];
  backupId: string;
  tags: string[];
  isStable: boolean;
}

class VersionManager {
  private static instance: VersionManager;
  private versions: Map<string, Version>;
  private currentVersion: string;

  private constructor() {
    this.versions = new Map();
    this.currentVersion = '1.0.0';
    this.loadVersions();
  }

  static getInstance(): VersionManager {
    if (!VersionManager.instance) {
      VersionManager.instance = new VersionManager();
    }
    return VersionManager.instance;
  }

  private loadVersions(): void {
    try {
      const savedVersions = localStorage.getItem('versions');
      if (savedVersions) {
        const parsedVersions = JSON.parse(savedVersions);
        parsedVersions.forEach((version: Version) => {
          this.versions.set(version.id, version);
        });
      }
    } catch (error) {
      errorHandler.handleError(error as Error, 'Loading versions');
    }
  }

  private saveVersions(): void {
    try {
      const versionsArray = Array.from(this.versions.values());
      localStorage.setItem('versions', JSON.stringify(versionsArray));
    } catch (error) {
      errorHandler.handleError(error as Error, 'Saving versions');
    }
  }

  async createVersion(name: string, changes: string[], tags: string[] = [], isStable: boolean = false): Promise<string> {
    try {
      // Créer une sauvegarde pour cette version
      const backupId = await backupManager.createBackup(
        `Version ${name}`,
        [...tags, 'version'],
        'checkpoint'
      );

      const version: Version = {
        id: uuidv4(),
        name,
        timestamp: new Date().toISOString(),
        changes,
        backupId,
        tags,
        isStable
      };

      this.versions.set(version.id, version);
      this.saveVersions();

      if (isStable) {
        this.currentVersion = name;
      }

      toast.success(`Version ${name} créée avec succès`);
      return version.id;
    } catch (error) {
      errorHandler.handleError(error as Error, 'Creating version');
      throw error;
    }
  }

  async restoreVersion(id: string): Promise<boolean> {
    try {
      const version = this.versions.get(id);
      if (!version) {
        throw new Error('Version non trouvée');
      }

      const success = await backupManager.restoreBackup(version.backupId);
      if (success) {
        this.currentVersion = version.name;
        toast.success(`Version ${version.name} restaurée avec succès`);
      }
      return success;
    } catch (error) {
      errorHandler.handleError(error as Error, 'Restoring version');
      return false;
    }
  }

  getVersions(): Version[] {
    return Array.from(this.versions.values());
  }

  getCurrentVersion(): string {
    return this.currentVersion;
  }

  getStableVersions(): Version[] {
    return Array.from(this.versions.values()).filter(v => v.isStable);
  }

  async markAsStable(id: string): Promise<void> {
    const version = this.versions.get(id);
    if (version) {
      version.isStable = true;
      this.currentVersion = version.name;
      this.saveVersions();
      toast.success(`Version ${version.name} marquée comme stable`);
    }
  }
}

export const versionManager = VersionManager.getInstance();