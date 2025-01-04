import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RankingForm from './components/RankingForm.js';
import RankingList from './components/RankingList.js';

function App() {

  const [rankings, setRankings] = useState([]); // 랭킹 데이터 상태
  const [newRanking, setNewRanking] = useState(null);
  const [showList, setShowList] = useState(false);

   // 랭킹 데이터를 가져오는 함수
   const fetchRankings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ranking');
      setRankings(response.data); // 받아온 데이터를 rankings 상태에 저장
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };
  
    // 컴포넌트가 처음 렌더링될 때 데이터 가져오기
    useEffect(() => {
      fetchRankings();
    }, []);

      // 데이터를 추가할 때 호출되는 함수
    const addRanking = async (newRanking) => {
      try {
        // 서버에 새로운 데이터 전송
        await axios.post('http://localhost:5000/api/ranking', newRanking);
        // 최신 데이터를 다시 가져옴
        await fetchRankings();

        setNewRanking(newRanking); // 새로운 랭킹을 state로 저장
        setRankings((prevRankings) => [...prevRankings, newRanking]); // 랭킹 목록에 추가
        setShowList(false); // 새 데이터가 추가되면 list는 숨긴다

      } catch (error) {
        console.error('Error adding ranking:', error);
      }
    };


      // 새 랭킹 추가 후 20초 후에 리스트 보여주기
    useEffect(() => {
      if (newRanking) {
        const timer = setTimeout(() => {
          setShowList(true); // 20초 후에 리스트 페이지를 보이도록 설정
        }, 20000); // 20초 후
        return () => clearTimeout(timer); // timer 클린업
      }
    }, [newRanking]);

  return (
    <Router>
      <div>
        {/* 네비게이션 메뉴 */}
        <nav>
          <ul>
            <li>
              <Link to="/form">점수 입력</Link>
            </li>
            <li>
              <Link to="/list">랭킹 목록</Link>
            </li>
          </ul>
        </nav>

        {/* 라우트 설정 */}
        <Routes>
          <Route path="/form" element={<RankingForm onAddRanking={addRanking} />} />
          <Route
          path="/result"
          element={<RankingList rankings={rankings} newRanking={newRanking} showList={true} />}
        />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
