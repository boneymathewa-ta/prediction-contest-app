const contestServices = {
    getContestDetails: async (contestId: string) => {
        try {
            const response = await fetch(`/api/contests/${contestId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch contest details');
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching contest details:', error);
            throw error;
        }
    }
};

export default contestServices;