import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/_css/base.css';
import '../styles/_css/webfont.css';
import '../styles/_css/contents.css';

import title1 from '../styles/_img/title-1.png';
import scoreFrame from '../styles/_img/score_frame.png';
import bottomBox from '../styles/_img/bottom_box.png';

function RankingScore({newScore, numberImages}) {

    const [loaded, setLoaded] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [inputName, setInputName] = useState(newScore.name);
    const captureRef = useRef(null);

    useEffect(() => {
      const name = newScore.name.replace(/[a-zA-Z]/g, '');
      setInputName(name);
    },[]);
  
    useEffect(() => {
      // 이미지 프리로드
      const preloadImages = () => {
        return Promise.all(
            numberImages.map((src) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = src;
              img.onload = resolve;
              img.onerror = reject;
            });
          })
        );
      };
  
      preloadImages()
        .then(() => setLoaded(true))
        .catch((err) => console.error('이미지 로드 실패:', err));
    }, [numberImages]);

    useEffect(() => {

        // 0.1초 지연 후 애니메이션 클래스 추가
        const timer = setTimeout(() => setAnimate(true), 100);

        document.addEventListener("DOMContentLoaded", () => {
          const digits = document.querySelectorAll(".box");
          // 뒤에서부터 딜레이를 적용하려면 reverse() 추가
          [...digits].reverse().forEach((digit, index) => {
            digit.style.animationDelay = `${index * 0.3}s`; // 딜레이 추가
          });
        });

        return () => {
            clearTimeout(timer);} // 컴포넌트 언마운트 시 타이머 정리
      }, []);


      
  return (
    <div id="wrapper" ref={captureRef}>
		<div className="contents" id="scoreCont">
			<div id="title">
				<div id="challengeName"><p><img src={title1} alt="TRIGER RULK'S RAGE"/></p></div>
				<div id="nickName" className={`Font-V_Core ${animate ? 'move-up' : ''}`}><p>{inputName}</p></div>
			</div>
			//타이틀
      {loaded?
        <div id="score" className={animate ? '' : ''}>
				<div className="box" id="score1">
					<div className="frame"><img src={scoreFrame} alt=""/></div>
          <div className="num"><img className="digit" src={numberImages[0]} alt={`Image ${0}`} /></div>
				</div>

				<div className="box" id="score2">
					<div className="frame"><img src={scoreFrame} alt=""/></div>
          <div className="num"><img className="digit" src={numberImages[1]} alt={`Image ${0}`} /></div>
				</div>

				<div className="box" id="score3">
					<div className="frame"><img src={scoreFrame} alt=""/></div>
          <div className="num"><img className="digit" src={numberImages[2]} alt={`Image ${0}`} /></div>
				</div>
			</div> : <></>}
			//점수영역
			
			<div id="bottom-smashBox"><img src={bottomBox} alt=""/></div>
		</div>
		//contents
	</div>
  );
};

export default RankingScore;
