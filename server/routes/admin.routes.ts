// server/routes/admin.routes.ts
import { Router } from 'express';
import { triggerSync } from '../controllers/admin.controller';

const router = Router();

// POST /api/admin/sync
router.post('/sync', triggerSync);

export default router;