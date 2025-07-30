// User and Authentication types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'researcher' | 'admin' | 'clinician';
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Study Management types
export interface Study {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  criteria: StudyCriteria;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  enrollmentCount: number;
  targetEnrollment: number;
}

export interface StudyCriteria {
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  ageRange: {
    min: number;
    max: number;
  };
  gender?: 'male' | 'female' | 'any';
  conditions: string[];
  medications?: string[];
}

export interface CreateStudyRequest {
  title: string;
  description: string;
  objectives: string[];
  criteria: StudyCriteria;
}

export interface UpdateStudyRequest {
  title?: string;
  description?: string;
  objectives?: string[];
  criteria?: StudyCriteria;
  status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  targetEnrollment?: number;
}

// Patient and Matching types
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female';
  conditions: string[];
  medications: string[];
  lastVisit: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientMatch {
  id: string;
  patient: Patient;
  studyId: string;
  matchScore: number;
  matchReasons: string[];
  status: 'potential' | 'reviewed' | 'eligible' | 'ineligible' | 'enrolled';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Form and Dynamic Schema types
export interface DynamicFormField {
  id: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'textarea' | 'checkbox';
  label: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  defaultValue?: any;
  isPrepopulated?: boolean;
}

export interface DynamicFormSchema {
  id: string;
  title: string;
  description?: string;
  fields: DynamicFormField[];
  studyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  studyId: string;
  patientId: string;
  data: Record<string, any>;
  submittedBy: string;
  submittedAt: string;
}

// Dashboard and Analytics types
export interface StudyStats {
  totalStudies: number;
  activeStudies: number;
  totalEnrollment: number;
  averageEnrollmentRate: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'study_created' | 'patient_enrolled' | 'form_submitted' | 'match_reviewed';
  description: string;
  timestamp: string;
  userId: string;
  studyId?: string;
}

// AI and GenAI types
export interface GenAIRequest {
  type: 'criteria_augmentation' | 'note_summarization' | 'contextual_qa';
  context: string;
  input: string;
  studyId?: string;
}

export interface GenAIResponse {
  result: string;
  confidence: number;
  sources?: string[];
  suggestions?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
  studyId?: string;
}

// Export and Data types
export interface ExportRequest {
  studyId: string;
  format: 'csv' | 'excel' | 'json';
  includeFields: string[];
  filters?: Record<string, any>;
}

export interface ExportJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  downloadUrl?: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Request/Response types for specific endpoints
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
}

// Validation schemas
export interface ValidationError {
  field: string;
  message: string;
}

// Middleware types
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Database types (for future use)
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}
