import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getGlobalLeaderboard = async (req: Request, res: Response) => {
    try {
        // 1. Fetch all users and their participant records
        const users = await prisma.user.findMany({
            include: {
                participants: {
                    select: {
                        totalPoints: true
                    }
                }
            }
        });

        // 2. Map and Calculate total scores
        const leaderboard = users.map(user => {
            const totalScore = user.participants.reduce((sum, p) => sum + p.totalPoints, 0);
            return {
                id: user.id,
                username: user.email,
                name: user.name,
                totalScore: totalScore,
                contestsPlayed: user.participants.length
            };
        });

        // 3. Sort by score (Descending)
        const sortedLeaderboard = leaderboard.sort((a, b) => b.totalScore - a.totalScore);

        // 4. Add Rank (1st, 2nd, 3rd...)
        const rankedLeaderboard = sortedLeaderboard.map((player, index) => ({
            rank: index + 1,
            ...player
        }));

        //  res.json(rankedLeaderboard);
        console.log("Ranked leaderboard", rankedLeaderboard);
        const myRank = rankedLeaderboard.find(p => p.id === (req as any).username);
        //console.log("my rank", myRank);
        return res.json({
            top10: rankedLeaderboard.slice(0, 10),
            currentUser: myRank || null
        });


    } catch (error) {
        console.error("Leaderboard Error:", error);
        return res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
};