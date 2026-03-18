import { prisma } from '../lib/prisma.js';

export const PredictionService = {
    // Placeholder for any prediction-related logic you might want to add in the future
    // For example, you could add methods to calculate points for a prediction based on the final score
    // server/services/prediction.service.ts

    async submitPrediction(userId: string, contestId: string, answers: { questionId: string, selectedOption: string }[]) {
        //1. check if user exists in the database
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            await prisma.user.create({
                data: {
                    id: userId,
                    name: userId, // Replace with actual name logic if needed
                    email: `${userId}@travancoreanalytics.com`,
                    role: 'USER'
                }
            });

        }

        // 2. Check if the contest is still OPEN
        const contest = await prisma.contest.findUnique({
            where: { id: contestId },
            include: { match: true }
        });

        if (!contest || contest.status !== 'OPEN') {
            throw new Error("Contest is closed or not found.");
        }

        // 3. Prevent late entries (Match must be in the future)
        if (new Date(contest.match.matchDate) < new Date()) {
            throw new Error("Match has already started. Predictions locked!");
        }

        // 4. Create or Update the Participant record
        const participant = await prisma.participant.upsert({
            where: {
                userId_contestId: { userId, contestId }
            },
            update: {},
            create: { userId, contestId }
        });

        // 5. Create the Answer records
        const answerPromises = answers.map(a =>
            prisma.answer.upsert({
                where: {
                    participantId_questionId: {
                        participantId: participant.id,
                        questionId: a.questionId
                    }
                },
                update: { answer: a.selectedOption },
                create: {
                    participantId: participant.id,
                    questionId: a.questionId,
                    answer: a.selectedOption
                }
            })
        );

        await Promise.all(answerPromises);
        return { message: "Predictions saved successfully!" };
    }
};