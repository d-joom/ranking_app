import React, { useRef, useEffect, useState } from 'react';

import '../styles/_css/base.css';
import '../styles/_css/webfont.css';
import '../styles/_css/contents.css';

import title1 from '../styles/_img/title-1.png';
import scoreFrame from '../styles/_img/score_frame.png';
import bottomBox from '../styles/_img/bottom_box.png';

import $ from 'jquery';

function RankingScore({newScore, numberImages}) {

    const [loaded, setLoaded] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [inputName, setInputName] = useState(newScore.name);
    // const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const captureRef = useRef(null); // 화면을 캡처할 DOM 요소

    useEffect(() => {
      const name = newScore.name.replace(/[a-zA-Z]/g, '');
      setInputName(name);
    },[]);
  
    // useEffect(() => {
    //   const captureScreen = async () => {
    //     if (!captureRef.current) return;
  
    //     try {
    //       // 화면 캡처
    //       const canvas = await html2canvas(captureRef.current);
    //       const imageData = canvas.toDataURL("image/png");
  
    //       // Blob URL 생성
    //       const blob = await (await fetch(imageData)).blob();
    //       const downloadUrl = URL.createObjectURL(blob);
    //       console.log("downloadUrl : " + downloadUrl );
    //       // ngrok을 통해 접근 가능한 URL을 넣으세요 (예: https://abcd1234.ngrok.io)
    //       const ngrokUrl = "https://4839-112-223-8-52.ngrok-free.app"; // 실제 ngrok URL로 대체
  
    //       // QR 코드 생성 (qrcode 패키지 사용)
    //       QRCode.toDataURL(ngrokUrl, { width: 200 }, (err, url) => {
    //         if (err) {
    //           console.error("QR 코드 생성 실패:", err);
    //           return;
    //         }
    //         setQrCodeUrl(url); // QR 코드 이미지 URL 저장
    //       });
    //     } catch (error) {
    //       console.error("캡처 실패:", error);
    //     }
    //   };
  
    //   captureScreen();
    // }, []);

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
    <div id="wrapper" ref={captureRef}>
      {/* {qrCodeUrl && (
        <div id="QR_code">
          <img src={qrCodeUrl} alt="QR Code" />
        </div>
      )} */}
		
		<div className="contents" id="scoreCont">
			<div id="title">
				<div id="challengeName"><p><img src={title1} alt="TRIGER RULK'S RAGE"/></p></div>
				<div id="nickName" className={`Font-V_Core ${animate ? 'move-up' : ''}`}><p><span>캡틴</span>{inputName}</p></div>
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
