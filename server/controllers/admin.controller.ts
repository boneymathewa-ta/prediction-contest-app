// server/controllers/admin.controller.ts
// server/controllers/admin.controller.ts
import type { Request, Response } from 'express';
import { MatchService } from '../services/match.service.ts';

export const triggerSync = async (req: Request, res: Response) => {
    try {
        console.log('--- 🛠️ Manual Sync Triggered by Admin ---');
        const adminKey = req.headers['x-admin-key'];
        if (adminKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Call the service you already built
        await MatchService.syncLiveScores();

        res.status(200).json({
            success: true,
            message: 'Sync completed successfully'
        });
    } catch (error) {
        console.error('Manual sync failed:', error);
        res.status(500).json({
            success: false,
            message: 'Sync failed',
            error: error.message
        });
    }
};