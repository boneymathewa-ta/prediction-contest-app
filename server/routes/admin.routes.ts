// server/routes/admin.routes.ts
import { Router } from 'express';
import { triggerSync } from '../controllers/admin.controller';
import { submitUserPrediction } from '../controllers/prediction.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getGlobalLeaderboard } from '../controllers/leaderboard.controller.js';

const router = Router();

// POST /api/admin/sync
router.post('/sync', triggerSync);

router.post('/submit', authenticateToken, submitUserPrediction);

router.get('/leaderboard', authenticateToken, getGlobalLeaderboard);

export default router;