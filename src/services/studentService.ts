import { ApiService } from './api';
import { Student } from '../types';

interface CreateStudentData {
  firstName: string;
  age: number;
  email?: string;
  gradeLevel: string;
  hasDyslexia?: boolean;
  hearingImpaired?: boolean;
  visuallyImpaired?: boolean;
}

class StudentService extends ApiService {
  async getStudents(): Promise<Student[]> {
    try {
      return await this.get<Student[]>('/api/students');
    } catch (error) {
      console.error('Get students error:', error);
      throw error;
    }
  }

  async getStudent(id: string): Promise<Student> {
    try {
      return await this.get<Student>(`/api/students/${id}`);
    } catch (error) {
      console.error(`Get student ${id} error:`, error);
      throw error;
    }
  }

  async createStudent(data: CreateStudentData): Promise<Student> {
    try {
      return await this.post<Student>('/api/students', data);
    } catch (error) {
      console.error('Create student error:', error);
      throw error;
    }
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    try {
      return await this.put<Student>(`/api/students/${id}`, data);
    } catch (error) {
      console.error(`Update student ${id} error:`, error);
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      await this.delete(`/api/students/${id}`);
    } catch (error) {
      console.error(`Delete student ${id} error:`, error);
      throw error;
    }
  }
}

export default new StudentService();
