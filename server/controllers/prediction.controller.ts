
import type { Request, Response } from 'express';
import { PredictionService } from '../services/prediction.service.js';

export const submitUserPrediction = async (req: Request, res: Response) => {
    try {
        const { contestId, answers } = req.body;
        const userId ="1"; //req.user?.id; // Assuming you have user authentication middleware that sets req.user
        if (!contestId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: "Missing required fields or invalid answers format." });
        }
        const result = await PredictionService.submitPrediction(userId, contestId, answers);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error submitting prediction:', error);
        res.status(500).json({ error: 'Failed to submit prediction' });
    }
};