import { User, Study, Patient, PatientMatch, ActivityItem, StudyStats } from '@/types/index.js';
import { Utils } from '@/utils/helpers.js';
import { AuthUtils } from '@/utils/auth.js';

// Mock data storage (in production, this would be a database)
export class MockDataService {
  private static users: User[] = [
    {
      id: '1',
      email: 'demo@healthservice.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'researcher',
      permissions: ['read:studies', 'write:studies', 'read:patients', 'write:patients'],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      email: 'admin@healthservice.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      permissions: ['read:studies', 'write:studies', 'read:patients', 'write:patients', 'admin:all'],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
  ];

  private static refreshTokens: Map<string, string> = new Map();
  private static patients: Patient[] = [];
  private static forms: any[] = [];
  private static matches: PatientMatch[] = [];

  private static studies: Study[] = [
    {
      id: '1',
      title: 'COVID-19 Vaccine Efficacy Study',
      description: 'A randomized controlled trial to assess vaccine effectiveness',
      objectives: ['Measure vaccine efficacy', 'Monitor side effects'],
      criteria: {
        inclusionCriteria: ['Age 18-65', 'Healthy individuals'],
        exclusionCriteria: ['Pregnancy', 'Immunocompromised'],
        ageRange: { min: 18, max: 65 },
        gender: 'any',
        conditions: [],
      },
      status: 'active',
      createdBy: '1',
      createdAt: '2025-01-15T00:00:00Z',
      updatedAt: '2025-01-28T00:00:00Z',
      enrollmentCount: 45,
      targetEnrollment: 100,
    },
    {
      id: '2',
      title: 'Diabetes Management Study',
      description: 'Evaluating new glucose monitoring techniques',
      objectives: ['Compare monitoring methods', 'Assess patient satisfaction'],
      criteria: {
        inclusionCriteria: ['Type 2 diabetes', 'Age 40+'],
        exclusionCriteria: ['Type 1 diabetes'],
        ageRange: { min: 40, max: 80 },
        gender: 'any',
        conditions: ['Type 2 Diabetes'],
      },
      status: 'active',
      createdBy: '1',
      createdAt: '2025-01-10T00:00:00Z',
      updatedAt: '2025-01-27T00:00:00Z',
      enrollmentCount: 32,
      targetEnrollment: 50,
    },
    {
      id: '3',
      title: 'Hypertension Treatment Protocol',
      description: 'Comparing different treatment approaches for hypertension',
      objectives: ['Evaluate treatment effectiveness', 'Monitor blood pressure changes'],
      criteria: {
        inclusionCriteria: ['Diagnosed hypertension', 'Age 30-70'],
        exclusionCriteria: ['Secondary hypertension'],
        ageRange: { min: 30, max: 70 },
        gender: 'any',
        conditions: ['Hypertension'],
      },
      status: 'draft',
      createdBy: '2',
      createdAt: '2025-01-20T00:00:00Z',
      updatedAt: '2025-01-25T00:00:00Z',
      enrollmentCount: 0,
      targetEnrollment: 80,
    },
  ];

  private static patients: Patient[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      age: 45,
      gender: 'male',
      conditions: ['Type 2 Diabetes', 'Hypertension'],
      medications: ['Metformin', 'Lisinopril'],
      lastVisit: '2025-01-20T00:00:00Z',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-20T00:00:00Z',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      age: 32,
      gender: 'female',
      conditions: ['Healthy'],
      medications: [],
      lastVisit: '2025-01-25T00:00:00Z',
      createdAt: '2025-01-05T00:00:00Z',
      updatedAt: '2025-01-25T00:00:00Z',
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      age: 58,
      gender: 'male',
      conditions: ['Hypertension', 'High Cholesterol'],
      medications: ['Amlodipine', 'Atorvastatin'],
      lastVisit: '2025-01-22T00:00:00Z',
      createdAt: '2025-01-03T00:00:00Z',
      updatedAt: '2025-01-22T00:00:00Z',
    },
  ];

  private static patientMatches: PatientMatch[] = [];
  private static refreshTokens: Map<string, string> = new Map();

  // User methods
  static async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  static async findUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  static async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    // For demo purposes, accept any password for demo users
    if (email === 'demo@healthservice.com' && password === 'demo123') {
      return user;
    }
    if (email === 'admin@healthservice.com' && password === 'admin123') {
      return user;
    }

    // In production, you would use: await AuthUtils.comparePassword(password, user.hashedPassword)
    return null;
  }

  // Refresh token methods
  static storeRefreshToken(userId: string, token: string): void {
    this.refreshTokens.set(userId, token);
  }

  static getRefreshToken(userId: string): string | undefined {
    return this.refreshTokens.get(userId);
  }

  static removeRefreshToken(userId: string): void {
    this.refreshTokens.delete(userId);
  }

  // Study methods
  static async getAllStudies(): Promise<Study[]> {
    return [...this.studies];
  }

  static async getStudyById(id: string): Promise<Study | null> {
    return this.studies.find(study => study.id === id) || null;
  }

  static async createStudy(studyData: any, userId: string): Promise<Study> {
    const newStudy: Study = {
      id: Utils.generateId(),
      ...studyData,
      status: 'draft',
      createdBy: userId,
      createdAt: Utils.getCurrentTimestamp(),
      updatedAt: Utils.getCurrentTimestamp(),
      enrollmentCount: 0,
      targetEnrollment: studyData.targetEnrollment || 100,
    };

    this.studies.push(newStudy);
    return newStudy;
  }

  static async updateStudy(id: string, updateData: any): Promise<Study | null> {
    const studyIndex = this.studies.findIndex(study => study.id === id);
    if (studyIndex === -1) return null;

    this.studies[studyIndex] = {
      ...this.studies[studyIndex],
      ...updateData,
      updatedAt: Utils.getCurrentTimestamp(),
    };

    return this.studies[studyIndex];
  }

  static async deleteStudy(id: string): Promise<boolean> {
    const studyIndex = this.studies.findIndex(study => study.id === id);
    if (studyIndex === -1) return false;

    this.studies.splice(studyIndex, 1);
    return true;
  }

  // Patient methods
  static async getAllPatients(): Promise<Patient[]> {
    return [...this.patients];
  }

  static async getPatientById(id: string): Promise<Patient | null> {
    return this.patients.find(patient => patient.id === id) || null;
  }

  static async createPatient(patientData: any): Promise<Patient> {
    const newPatient: Patient = {
      id: Utils.generateId(),
      ...patientData,
      createdAt: Utils.getCurrentTimestamp(),
      updatedAt: Utils.getCurrentTimestamp(),
      lastVisit: Utils.getCurrentTimestamp(),
    };

    this.patients.push(newPatient);
    return newPatient;
  }

  // Patient matching methods
  static async findPatientMatches(studyId: string): Promise<PatientMatch[]> {
    const study = await this.getStudyById(studyId);
    if (!study) return [];

    const matches: PatientMatch[] = [];

    for (const patient of this.patients) {
      const matchScore = Utils.calculateMatchScore(study.criteria, patient);
      
      if (matchScore > 0) {
        const match: PatientMatch = {
          id: Utils.generateId(),
          patient,
          studyId,
          matchScore,
          matchReasons: this.generateMatchReasons(study.criteria, patient),
          status: 'potential',
          createdAt: Utils.getCurrentTimestamp(),
          updatedAt: Utils.getCurrentTimestamp(),
        };
        matches.push(match);
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  private static generateMatchReasons(criteria: any, patient: any): string[] {
    const reasons: string[] = [];

    // Age match
    if (patient.age >= criteria.ageRange.min && patient.age <= criteria.ageRange.max) {
      reasons.push(`Age ${patient.age} is within range ${criteria.ageRange.min}-${criteria.ageRange.max}`);
    }

    // Gender match
    if (criteria.gender && criteria.gender !== 'any' && patient.gender === criteria.gender) {
      reasons.push(`Gender matches: ${patient.gender}`);
    }

    // Condition match
    if (criteria.conditions && criteria.conditions.length > 0) {
      const matchingConditions = criteria.conditions.filter((condition: string) =>
        patient.conditions.some((patientCondition: string) =>
          patientCondition.toLowerCase().includes(condition.toLowerCase())
        )
      );
      if (matchingConditions.length > 0) {
        reasons.push(`Has required conditions: ${matchingConditions.join(', ')}`);
      }
    }

    return reasons;
  }

  // Dashboard stats methods
  static async getStudyStats(): Promise<StudyStats> {
    const totalStudies = this.studies.length;
    const activeStudies = this.studies.filter(study => study.status === 'active').length;
    const totalEnrollment = this.studies.reduce((sum, study) => sum + study.enrollmentCount, 0);
    const averageEnrollmentRate = totalStudies > 0 
      ? this.studies.reduce((sum, study) => sum + (study.enrollmentCount / study.targetEnrollment * 100), 0) / totalStudies
      : 0;

    const recentActivity: ActivityItem[] = [
      {
        id: '1',
        type: 'study_created',
        description: 'New study "COVID-19 Vaccine Efficacy" was created',
        timestamp: '2025-01-28T10:30:00Z',
        userId: '1',
        studyId: '1',
      },
      {
        id: '2',
        type: 'patient_enrolled',
        description: 'Patient enrolled in "Diabetes Management Study"',
        timestamp: '2025-01-28T09:15:00Z',
        userId: '1',
        studyId: '2',
      },
      {
        id: '3',
        type: 'form_submitted',
        description: 'Data form submitted for patient P001',
        timestamp: '2025-01-28T08:45:00Z',
        userId: '1',
        studyId: '1',
      },
    ];

    return {
      totalStudies,
      activeStudies,
      totalEnrollment,
      averageEnrollmentRate: Math.round(averageEnrollmentRate * 10) / 10,
      recentActivity,
    };
  }

  // Patient Management Methods
  static async getAllPatients(): Promise<Patient[]> {
    return this.patients;
  }

  static async getPatientById(id: string): Promise<Patient | null> {
    return this.patients.find(p => p.id === id) || null;
  }

  static async createPatient(patientData: Partial<Patient>): Promise<Patient> {
    const newPatient: Patient = {
      id: Utils.generateId(),
      firstName: patientData.firstName!,
      lastName: patientData.lastName!,
      age: patientData.age!,
      gender: patientData.gender!,
      phone: patientData.phone!,
      address: patientData.address!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.patients.push(newPatient);
    return newPatient;
  }

  static async updatePatient(id: string, updateData: Partial<Patient>): Promise<Patient | null> {
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.patients[index] = {
      ...this.patients[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return this.patients[index];
  }

  static async deletePatient(id: string): Promise<boolean> {
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.patients.splice(index, 1);
    return true;
  }

  static async searchPatients(criteria: any): Promise<PatientMatch[]> {
    // Mock patient search logic
    return this.patients.slice(0, 5).map(patient => ({
      id: Utils.generateId(),
      patient,
      studyId: 'mock-study',
      matchScore: Math.random() * 100,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  // Form Management Methods
  static async getAllForms(): Promise<any[]> {
    return this.forms;
  }

  static async getFormById(id: string): Promise<any | null> {
    return this.forms.find(f => f.id === id) || null;
  }

  static async createForm(formData: any, userId: string): Promise<any> {
    const newForm = {
      id: Utils.generateId(),
      ...formData,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.forms.push(newForm);
    return newForm;
  }

  static async updateForm(id: string, updateData: any): Promise<any | null> {
    const index = this.forms.findIndex(f => f.id === id);
    if (index === -1) return null;

    this.forms[index] = {
      ...this.forms[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return this.forms[index];
  }

  static async deleteForm(id: string): Promise<boolean> {
    const index = this.forms.findIndex(f => f.id === id);
    if (index === -1) return false;

    this.forms.splice(index, 1);
    return true;
  }

  static async getFormResponses(formId: string): Promise<any[]> {
    // Mock form responses
    return [
      {
        id: Utils.generateId(),
        formId,
        patientId: 'patient-1',
        responses: { question1: 'answer1', question2: 'answer2' },
        submittedAt: new Date().toISOString(),
      },
    ];
  }

  static async submitFormResponse(formId: string, responseData: any, userId?: string): Promise<any> {
    const response = {
      id: Utils.generateId(),
      formId,
      ...responseData,
      submittedBy: userId,
      submittedAt: new Date().toISOString(),
    };

    return response;
  }

  // Match Management Methods
  static async getMatchById(id: string): Promise<PatientMatch | null> {
    return this.matches.find(m => m.id === id) || null;
  }

  static async updateMatchStatus(id: string, status: string, notes?: string): Promise<PatientMatch | null> {
    const index = this.matches.findIndex(m => m.id === id);
    if (index === -1) return null;

    this.matches[index] = {
      ...this.matches[index],
      status: status as any,
      notes,
      updatedAt: new Date().toISOString(),
    };

    return this.matches[index];
  }

  // Token Management
  static storeRefreshToken(userId: string, token: string): void {
    this.refreshTokens.set(userId, token);
  }

  static validateRefreshToken(userId: string, token: string): boolean {
    return this.refreshTokens.get(userId) === token;
  }

  static removeRefreshToken(userId: string): void {
    this.refreshTokens.delete(userId);
  }
}
