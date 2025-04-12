import { backupSystem } from './backup';
import { useStudentStore } from '../store/studentStore';
import { useSubjectStore } from '../store/subjectStore';
import { useHomeworkStore } from '../store/homeworkStore';

class AutoSave {
  private static instance: AutoSave;
  private interval: number = 5 * 60 * 1000; // 5 minutes
  private timer: NodeJS.Timeout | null = null;

  private constructor() {
    this.startAutoSave();
  }

  static getInstance(): AutoSave {
    if (!AutoSave.instance) {
      AutoSave.instance = new AutoSave();
    }
    return AutoSave.instance;
  }

  private startAutoSave() {
    this.timer = setInterval(() => {
      this.saveAll();
    }, this.interval);
  }

  private saveAll() {
    const students = useStudentStore.getState().getStudents();
    const subjects = useSubjectStore.getState().subjects;
    const homeworks = useHomeworkStore.getState().homeworks;

    backupSystem.createBackup({
      students,
      subjects,
      homeworks,
      settings: {
        version: '1.0.0',
        lastSave: new Date().toISOString()
      }
    });
  }

  stopAutoSave() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  setInterval(minutes: number) {
    this.interval = minutes * 60 * 1000;
    this.stopAutoSave();
    this.startAutoSave();
  }
}

export const autoSave = AutoSave.getInstance();