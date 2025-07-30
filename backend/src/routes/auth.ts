import { Router } from 'express';
import { AuthController } from '@/controllers/authController.js';
import { validateRequest } from '@/middleware/validation.js';
import { loginBody, refreshBody } from '@/validation/routeSchemas.js';

const router = Router();

// Auth routes
router.post('/login', validateRequest({ body: loginBody }), AuthController.login);
router.post('/refresh', validateRequest({ body: refreshBody }), AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', AuthController.me);

export default router;
