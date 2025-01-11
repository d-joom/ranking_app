import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../App.js';
import { Buffer } from 'buffer';
import RankingScore from './RankingScore.js';
import { Helmet } from 'react-helmet';

import '../styles/_css/base.css';
import '../styles/_css/webfont.css';
import '../styles/_css/contents.css';

import QRSample from '../styles/_img/sample/QR.png';
import title2 from '../styles/_img/title-2.png';
import rank1 from '../styles/_img/rank_img/1.png';
import rank2 from '../styles/_img/rank_img/2.png';
import rank3 from '../styles/_img/rank_img/3.png';
import rank4 from '../styles/_img/rank_img/4.png';
import rank5 from '../styles/_img/rank_img/5.png';
import rank6 from '../styles/_img/rank_img/6.png';
import rank7 from '../styles/_img/rank_img/7.png';
import rank8 from '../styles/_img/rank_img/8.png';
import rank9 from '../styles/_img/rank_img/9.png';
import rank10 from '../styles/_img/rank_img/10.png';

import title1 from '../styles/_img/title-1.png';
import scoreFrame from '../styles/_img/score_frame.png';
import bottomBox from '../styles/_img/bottom_box.png';

import $ from 'jquery';

function RankingList({ rankings, newRanking, fetchRankings }) {
  const [messageReceived, setMessageReceived] = useState(false); // 메시지 수신 여부 추적
    const [newScore, setNewScore] = useState(null);
    const [isNew, setIsNew] = useState(false);
    const [scoreSecond, setScoreSecond] = useState(0);
    const [numberImages, setNumberImages] = useState([]);
    

    useEffect(() => {
        console.log("isNew : " + isNew + "/refreshed : " + sessionStorage.getItem('refreshed'));
        if (!isNew && sessionStorage.getItem('refreshed') == 'false') {
            console.log("aaa");
          sessionStorage.setItem('refreshed', 'true');
        fetchRankings();
        }
      }, [isNew]);

    useEffect(() => {
        console.log(rankings);
    },[rankings]);

  useEffect(() => {
    if(newScore != null) {
        const numImgs = [
            `/_img/score_num/1-${Math.floor(newScore.score / 100)}.png`,
            `/_img/score_num/2-${Math.floor((newScore.score % 100) / 10)}.png`,
            `/_img/score_num/3-${Math.floor(newScore.score % 10)}.png`
          ];
        setNumberImages(numImgs);
        setIsNew(true);
        setScoreSecond(20);
    }
  },[newScore]);

  useEffect(() => {
    //초가 0보다 크면 1초마다 감소
    if(isNew && scoreSecond > 0) {
        console.log("score!second!" + scoreSecond);
        const timer = setTimeout(() => setScoreSecond(scoreSecond - 1), 1000);
        return () => clearTimeout(timer);
    } else if(isNew && scoreSecond == 0) {
        setIsNew(false);
        sessionStorage.setItem('refreshed', 'false');
    }
  }, [scoreSecond]);

  useEffect(() => {
    // 컴포넌트가 렌더링된 후 jQuery 코드 실행
    $(document).ready(function () {
      $('.list').addClass('up');
    });
    }, [rankings]); // 빈 배열은 useEffect가 처음 렌더링될 때만 실행되게 함

    const getRankingsWithCorrectedRanks = (rankings) => {
        // 점수를 기준으로 내림차순 정렬
        const sortedRankings = [...rankings].sort((a, b) => b.Score - a.Score);
      
        // 순위 계산 (동일 점수는 동일 순위, 그 다음 순위는 건너뛰기)
        let rank = 1;
        const rankedData = sortedRankings.map((ranking, index) => {
          // 동일 점수면 이전 순위와 동일
          if (index > 0 && sortedRankings[index].Score === sortedRankings[index - 1].Score) {
            ranking.rank = sortedRankings[index - 1].rank; // 이전 순위를 할당
          } else {
            ranking.rank = rank; // 새로운 순위 할당
          }
          rank++; // 순위 증가
          return ranking;
        });
      
        // 최대 10개만 반환
        return rankedData.slice(0, 10); // 10개까지만 반환
      };
      
  const rankingsWithRanks = getRankingsWithCorrectedRanks(rankings);

  useEffect(() => {
    // WebSocket 연결을 설정
    const socket = new WebSocket('ws://localhost:8080'); // 서버의 WebSocket URL

    socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });

    socket.addEventListener('message', (event) => {
      if (!messageReceived) { // 메시지를 한 번만 처리
        
        setMessageReceived(true); // 메시지를 처리했으므로 state를 true로 설정
         // Buffer를 문자열로 변환
        
        const data = JSON.parse(event.data);
        if (data.content && data.content.data) {
            const messageContent = Buffer.from(data.content.data).toString('utf-8');
            console.log('Message content:', messageContent);
            const obj = JSON.parse(messageContent);
            if(obj.name === 'goList'){
                setIsNew(false);
                sessionStorage.setItem('refreshed', 'false');
            } else {
                setNewScore(obj);
            }
        } else {
            console.error('data.content.data is undefined');
        }
      }
    });

    socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });

    socket.addEventListener('error', (error) => {
      console.log('WebSocket error:', error);
    });

    return () => {
      socket.close();
    };
  }, []);


  return (
    <div>
      {isNew? 
          <RankingScore newScore={newScore} numberImages={numberImages}/>:
      <div id="wrapper">
      <div id="QR_code"><img src={QRSample} alt="큐알샘플"/></div>
      <div className="contents" id="rankCont">
          <div id="title">
              <div id="challengeName"><p><img src={title2} alt="TRIGER RULK'S RAGE"/></p></div>
          </div>
          <div id="rank_list">
            {rankingsWithRanks.map((ranking, index) => (
            <div className={`list ${index < 3 ? "top3" : ""}`} id={`rank${ranking.rank}`} key={ranking.rank}>
                <div className="number">
                {ranking.rank === 1 ? (
                    <img src={rank1} alt="1st" />
                ) : ranking.rank === 2 ? (
                    <img src={rank2} alt="2nd" />
                ) : ranking.rank === 3 ? (
                    <img src={rank3} alt="3rd" />
                ) : ranking.rank === 4 ? (
                    <img src={rank4} alt="4th" />
                ) : ranking.rank === 5 ? (
                    <img src={rank5} alt="5th" />
                ) : ranking.rank === 6 ? (
                    <img src={rank6} alt="6th" />
                ) : ranking.rank === 7 ? (
                    <img src={rank7} alt="7th" />
                ) : ranking.rank === 8 ? (
                    <img src={rank8} alt="8th" />
                ) : ranking.rank === 9 ? (
                    <img src={rank9} alt="9th" />
                ) : ranking.rank === 10 ? (
                    <img src={rank10} alt="10th" />
                ) : (
                    <></>
                )}
                </div>
                <div className="name">
                {ranking ? <><span>캡틴</span>{ranking.Name}</> : ''}
                </div>
                <div className="score">{ranking ? ranking.Score : '0'}</div>
            </div>
            ))}
        </div>
      </div>
  </div>}
      
    </div>
  );
}

export default RankingList;
