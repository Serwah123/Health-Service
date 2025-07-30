// Simplified route validation schemas for immediate use
import Joi from 'joi';

// Basic parameter validation
export const idParam = Joi.object({
  id: Joi.string().uuid().required(),
});

// Auth validation
export const loginBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const refreshBody = Joi.object({
  refreshToken: Joi.string().required(),
});

// Study validation  
export const createStudyBody = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(1).max(1000).required(),
  objectives: Joi.array().items(Joi.string()).min(1).required(),
  criteria: Joi.object({
    inclusionCriteria: Joi.array().items(Joi.string()).min(1).required(),
    exclusionCriteria: Joi.array().items(Joi.string()).min(1).required(),
    ageRange: Joi.object({
      min: Joi.number().integer().min(0).required(),
      max: Joi.number().integer().max(120).required(),
    }).required(),
  }).required(),
});

export const updateStudyBody = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().min(1).max(1000).optional(),
  objectives: Joi.array().items(Joi.string()).min(1).optional(),
  criteria: Joi.object({
    inclusionCriteria: Joi.array().items(Joi.string()).min(1).optional(),
    exclusionCriteria: Joi.array().items(Joi.string()).min(1).optional(),
    ageRange: Joi.object({
      min: Joi.number().integer().min(0).optional(),
      max: Joi.number().integer().max(120).optional(),
    }).optional(),
  }).optional(),
});

// Patient validation
export const createPatientBody = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  age: Joi.number().integer().min(0).max(150).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().default('US'),
  }).required(),
});

export const searchBody = Joi.object({
  criteria: Joi.object({
    ageRange: Joi.object({
      min: Joi.number().integer().min(0).optional(),
      max: Joi.number().integer().max(150).optional(),
    }).optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    conditions: Joi.array().items(Joi.string()).optional(),
  }).required(),
});

// Form validation
export const createFormBody = Joi.object({
  studyId: Joi.string().uuid().required(),
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(1000).optional(),
  type: Joi.string().valid('baseline', 'followup', 'adverse_event', 'custom').required(),
  schema: Joi.object().required(),
  status: Joi.string().valid('draft', 'active', 'inactive').default('draft'),
});

export const submitFormResponseBody = Joi.object({
  patientId: Joi.string().uuid().optional(),
  responses: Joi.object().required(),
});

// Match validation
export const findMatchesBody = Joi.object({
  criteria: Joi.object().optional(),
});

export const updateMatchStatusBody = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected', 'enrolled').required(),
  notes: Joi.string().max(1000).optional(),
});

// AI validation
export const generateTextBody = Joi.object({
  prompt: Joi.string().min(10).max(2000).required(),
  context: Joi.object().optional(),
});

export const analyzeCriteriaBody = Joi.object({
  criteria: Joi.object().required(),
  studyContext: Joi.object().optional(),
});

export const chatBody = Joi.object({
  message: Joi.string().min(1).max(1000).required(),
  conversationHistory: Joi.array().items(Joi.object()).optional(),
  context: Joi.object().optional(),
});

// Export validation
export const exportPatientsBody = Joi.object({
  patientIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
});

export const generateReportBody = Joi.object({
  reportType: Joi.string().valid('enrollment', 'safety', 'efficacy', 'summary').required(),
  dateRange: Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
  }).optional(),
});
