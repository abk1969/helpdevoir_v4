import { backupSystem } from './backup';

interface Version {
  id: string;
  name: string;
  timestamp: string;
  changes: string[];
}

class VersionControl {
  private static instance: VersionControl;
  private versions: Version[] = [];
  private currentVersion: string = '1.0.0';

  private constructor() {
    this.initializeVersions();
  }

  static getInstance(): VersionControl {
    if (!VersionControl.instance) {
      VersionControl.instance = new VersionControl();
    }
    return VersionControl.instance;
  }

  private initializeVersions() {
    // Version initiale (github-ptkwb2)
    this.addVersion({
      id: 'github-ptkwb2',
      name: '1.0.0',
      timestamp: new Date().toISOString(),
      changes: [
        'Version initiale',
        'Support des malentendants',
        'Support des malvoyants',
        'Support de la dyslexie'
      ]
    });
  }

  addVersion(version: Version) {
    this.versions.push(version);
    this.currentVersion = version.name;
    this.saveVersions();
  }

  getCurrentVersion(): string {
    return this.currentVersion;
  }

  getVersions(): Version[] {
    return this.versions;
  }

  restoreVersion(versionId: string): boolean {
    const version = this.versions.find(v => v.id === versionId);
    if (!version) return false;

    return backupSystem.restoreVersion(version.name);
  }

  private saveVersions() {
    try {
      localStorage.setItem('versions', JSON.stringify(this.versions));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des versions:', error);
    }
  }

  loadVersions() {
    try {
      const savedVersions = localStorage.getItem('versions');
      if (savedVersions) {
        this.versions = JSON.parse(savedVersions);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des versions:', error);
    }
  }
}

export const versionControl = VersionControl.getInstance();