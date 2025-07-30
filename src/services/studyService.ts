import { 
  Study, 
  CreateStudyRequest, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export class StudyService {
  static async getStudies(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Study>> {
    const response = await fetch(`${API_BASE}/studies?page=${page}&pageSize=${pageSize}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  static async getStudy(id: string): Promise<ApiResponse<Study>> {
    const response = await fetch(`${API_BASE}/studies/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  static async createStudy(study: CreateStudyRequest): Promise<ApiResponse<Study>> {
    const response = await fetch(`${API_BASE}/studies`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(study),
    });
    return response.json();
  }

  static async updateStudy(id: string, study: Partial<Study>): Promise<ApiResponse<Study>> {
    const response = await fetch(`${API_BASE}/studies/${id}`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(study),
    });
    return response.json();
  }

  static async deleteStudy(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE}/studies/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  static async getStudyStats(id: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE}/studies/${id}/stats`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      const parsed = JSON.parse(token);
      if (parsed.state?.token) {
        return {
          'Authorization': `Bearer ${parsed.state.token}`,
        };
      }
    }
    return {};
  }
}
