import React, { useRef, useState } from 'react';
import title1 from '../styles/_img/title-1.png';

const RankingForm = ({onAddRanking, goList}) => {
  const [userName, setUserName] = useState('');
  const [userScore, setUserScore] = useState(''); // 점수 상태 추가
  const [message, setMessage] = useState('');
  const usernameRef = useRef(null);

  const handleUserInteraction = () => {
    setTimeout(() => {
      const sound = new Audio('/_sound/bomb.mp3');
    sound.play();
    }, 350);
  };

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
       // 한글 입력기로 유지
       usernameRef.current.setAttribute('lang', 'ko');
    } catch (error) {
      console.error('Error submitting ranking:', error);
      setMessage('랭킹 제출 중 오류가 발생했습니다.');
    }

    handleUserInteraction();
    // 폼 제출 후 사용자 이름 input에 포커스
    // usernameRef.current.focus();
  };

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    // 영문자와 숫자만 제외하는 정규식
    const filteredValue = value.replace(/[a-zA-Z0-9]/g, '');  // 영문자와 숫자를 모두 제거
    setUserName(filteredValue);  // 유효한 값만 상태에 저장
  };

  const handleScoreChange = (e) => {
    const value = e.target.value;
    // 3자리 숫자까지만 허용
    if (value.length <= 3 && /^[0-9]*$/.test(value)) {
      setUserScore(value);  // 유효한 값만 상태에 저장
    }
  };

  return (
    <div id = "wrapper">
      <div id="form_title">
         <div id="challengeName"><p><img src={title1} alt="TRIGER RULK'S RAGE"/></p></div>
      </div>
      <div className="form_content">
      <form onSubmit={handleSubmit} className="Font-V_Core form_wrap">
        <div>
          <label>Name</label>
          <input
            type="text"
            value={userName}
            inputMode="ko"
            lang="ko"
            onChange={handleUserNameChange}
            placeholder="이름 입력"
            ref={usernameRef}
            maxLength={4}
          />
        </div>
        <div>
          <label>Score</label>
          <input
            type="number"
            value={userScore}
            placeholder="점수 입력"
            onChange={handleScoreChange}
          />
        </div>
        <button type="submit">SUBMIT</button>
      </form>
      <p className="form_required">※ 사용자이름은 한글 최대 4자, 점수는 0~999까지 입력 가능</p>
      {message && <p style={{marginTop:'10px'}}>{message}</p>}
      <button className="goListBtn" onClick={goList}>Go to list</button>
      </div>
      
    </div>
  );
};

export default RankingForm;
