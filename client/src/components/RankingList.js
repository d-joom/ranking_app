import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../App.js';
import { Buffer } from 'buffer';

function RankingList({ rankings, newRanking, fetchRankings }) {
  const [currentRankings, setCurrentRankings] = useState([]);
  const { messageSent } = useContext(SocketContext);
  const [messageReceived, setMessageReceived] = useState(false); // 메시지 수신 여부 추적


  // 새로운 랭킹이 추가될 때마다 갱신
  useEffect(() => {
    if (newRanking) {
      setCurrentRankings([newRanking]); // 새로 입력된 데이터만 먼저 표시
    }
  }, [newRanking]);


  useEffect(() => {
    console.log('RankingList props rankings:', rankings);
  }, [rankings]);

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

      <h2>list</h2>
      <table>
          <thead>
            <tr>
              <th>순위</th>
              <th>이름</th>
              <th>점수</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {rankings.length > 0 ? (
              rankings.map((ranking, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
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
    </div>
  );
}

export default RankingList;
