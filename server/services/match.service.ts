import axios from 'axios';
// Adjust based on your prisma client location
import { prisma } from '../lib/prisma.js';
import { ScoringService } from './scoring.service.js';

const SPORTS_DB_BASE_URL = `https://www.thesportsdb.com/api/v1/json/${process.env.SPORTS_DB_KEY}`;

export const MatchService = {
    /**
     * Fetches the latest scores for all LIVE matches and updates the DB
     */
    async syncLiveScores() {
        try {
            console.log(" Service function started");
            // 1. Get all matches currently marked as LIVE or starting soon in your DB
            const activeMatches = await prisma.match.findMany({
                where: {
                    status: { in: ['LIVE', 'SCHEDULED'] },
                    // Optional: only fetch if matchDate is today
                },
            });
            console.log(activeMatches.length + " active matches found for syncing.");
            if (activeMatches.length === 0) return;

            for (const match of activeMatches) {
                // 2. Query TheSportsDB for this specific event
                // Note: TheSportsDB uses 'id' for event lookups
                const response = await axios.get(`${SPORTS_DB_BASE_URL}/lookupevent.php?id=${match.externalId}`);
                const apiMatch = response.data.events?.[0];
                console.log(`Fetched data for match ${match.id} from API:`, apiMatch);

                if (!apiMatch) continue;
                console.log(`API match status: ${apiMatch.strStatus}`);
                if (apiMatch.strStatus === 'Match Finished' || apiMatch.strStatus === 'FT') {
                    // 1. Update status to FINISHED in your DB
                    await prisma.match.update({
                        where: { id: match.id },
                        data: {
                            status: 'FINISHED',
                            scoreHome: parseInt(apiMatch.intHomeScore || 0),
                            scoreAway: parseInt(apiMatch.intAwayScore || 0)
                        }
                    });

                    await ScoringService.settleContest(match.id);
                    // 3. Update Match in Prisma
                    const updatedMatch = await prisma.match.update({
                        where: { id: match.id },
                        data: {
                            scoreHome: parseInt(apiMatch.intHomeScore || 0) || 0,
                            scoreAway: parseInt(apiMatch.intAwayScore || 0) || 0,
                            // Map API status (FT = Finished, Live = Live) to your Prisma Enum
                            status: apiMatch.strStatus === 'FT' || apiMatch.strStatus === 'Match Finished' ? 'FINISHED' : 'LIVE',
                        },
                    });
                    console.log(`Updated match ${updatedMatch} in DB with latest scores and status.`);
                    // 4. Trigger Point Settlement if match just finished
                    if (updatedMatch.status === 'FINISHED') {
                        console.log(`Match ${match.id} finished. Triggering settlement...`);
                        // await SettlementService.settleMatch(match.id); 
                    }
                }
            }
        }
        catch (error) {
            console.error("Error syncing live scores:", error);
        }
    },


    /**
     * Used by React to get the latest match details via your Express route
     */
    async getMatchDetails(matchId: string) {
        return await prisma.match.findUnique({
            where: { id: matchId },
            include: {
                homeTeam: true,
                awayTeam: true,
                contests: true,
            },
        });
    }
};