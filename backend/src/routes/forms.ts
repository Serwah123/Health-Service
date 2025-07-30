import { Router } from 'express';
import { FormController } from '@/controllers/formController.js';
import { requireAuth } from '@/middleware/auth.js';
import { validateRequest } from '@/middleware/validation.js';
import { idParam, createFormBody, submitFormResponseBody } from '@/validation/routeSchemas.js';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Form CRUD routes
router.get('/', FormController.getAllForms);
router.get('/:id', validateRequest({ params: idParam }), FormController.getFormById);
router.post('/', validateRequest({ body: createFormBody }), FormController.createForm);
router.put('/:id', validateRequest({ params: idParam, body: createFormBody }), FormController.updateForm);
router.delete('/:id', validateRequest({ params: idParam }), FormController.deleteForm);

// Form-specific routes
router.get('/:id/responses', validateRequest({ params: idParam }), FormController.getFormResponses);
router.post('/:id/responses', validateRequest({ params: idParam, body: submitFormResponseBody }), FormController.submitFormResponse);
router.post('/validate-schema', FormController.validateFormSchema);

export default router;
