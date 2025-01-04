const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const moment = require('moment-timezone');
const fastcsv = require('fast-csv');

const app = express();
const upload = multer({ dest: 'uploads/' });  // 파일 업로드 위치 설정

app.use(cors());

//JSON 형식의 요청 본문을 처리하기 위한 미들웨어 추가
app.use(express.json());

// 실행 파일 환경에 따라 경로 설정
const isPkg = typeof process.pkg !== 'undefined';

// 클라이언트 빌드 폴더 경로 설정
const staticPath = isPkg
  ? path.join(path.dirname(process.execPath), 'client/build')  // 패키징된 실행 파일 내에서 상대 경로
  : path.join(__dirname, 'client/build');  // 로컬 개발 환경에서는 상대경로 사용

// CSV 파일 경로 설정
const csvFilePath = isPkg
  ? path.join(path.dirname(process.execPath), 'data.csv')  // 패키징된 실행 파일 내에서 상대 경로
  : path.join(__dirname, 'data.csv');  // 로컬 개발 환경에서는 상대경로 사용

// CSV 파일이 없으면 자동으로 생성
if (!fs.existsSync(csvFilePath)) {
  const ws = fs.createWriteStream(csvFilePath);
  const csvStream = fastcsv.format({ headers: true, quote: '"' }); // 헤더를 첫 번째로 추가
  csvStream.pipe(ws);
  csvStream.write(['Name', 'Score', 'Date']); // 헤더 쓰기
  csvStream.end(); // 파일을 종료
}

// POST: 사용자 입력 데이터 업데이트
app.post('/api/ranking', (req, res) => {
    
    const { name, score, date } = req.body;
  
    if (!name || !score) {
      return res.status(400).json({ message: '이름과 점수를 모두 입력해주세요.' });
    }

    // 한국 시간으로 변환 (서버에서 할 경우)
    const koreaTime = moment(date).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'); // 한국 시간으로 포맷팅

    console.log(`\n{name: '${name}',score: '${score}',date: '${koreaTime}'}`);

    const data = `\n${name},${score},${koreaTime}`

    // 파일에 데이터 추가
    fs.appendFile(csvFilePath, data, (err) => {
      if (err) {
        console.error('데이터 추가 중 오류 발생:', err);
      } else {
        console.log('데이터가 성공적으로 추가되었습니다!');
      }
    });

    res.status(200).json({ message: 'Ranking added successfully' });

  });

// 랭킹 데이터를 읽어서 배열로 변환
const readRankingsFromCSV = () => {
  return new Promise((resolve, reject) => {
    const rankings = [];
    fs.createReadStream(csvFilePath)
      .pipe(fastcsv.parse({ headers: true, skipEmptyLines: true }))
      .on('data', (row) => rankings.push(row)) // 각 행을 배열에 추가
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve(rankings); // 데이터를 처리한 후 배열 반환
      })
      .on('error', (err) => {
        reject(err); // 에러 처리
      });
  });
};

// API 엔드포인트: 랭킹 조회
app.get('/api/ranking', async (req, res) => {
  try {
    const rankings = await readRankingsFromCSV(); // CSV에서 랭킹 데이터 읽기
    res.json(rankings); // 배열을 JSON으로 클라이언트에 반환
  } catch (error) {
    console.error('Error reading CSV:', error);
    res.status(500).json({ message: 'Error reading ranking data' });
  }
});

// 서버 설정
app.use(express.static(staticPath));

// 클라이언트의 기본 페이지 제공
app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
