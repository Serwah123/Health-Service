import Joi from 'joi';

// Authentication validation schemas
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

// Study validation schemas
export const createStudySchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    'string.min': 'Study title cannot be empty',
    'string.max': 'Study title cannot exceed 200 characters',
    'any.required': 'Study title is required',
  }),
  description: Joi.string().min(1).max(1000).required().messages({
    'string.min': 'Study description cannot be empty',
    'string.max': 'Study description cannot exceed 1000 characters',
    'any.required': 'Study description is required',
  }),
  objectives: Joi.array().items(Joi.string().min(1)).min(1).required().messages({
    'array.min': 'At least one objective is required',
    'any.required': 'Study objectives are required',
  }),
  criteria: Joi.object({
    inclusionCriteria: Joi.array().items(Joi.string().min(1)).min(1).required(),
    exclusionCriteria: Joi.array().items(Joi.string().min(1)).min(1).required(),
    ageRange: Joi.object({
      min: Joi.number().integer().min(0).max(120).required(),
      max: Joi.number().integer().min(0).max(120).required(),
    }).required(),
    gender: Joi.string().valid('male', 'female', 'any').optional(),
    conditions: Joi.array().items(Joi.string()).optional(),
    medications: Joi.array().items(Joi.string()).optional(),
  }).required(),
});

export const updateStudySchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().min(1).max(1000).optional(),
  objectives: Joi.array().items(Joi.string().min(1)).min(1).optional(),
  status: Joi.string().valid('draft', 'active', 'paused', 'completed', 'cancelled').optional(),
  targetEnrollment: Joi.number().integer().min(1).optional(),
  criteria: Joi.object({
    inclusionCriteria: Joi.array().items(Joi.string().min(1)).min(1).optional(),
    exclusionCriteria: Joi.array().items(Joi.string().min(1)).min(1).optional(),
    ageRange: Joi.object({
      min: Joi.number().integer().min(0).max(120).required(),
      max: Joi.number().integer().min(0).max(120).required(),
    }).optional(),
    gender: Joi.string().valid('male', 'female', 'any').optional(),
    conditions: Joi.array().items(Joi.string()).optional(),
    medications: Joi.array().items(Joi.string()).optional(),
  }).optional(),
});

// Patient validation schemas
export const createPatientSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  age: Joi.number().integer().min(0).max(120).required(),
  gender: Joi.string().valid('male', 'female').required(),
  conditions: Joi.array().items(Joi.string()).optional(),
  medications: Joi.array().items(Joi.string()).optional(),
});

// Patient match validation schemas
export const reviewPatientMatchSchema = Joi.object({
  status: Joi.string().valid('eligible', 'ineligible').required(),
  notes: Joi.string().max(500).optional(),
});

// GenAI validation schemas
export const genAIRequestSchema = Joi.object({
  type: Joi.string().valid('criteria_augmentation', 'note_summarization', 'contextual_qa').required(),
  context: Joi.string().required(),
  input: Joi.string().min(1).required(),
  studyId: Joi.string().optional(),
});

// Form validation schemas
export const createFormSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).optional(),
  studyId: Joi.string().required(),
  fields: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      type: Joi.string().valid('text', 'number', 'date', 'select', 'multiselect', 'textarea', 'checkbox').required(),
      label: Joi.string().required(),
      required: Joi.boolean().required(),
      options: Joi.array().items(Joi.string()).optional(),
      validation: Joi.object({
        min: Joi.number().optional(),
        max: Joi.number().optional(),
        pattern: Joi.string().optional(),
        message: Joi.string().optional(),
      }).optional(),
      defaultValue: Joi.any().optional(),
      isPrepopulated: Joi.boolean().optional(),
    })
  ).min(1).required(),
});

export const submitFormSchema = Joi.object({
  formId: Joi.string().required(),
  studyId: Joi.string().required(),
  patientId: Joi.string().required(),
  data: Joi.object().required(),
});

// Export validation schemas
export const exportRequestSchema = Joi.object({
  studyId: Joi.string().required(),
  format: Joi.string().valid('csv', 'excel', 'json').required(),
  includeFields: Joi.array().items(Joi.string()).min(1).required(),
  filters: Joi.object().optional(),
});

// Query parameter validation
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
});

export const searchSchema = Joi.object({
  q: Joi.string().min(1).max(100).optional(),
  status: Joi.string().valid('draft', 'active', 'paused', 'completed', 'cancelled').optional(),
  createdBy: Joi.string().optional(),
});

// Common validation
export const idParamSchema = Joi.object({
  id: Joi.string().required(),
});

// Middleware validation helper
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }
    
    req.validatedData = value;
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Query validation failed',
        errors,
      });
    }
    
    req.validatedQuery = value;
    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Parameter validation failed',
        errors,
      });
    }
    
    req.validatedParams = value;
    next();
  };
};
