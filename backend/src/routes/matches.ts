import { Router } from 'express';
import { MatchController } from '@/controllers/matchController.js';
import { requireAuth } from '@/middleware/auth.js';
import { validateRequest } from '@/middleware/validation.js';
import { idParam, findMatchesBody, updateMatchStatusBody } from '@/validation/routeSchemas.js';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Match routes
router.post('/studies/:studyId/find', validateRequest({ params: idParam, body: findMatchesBody }), MatchController.findMatches);
router.get('/:id', validateRequest({ params: idParam }), MatchController.getMatchById);
router.put('/:id/status', validateRequest({ params: idParam, body: updateMatchStatusBody }), MatchController.updateMatchStatus);
router.get('/:id/history', validateRequest({ params: idParam }), MatchController.getMatchHistory);
router.get('/studies/:studyId/export', validateRequest({ params: idParam }), MatchController.exportMatches);

export default router;
