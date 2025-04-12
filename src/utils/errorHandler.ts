import { toast } from 'react-hot-toast';
import { backupManager } from './backup/backupManager';

interface ErrorLog {
  timestamp: string;
  error: string;
  context: string;
  stackTrace?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private logs: ErrorLog[] = [];
  private maxLogs: number = 100;

  private constructor() {
    this.loadLogs();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: Error, context: string) {
    // Log l'erreur
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      error: error.message,
      context,
      stackTrace: error.stack
    };

    this.logs.unshift(errorLog);
    this.pruneOldLogs();
    this.saveLogs();

    // Créer une sauvegarde automatique en cas d'erreur
    backupManager.createBackup(
      `Error recovery - ${context}`,
      ['error', 'recovery'],
      'checkpoint'
    ).catch(backupError => {
      console.error('Erreur lors de la sauvegarde de récupération:', backupError);
    });

    // Notifier l'utilisateur
    toast.error(
      `Une erreur est survenue${context ? ` lors de ${context}` : ''}.` +
      ' Une sauvegarde de récupération a été créée.'
    );

    // Log pour le debugging
    console.error('Erreur gérée:', errorLog);
  }

  private loadLogs(): void {
    try {
      const savedLogs = localStorage.getItem('error-logs');
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
    }
  }

  private saveLogs(): void {
    try {
      localStorage.setItem('error-logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des logs:', error);
    }
  }

  private pruneOldLogs(): void {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  getLogs(): ErrorLog[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
    this.saveLogs();
  }

  setMaxLogs(count: number): void {
    this.maxLogs = count;
    this.pruneOldLogs();
    this.saveLogs();
  }
}

export const errorHandler = ErrorHandler.getInstance();