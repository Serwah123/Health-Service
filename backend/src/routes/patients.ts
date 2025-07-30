import { Router } from 'express';
import { PatientController } from '@/controllers/patientController.js';
import { requireAuth } from '@/middleware/auth.js';
import { validateRequest } from '@/middleware/validation.js';
import { idParam, createPatientBody, searchBody } from '@/validation/routeSchemas.js';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Patient CRUD routes
router.get('/', PatientController.getAllPatients);
router.get('/:id', validateRequest({ params: idParam }), PatientController.getPatientById);
router.post('/', validateRequest({ body: createPatientBody }), PatientController.createPatient);
router.put('/:id', validateRequest({ params: idParam, body: createPatientBody }), PatientController.updatePatient);
router.delete('/:id', validateRequest({ params: idParam }), PatientController.deletePatient);

// Patient-specific routes
router.post('/search', validateRequest({ body: searchBody }), PatientController.searchPatients);
router.get('/:id/medical-history', validateRequest({ params: idParam }), PatientController.getPatientMedicalHistory);

export default router;
