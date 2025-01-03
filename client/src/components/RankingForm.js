import React, { useState } from 'react';
import axios from 'axios';

const RankingForm = () => {
  const [userName, setUserName] = useState('');
  const [userScore, setUserScore] = useState(''); // 점수 상태 추가
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !userScore) {
      setMessage('사용자 이름과 점수를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/ranking', {
        name: userName,
        score: userScore,
        date: new Date().toISOString()
      });
      setMessage(response.data.message);
      setUserName('');
      setUserScore('');
    } catch (error) {
      console.error('Error submitting ranking:', error);
      setMessage('랭킹 제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2>랭킹 입력</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>사용자 이름:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="이름 입력"
          />
        </div>
        <div>
          <label>점수:</label>
          <input
            type="number"
            value={userScore}
            onChange={(e) => setUserScore(e.target.value)}
            placeholder="점수 입력"
          />
        </div>
        <button type="submit">제출</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RankingForm;
