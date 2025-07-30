import { Router } from 'express';
import { ExportController } from '@/controllers/exportController.js';
import { requireAuth } from '@/middleware/auth.js';
import { validateRequest } from '@/middleware/validation.js';
import { idParam, exportPatientsBody, generateReportBody } from '@/validation/routeSchemas.js';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Export routes
router.get('/studies/:studyId', validateRequest({ params: idParam }), ExportController.exportStudyData);
router.post('/patients', validateRequest({ body: exportPatientsBody }), ExportController.exportPatientData);
router.get('/forms/:formId/responses', validateRequest({ params: idParam }), ExportController.exportFormResponses);
router.post('/reports/:studyId', validateRequest({ params: idParam, body: generateReportBody }), ExportController.generateReport);

export default router;
