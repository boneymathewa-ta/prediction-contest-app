import { ContestStatus } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
export const ScoringService = {
    /**
     * Settles all contests for a given match after it finishes 
     * - Fetch the final score for the match
     * - For each contest linked to that match, calculate points for each participant based on their answers and the final score
     * - Update participant scores and determine winners
     * @param matchId The ID of the match that just finished
     */
    async settleContest(matchId: string) {
        try {
            console.log(`Starting settlement for match ${matchId}...`);
            // 1. Fetch the final score and details of the match
            const match = await prisma.match.findUnique({
                where: { id: matchId },
                include: {
                    homeTeam: true,
                    awayTeam: true,
                    contests: {
                        include: {
                            participants: true
                        }
                    }
                }
            });
            if (!match) {
                console.error(`Match with ID ${matchId} not found for settlement.`);
                return;
            }
            console.log(`Fetched match details for settlement:`, match);

            // 2. Loop through each contest linked to this match
            for (const contest of match.contests) {
                console.log(`Settling contest ${contest.id} for match ${matchId}...`);
                // 3. For each participant in the contest, calculate points based on their answers and the final score
                for (const participant of contest.participants) {
                    let pointsEarned = 0;
                    // Example scoring logic based on question categories
                    for (const answer of participant.answers) {
                        const question = await prisma.questions.findUnique({
                            where: { id: answer.questionId }
                        });
                        if (!question) continue;
                        // Simple example: if participant's answer matches the actual outcome, they earn points
                        switch (question.category) {
                            case 'WINNER':
                                const actualWinner = match.scoreHome > match.scoreAway ? match.homeTeam.name : match.awayTeam.name;
                                if (answer.selectedOption === actualWinner) {
                                    pointsEarned += question.pointValue;
                                }

                                break;
                            case 'STATS':
                                // Implement logic for stats-based questions
                                break;
                            case 'DISCIPLINE':
                                // Implement logic for discipline-based questions
                                break;
                        }
                    }
                    // 4. Update participant's total points in the database
                    await prisma.participant.update({
                        where: { id: participant.id },
                        data: { totalPoints: participant.totalPoints + pointsEarned }
                    });
                    console.log(`Updated participant ${participant.id} with ${pointsEarned} points.`);
                }
                // 5. Optionally, determine winners and update contest status
                await prisma.contest.update({
                    where: { id: contest.id },
                    data: { status: ContestStatus.SETTLED }
                });
                console.log(`Contest ${contest.id} settled.`);
            }
            console.log(`Settlement completed for match ${matchId}.`);
        } catch (error) {
            console.error(`Error during settlement for match ${matchId}:`, error);
        }
    }
};