export interface Tournament {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    sport: string;
    logoUrl: string;
    // add other fields based on your schema
}

const tournamentService = {
    createTournament: async (tournamentData: Partial<Tournament>): Promise<Tournament> => {
        console.log('Creating tournament with data:', tournamentData); // Debug log
        const response = await fetch('/api/tournaments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tournamentData),
        });
        if (!response.ok) {
            throw new Error('Failed to create tournament');
        }
        return response.json();
    },
    getTournaments: async (): Promise<Tournament[]> => {
        const response = await fetch('/api/tournaments');
        if (!response.ok) {
            throw new Error('Failed to fetch tournaments');
        }
        return response.json();
    }
};



export default tournamentService;