import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RankingList = () => {
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        const fetchRankings = async () => {
            const result = await axios.get('http://localhost:5000/data');
            setRankings(result.data);
        };

        fetchRankings();
    }, []);

    return (
        <div>
            <h2>Ranking List</h2>
            <ul>
                {rankings.map((row, index) => (
                    <li key={index}>{`${row.Rank} - ${row.Name}: ${row.Score} (${row.Date})`}</li>
                ))}
            </ul>
        </div>
    );
};

export default RankingList;
