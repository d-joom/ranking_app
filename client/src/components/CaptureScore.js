import React, { useEffect, useState } from 'react';
import '../styles/_css/base.css';
import '../styles/_css/webfont.css';
import '../styles/_css/contents.css';

import { useLocation } from 'react-router-dom';
import RankingScore from './RankingScore';


function CaptureScore() {
  const [newScore, setNewScore] = useState(null);
  const [img, setImg] = useState([]);

  useEffect(() => {
    // 현재 URL의 쿼리 파라미터를 가져옴
    const queryParams = new URLSearchParams(window.location.search);

    // 'newScore'와 'img' 파라미터 값을 가져와서 파싱
    const newScoreParam = queryParams.get('newScore');
    const imgParam = queryParams.get('img');

    // JSON 문자열을 객체로 변환
    if (newScoreParam) {
      try {
        setNewScore(JSON.parse(newScoreParam));
      } catch (error) {
        console.error('Error parsing newScore:', error);
      }
    }

    if (imgParam) {
      try {
        setImg(JSON.parse(imgParam));
      } catch (error) {
        console.error('Error parsing img:', error);
      }
    }
  }, []);
  return (
    <div>{newScore != null && <RankingScore newScore={newScore} numberImages={img}/>}</div>
  );
};

export default CaptureScore;
