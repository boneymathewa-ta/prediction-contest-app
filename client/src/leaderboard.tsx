import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
    const [data, setData] = useState({ top10: [], currentUser: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch from your Node.js API
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvbmV5bWF0aGV3LmEiLCJhdXRoTWV0aG9kIjoid2luZG93cyIsImlhdCI6MTc3NDUwOTA5MywiZXhwIjoxNzc0NTM3ODkzfQ.orRAx0w6v0KqKxkbWXUcOw7LK-6_-_J_OQ_HgjgiB1s';
        fetch('/api/admin/leaderboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Standings...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 bg-slate-900 text-white rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center border-b border-slate-700 pb-4">
                🏆 Championship Leaderboard
            </h2>

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-slate-400 text-sm uppercase">
                        <th className="p-3">Rank</th>
                        <th className="p-3">Employee</th>
                        <th className="p-3 text-right">Points</th>
                    </tr>
                </thead>
                <tbody>
                    {data.top10.map((player) => (
                        <tr
                            key={player.id}
                            className={`border-b border-slate-800 hover:bg-slate-800 transition-colors ${player.rank <= 3 ? 'bg-slate-800/50' : ''}`}
                        >
                            <td className="p-3 font-bold">
                                {player.rank === 1 && '🥇'}
                                {player.rank === 2 && '🥈'}
                                {player.rank === 3 && '🥉'}
                                {player.rank > 3 && `#${player.rank}`}
                            </td>
                            <td className="p-3">
                                <div className="font-medium">{player.name}</div>
                                <div className="text-xs text-slate-500">{player.contestsPlayed} matches played</div>
                            </td>
                            <td className="p-3 text-right font-mono text-yellow-500 font-bold">
                                {player.totalScore}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* STICKY "MY RANK" SECTION */}
            {data.currentUser && (
                <div className="mt-6 p-4 bg-blue-900/40 border border-blue-500/50 rounded-lg flex justify-between items-center">
                    <div>
                        <span className="text-xs uppercase text-blue-300 block">Your Position</span>
                        <span className="font-bold text-lg">#{data.currentUser.rank} {data.currentUser.name}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs uppercase text-blue-300 block">Total Points</span>
                        <span className="font-bold text-xl text-white">{data.currentUser.totalScore}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;