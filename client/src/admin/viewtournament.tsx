import { useEffect, useState } from "react";
import tournamentService, { type Tournament } from "../services/tournamentservices";

const ViewTournament = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                setLoading(true);
                const tournaments = await tournamentService.getTournaments();
                setTournaments(tournaments);
                console.log("Fetched tournaments:", tournaments);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTournaments();
    }
        , []);


    return (
        <><div className="view-tournament-container">
            <div>{loading && <p>Loading tournaments...</p>}</div>
            <div className="tournament-container">
                <h1 className="text-2xl font-bold mb-4">Manage Tournaments</h1>
                {tournaments.length === 0 ? (
                    <p>No tournaments available.</p>
                ) : (
                    <ul className="tournament-list">
                        {tournaments.map(tournament => (
                            <li key={tournament.id} className="tournament-item">
                                <h2>{tournament.name}</h2>
                                <p>{tournament.sport}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div></>);
}

export default ViewTournament;