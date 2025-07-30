import { Router } from 'express';
import { StudyController } from '@/controllers/studyController.js';
import { requireAuth } from '@/middleware/auth.js';
import { validateRequest } from '@/middleware/validation.js';
import { idParam, createStudyBody, updateStudyBody } from '@/validation/routeSchemas.js';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Study CRUD routes
router.get('/', StudyController.getAllStudies);
router.get('/:id', validateRequest({ params: idParam }), StudyController.getStudyById);
router.post('/', validateRequest({ body: createStudyBody }), StudyController.createStudy);
router.put('/:id', validateRequest({ params: idParam, body: updateStudyBody }), StudyController.updateStudy);
router.delete('/:id', validateRequest({ params: idParam }), StudyController.deleteStudy);

// Study-specific routes
router.get('/:id/stats', validateRequest({ params: idParam }), StudyController.getStudyStats);
router.get('/:id/matches', validateRequest({ params: idParam }), StudyController.getPatientMatches);

export default router;
