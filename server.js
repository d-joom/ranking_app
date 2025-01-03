const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const fastcsv = require('fast-csv');

const app = express();
const upload = multer({ dest: 'uploads/' });  // 파일 업로드 위치 설정

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
    fastcsv.write([['Name', 'Score', 'Date']], { headers: true }).pipe(ws);
}

// POST: 사용자 입력 데이터 업데이트
app.post('/api/ranking', (req, res) => {
    
    const { name, score, date } = req.body;
  
    if (!name || !score) {
      return res.status(400).json({ message: '이름과 점수를 모두 입력해주세요.' });
    }

    // 한국 시간으로 변환 (서버에서 할 경우)
    const koreaTime = moment(date).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'); // 한국 시간으로 포맷팅

    console.log(`{name: '${name}',score: '${score}',date: '${koreaTime}'}`);

    const newRow = `${name},${score},${koreaTime}\n`;
  
    // CSV 파일에 데이터 추가
    fs.appendFile(csvFilePath, newRow, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: '데이터 저장 중 오류가 발생했습니다.' });
      }
      res.status(200).json({ message: '랭킹이 성공적으로 저장되었습니다.' });
    });
  });

// GET: CSV 파일 내용 읽기
app.get('/data', (req, res) => {
    const rows = [];
    fs.createReadStream(csvFilePath)
        .pipe(fastcsv.parse({ headers: true, skipEmptyLines: true }))
        .on('data', (row) => rows.push(row))
        .on('end', () => res.json(rows));
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
