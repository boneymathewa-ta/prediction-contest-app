// server/routes/admin.routes.ts
import { Router } from 'express';
import { triggerSync } from '../controllers/admin.controller';
import { submitUserPrediction } from '../controllers/prediction.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/admin/sync
router.post('/sync', triggerSync);

router.post('/submit', authenticateToken, submitUserPrediction);
export default router;