import { ApiService } from './api';
import { Homework, HomeworkAttachment } from '../types';

interface CreateHomeworkData {
  title: string;
  description: string;
  dueDate: string;
  studentId: string;
  subjectId: string;
  estimatedTime?: string;
}

class HomeworkService extends ApiService {
  async getHomeworks(studentId: string, subjectId?: string): Promise<Homework[]> {
    try {
      const url = subjectId 
        ? `/api/students/${studentId}/subjects/${subjectId}/homeworks`
        : `/api/students/${studentId}/homeworks`;
      return await this.get<Homework[]>(url);
    } catch (error) {
      console.error('Get homeworks error:', error);
      throw error;
    }
  }

  async getHomework(homeworkId: string): Promise<Homework> {
    try {
      return await this.get<Homework>(`/api/homeworks/${homeworkId}`);
    } catch (error) {
      console.error(`Get homework ${homeworkId} error:`, error);
      throw error;
    }
  }

  async createHomework(data: CreateHomeworkData): Promise<Homework> {
    try {
      return await this.post<Homework>('/api/homeworks', data);
    } catch (error) {
      console.error('Create homework error:', error);
      throw error;
    }
  }

  async updateHomework(id: string, data: Partial<Homework>): Promise<Homework> {
    try {
      return await this.put<Homework>(`/api/homeworks/${id}`, data);
    } catch (error) {
      console.error(`Update homework ${id} error:`, error);
      throw error;
    }
  }

  async deleteHomework(id: string): Promise<void> {
    try {
      await this.delete(`/api/homeworks/${id}`);
    } catch (error) {
      console.error(`Delete homework ${id} error:`, error);
      throw error;
    }
  }

  async uploadAttachment(homeworkId: string, file: File): Promise<HomeworkAttachment> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('homeworkId', homeworkId);
      
      return await this.uploadFile<HomeworkAttachment>('/api/homeworks/attachments', formData);
    } catch (error) {
      console.error('Upload attachment error:', error);
      throw error;
    }
  }

  async correctHomework(homeworkId: string, file: File, question: string): Promise<{ correction: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('homeworkId', homeworkId);
      formData.append('question', question);
      
      return await this.uploadFile<{ correction: string }>('/api/homework/correct', formData);
    } catch (error) {
      console.error('Correct homework error:', error);
      throw error;
    }
  }
}

export default new HomeworkService();
