import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RankingForm from './components/RankingForm.js';
import RankingList from './components/RankingList.js';

// 상태를 관리할 Context 생성
export const SocketContext = createContext();

function App() {

  const [rankings, setRankings] = useState([]); // 랭킹 데이터 상태
  const [newRanking, setNewRanking] = useState(null);
  const [showList, setShowList] = useState(false);  
  const [refresh, setRefresh] = useState(false); // 새로 고침 상태
  const [socket, setSocket] = useState(null);
  const [messageSent, setMessageSent] = useState(false);  // 메시지 전송 여부 추적

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
        console.log(response.data.message);
        const obj = JSON.parse(response.data.message);
        console.log(obj);
        // setNewRanking({name: obj.uniqueName, score:newRanking.score});
        setNewRanking(newRanking);
        // 최신 데이터를 다시 가져옴
        await fetchRankings();

        setShowList(false); // 새 데이터가 추가되면 list는 숨긴다
        
        console.log(JSON.stringify(newRanking));
        socket.send(JSON.stringify(newRanking));

        setTimeout(() => {
          setRefresh(false);
        }, 1000);
      } catch (error) {
        console.error('Error adding ranking:', error);
      }
    };

    const goList = async() => {
      socket.send(`{"name":"goList"}`);
    }


    // 새 랭킹 추가 후 20초 후에 리스트 보여주기
    useEffect(() => {
      if (newRanking) {
        const timer = setTimeout(() => {
          setShowList(true); // 20초 후에 리스트 페이지를 보이도록 설정
        }, 20000); // 20초 후
        return () => clearTimeout(timer); // timer 클린업
      }
    }, [newRanking]);

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
    <SocketContext.Provider value={{ messageSent }}>
      <Router>
        <div>
          {/* 네비게이션 메뉴 */}
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
            {/* 라우트 설정 */}
            <Routes>
              <Route path="/form" element={<RankingForm onAddRanking={addRanking} goList={goList}/>} />
              <Route
              path="/result"
              key={messageSent}
              element={<>
                {console.log('App.js에서 전달되는 messageSent:', messageSent)}
                <RankingList rankings={rankings} newRanking={newRanking} fetchRankings={fetchRankings}/>
              </>}
            />
            </Routes>
        </div>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
