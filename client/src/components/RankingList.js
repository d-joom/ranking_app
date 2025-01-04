import React, { useEffect, useState } from 'react';

function RankingList({ rankings, newRanking, showList, onShowList }) {
  const [currentRankings, setCurrentRankings] = useState([]);

  // 새로운 랭킹이 추가될 때마다 갱신
  useEffect(() => {
    if (newRanking) {
      setCurrentRankings([newRanking]); // 새로 입력된 데이터만 먼저 표시
    }
  }, [newRanking]);

  // 랭킹 목록이 표시될 때
  useEffect(() => {
    if (showList) {
      setCurrentRankings(rankings); // 전체 랭킹 목록으로 갱신
    }
  }, [showList, rankings]);

  return (
    <div>
      <h2>랭킹 목록</h2>
      {newRanking && !showList && (
        <div>
          <h3>새로운 랭킹:</h3>
          <p>이름: {newRanking.Name}</p>
          <p>점수: {newRanking.Score}</p>
          <p>날짜: {newRanking.Date}</p>
          <button onClick={onShowList}>전체 랭킹 보기</button>
        </div>
      )}
      {showList && (
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>점수</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {currentRankings.length > 0 ? (
              currentRankings.map((ranking, index) => (
                <tr key={index}>
                  <td>{ranking.Name}</td>
                  <td>{ranking.Score}</td>
                  <td>{ranking.Date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">랭킹이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RankingList;
