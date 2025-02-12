import React, { useState, useEffect, createContext  } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import RankingForm from './components/RankingForm.js';
import RankingList from './components/RankingList.js';
import CaptureScore from './components/CaptureScore.js';

// 상태를 관리할 Context 생성
export const SocketContext = createContext();

function App() {

  const [rankings, setRankings] = useState([]); // 랭킹 데이터 상태
  const [socket, setSocket] = useState(null);
  const [messageSent, setMessageSent] = useState(false);  // 메시지 전송 여부 추적
  const location = useLocation(); // 현재 경로를 가져옴

  // 조건부로 nav를 표시
  const showNav = location.pathname === '/';

   // 랭킹 데이터를 가져오는 함수
   const fetchRankings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ranking');
      if (JSON.stringify(response.data) !== JSON.stringify(rankings)) {
        setRankings(response.data);
      }
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };
  
    // 컴포넌트가 처음 렌더링될 때 데이터 가져오기
    useEffect(() => {
      fetchRankings();
    }, []);

    useEffect(() => {
      console.log("messageSent --- " + messageSent);
      if(messageSent){
        // window.location.reload();
      }
    }, [messageSent]);

      // 데이터를 추가할 때 호출되는 함수
    const addRanking = async (newRanking) => {
      try {
        // 서버에 새로운 데이터 전송
        const response = await axios.post('http://localhost:5000/api/ranking', newRanking);
        const returnData = JSON.parse(response.data.message);
        // console.log(returnData.uniqueName);
        // setNewRanking({"name" : returnData.uniqueName,
        //   "score" : returnData.score
        // });
        // 최신 데이터를 다시 가져옴
        await fetchRankings();

        socket.send(JSON.stringify({"name" : returnData.uniqueName,
          "score" : returnData.score
        }));

      } catch (error) {
        console.error('Error adding ranking:', error);
      }
    };

    const goList = async() => {
      socket.send(`{"name":"goList"}`);
    }

    useEffect(() => {
      // 웹소켓 연결
      const ws = new WebSocket('ws://localhost:8080');
      
      ws.addEventListener('open', () => {
        console.log('WebSocket connection established');
      });
  
      // socket 상태 업데이트
      setSocket(ws);
  
      // 웹소켓 연결이 종료되었을 때의 처리
      ws.addEventListener('close', () => {
        console.log('WebSocket connection closed (App.js)');
        alert("WebSocket connection closed. ")
      });
  
      return () => {
        if (ws) {
          ws.close();  // 컴포넌트가 unmount될 때 소켓 연결 종료
        }
      };
    }, []);

    useEffect(() => {
      console.log('App.js에서 messageSent:', messageSent);

    }, [messageSent]);

  return (

        <div>
          {/* 네비게이션 메뉴 */}
          {showNav ? 
          <div id="wrapper" className="home form_content">
            <nav>
              <ul>
                <li>
                  <Link to="/form">점수 입력</Link>
                </li>
                <li>
                  <Link to="/result">랭킹 목록</Link>
                </li>
              </ul>
            </nav>
          </div> : <></>}
            {/* 라우트 설정 */}
            <Routes>
              <Route path="/form" element={<RankingForm onAddRanking={addRanking} goList={goList}/>} />
              <Route
              path="/result"
              key={messageSent}
              element={<>
                <RankingList rankings={rankings} fetchRankings={fetchRankings}/>
              </>}
            />
              <Route path="/capture" element={<CaptureScore/>} />
            </Routes>
        </div>
  );
}

export default App;
