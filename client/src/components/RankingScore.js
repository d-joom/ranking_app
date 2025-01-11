import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../App.js';
import { Buffer } from 'buffer';

import '../styles/_css/base.css';
import '../styles/_css/webfont.css';
import '../styles/_css/contents.css';

import QRSample from '../styles/_img/sample/QR.png';
import title1 from '../styles/_img/title-1.png';
import scoreFrame from '../styles/_img/score_frame.png';
import bottomBox from '../styles/_img/bottom_box.png';

import $ from 'jquery';

function RankingScore({newScore, numberImages}) {

    const [loaded, setLoaded] = useState(false);
    const [animate, setAnimate] = useState(false);

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
        return () => {
            clearTimeout(timer);} // 컴포넌트 언마운트 시 타이머 정리
      }, []);
      
  return (
    <div id="wrapper">
		<div id="QR_code"><img src={QRSample} alt="큐알샘플"/></div>
		/* QR */  
		
		<div className="contents" id="scoreCont">
			<div id="title">
				<div id="challengeName"><p><img src={title1} alt="TRIGER RULK'S RAGE"/></p></div>
				<div id="nickName" className="Font-V_Core"><p><span>캡틴</span>{newScore.name}</p></div>
			</div>
			//타이틀
            {loaded?
			<div id="score" className={animate ? 'score-slide-up' : ''}>
				<div className="box" id="score1">
					<div className="frame"><img src={scoreFrame} alt=""/></div>
					{/* <div className="num"><img src={getImageSrc(1, Math.floor(newScore.score / 100))} alt="0" /></div> */}
                    <div className="num"><img src={numberImages[0]} alt={`Image ${0}`} /></div>
				</div>

				<div className="box" id="score2">
					<div className="frame"><img src={scoreFrame} alt=""/></div>
					{/* <div className="num"><img src={getImageSrc(2, Math.floor((newScore.score % 100) / 10))} alt="0" /></div> */}
                    <div className="num"><img src={numberImages[1]} alt={`Image ${0}`} /></div>
				</div>

				<div className="box" id="score3">
					<div className="frame"><img src={scoreFrame} alt=""/></div>
					{/* <div className="num"><img src={getImageSrc(3, newScore.score % 10)} alt="0" /></div> */}
                    <div className="num"><img src={numberImages[2]} alt={`Image ${0}`} /></div>
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
