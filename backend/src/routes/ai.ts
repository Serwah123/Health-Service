import { Router } from 'express';
import { AIController } from '@/controllers/aiController.js';
import { requireAuth } from '@/middleware/auth.js';
import { validateRequest } from '@/middleware/validation.js';
import { generateTextBody, analyzeCriteriaBody, chatBody } from '@/validation/routeSchemas.js';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// AI/GenAI routes
router.post('/generate-text', validateRequest({ body: generateTextBody }), AIController.generateText);
router.post('/analyze-criteria', validateRequest({ body: analyzeCriteriaBody }), AIController.analyzeCriteria);
router.post('/suggest-optimizations', AIController.suggestOptimizations);
router.post('/process-document', AIController.processDocument);
router.post('/chat', validateRequest({ body: chatBody }), AIController.getChatResponse);

export default router;
