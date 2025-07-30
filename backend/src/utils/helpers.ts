import { v4 as uuidv4 } from 'uuid';

export class Utils {
  static generateId(): string {
    return uuidv4();
  }

  static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  static calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  static calculateMatchScore(criteria: any, patient: any): number {
    let score = 0;
    let totalCriteria = 0;

    // Age range check
    totalCriteria++;
    if (patient.age >= criteria.ageRange.min && patient.age <= criteria.ageRange.max) {
      score++;
    }

    // Gender check
    if (criteria.gender && criteria.gender !== 'any') {
      totalCriteria++;
      if (patient.gender === criteria.gender) {
        score++;
      }
    }

    // Conditions check
    if (criteria.conditions && criteria.conditions.length > 0) {
      totalCriteria++;
      const hasRequiredConditions = criteria.conditions.some((condition: string) =>
        patient.conditions.some((patientCondition: string) =>
          patientCondition.toLowerCase().includes(condition.toLowerCase())
        )
      );
      if (hasRequiredConditions) {
        score++;
      }
    }

    return totalCriteria > 0 ? Math.round((score / totalCriteria) * 100) : 0;
  }

  static paginate<T>(
    data: T[],
    page: number = 1,
    pageSize: number = 10
  ): {
    data: T[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  } {
    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      data: data.slice(startIndex, endIndex),
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  static formatError(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
