import React, { useState } from 'react';

const RankingForm = ({onAddRanking, goList}) => {
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
      const newRanking = {
        name: userName,
        score: parseInt(userScore, 10),
        date: new Date().toISOString(), // 현재 날짜
      };
  
      // 부모 컴포넌트의 addRanking 호출
      onAddRanking(newRanking);
      setUserName('');
      setUserScore('');
    } catch (error) {
      console.error('Error submitting ranking:', error);
      setMessage('랭킹 제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>

      <h2>form</h2>
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
      <button onClick={goList}>Go to list</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RankingForm;
