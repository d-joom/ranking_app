const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const moment = require('moment-timezone');
const fastcsv = require('fast-csv');
const chalk = require('chalk');
const figlet = require('figlet');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const AWS = require('aws-sdk');
const puppeteer = require('puppeteer');

require('dotenv').config();

const app = express();
app.use(cors());
//JSON 형식의 요청 본문을 처리하기 위한 미들웨어 추가
app.use(express.json());

// AWS S3 설정
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = 'ranking-app';

// 화면 캡처 후 S3에 업로드하는 API
app.post('/capture', async (req, res) => {

  const urlToCapture = req.body.url;  // 캡처할 URL을 클라이언트로부터 받는다

  if (!urlToCapture) {
    return res.status(400).send('URL not provided');
  }

  // URL 디코딩
  const decodedUrl = decodeURIComponent(urlToCapture);

  try {
    // Puppeteer로 페이지 캡처
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(decodedUrl, { waitUntil: 'networkidle2' });

    //await page.waitForSelector('body', { timeout: 3000 }); // 대기하는 셀렉터를 body로 설정, 페이지가 준비될 때까지 대기

    // 전체 페이지 캡쳐를 위해 viewport 크기 설정
    await page.setViewport({ width: 1080, height: 1920 });

    const imgName = `screenshot_${Date.now()}.png`;
    const screenshot = await page.screenshot({
      type: 'jpeg',  // JPG 형식으로 저장
      quality: 70,   // 품질 설정 (0-100)
    });

    // S3에 업로드
    const params = {
      Bucket: BUCKET_NAME,
      Key: imgName, // 고유한 파일 이름
      Body: screenshot,
      ContentType: 'image/jpeg'
    };

    const result = await s3.upload(params).promise();

    console.log("S3 Upload Result:", result);
    res.json({ url: result.Location });  // S3에서 반환된 URL을 클라이언트에 전달

    await browser.close();
  } catch (error) {
    console.error('Error capturing and uploading image:', error);
    res.status(500).send('Error capturing screen or uploading to S3');
  }
});

wss.on('connection', (ws) => {
  // 클라이언트로부터 메시지를 받으면
  ws.on('message', (message) => {
    // 모든 클라이언트에 메시지 전송
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'message', content: message }));
      }
    });
  });

  // 서버에서 클라이언트에게 JSON 형식으로 응답
  ws.send(JSON.stringify({ type: 'greeting', content: 'Hello! Connected to the WebSocket server' }));
});

// 실행 파일 환경에 따라 경로 설정
const isPkg = typeof process.pkg !== 'undefined';

// 클라이언트 빌드 폴더 경로 설정
// const staticPath = isPkg
//   ? path.join(path.dirname(process.execPath), 'client/build')  // 패키징된 실행 파일 내에서 상대 경로
//   : path.join(__dirname, 'client/build');  // 로컬 개발 환경에서는 상대경로 사용
const staticPath = path.join(__dirname, 'client/build');

// CSV 파일 경로 설정
const csvFilePath = isPkg
  ? path.join(path.dirname(process.execPath), 'data.csv')  // 패키징된 실행 파일 내에서 상대 경로
  : path.join(__dirname, 'data.csv');  // 로컬 개발 환경에서는 상대경로 사용

// const csvFilePath = path.join(path.dirname(process.execPath), 'data.csv');

// CSV 파일이 없으면 자동으로 생성
if (!fs.existsSync(csvFilePath)) {
  const ws = fs.createWriteStream(csvFilePath, { encoding: 'utf8' });
  ws.write('\uFEFF');
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

     // 이름 중복 처리
     let uniqueName = name;
      // 파일 읽기
  fs.readFile(csvFilePath, 'utf8', (err, fileData) => {
    if (err) {
      console.error('파일 읽기 중 오류 발생:', err);
      return res.status(500).json({ message: '파일 읽기 중 오류가 발생했습니다.' });
    }

    // CSV 데이터 파싱
    const existingNames = fileData
      .trim()
      .split('\n')
      .map((line) => line.split(',')[0]); // 첫 번째 열은 이름

    if (existingNames.includes(name)) {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let index = 0;
      while (existingNames.includes(uniqueName)) {
        uniqueName = `${name}${alphabet[index]}`;
        index++;
        if (index >= alphabet.length) {
          return res.status(500).json({ message: '중복 처리 중 알파벳이 부족합니다.' });
        }
      }
    }
    // 한국 시간으로 변환 (서버에서 할 경우)
    const koreaTime = moment(date).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'); // 한국 시간으로 포맷팅

    console.log(`\n{name: '${uniqueName}',score: '${score}',date: '${koreaTime}'}`);

    const data = `\n${uniqueName},${score},${koreaTime}`

    // 파일에 데이터 추가
    fs.appendFile(csvFilePath, data, 'utf8', (err) => {
      if (err) {
        console.error('데이터 추가 중 오류 발생:', err);
      } else {
        console.log('데이터가 성공적으로 추가되었습니다!');
      }
    });

    res.status(200).json({ message: `{"message" : "Ranking added successfully","uniqueName":"${uniqueName}", "score":"${score}"}` });
  })

  });

// 랭킹 데이터를 읽어서 배열로 변환
const readRankingsFromCSV = () => {
  return new Promise((resolve, reject) => {
    const rankings = [];
    fs.createReadStream(csvFilePath)
      .pipe(fastcsv.parse({ headers: true, skipEmptyLines: true }))
      .on('data', (row) => rankings.push(row)) // 각 행을 배열에 추가
      .on('end', () => {
        // console.log('CSV file successfully processed');
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

    // 정렬: score 기준 내림차순 정렬, 동일 score일 경우 timestamp 기준 내림차순 정렬
    const sortedRankings = rankings.sort((a, b) => {
      if (b.Score === a.Score) {
        // 동일 score일 경우 timestamp 비교 (내림차순)
        return new Date(b.Date) - new Date(a.Date);
      }
      return b.Score - a.Score; // score 기준 내림차순
    });

    res.json(sortedRankings); // 배열을 JSON으로 클라이언트에 반환
  } catch (error) {
    console.error('Error reading CSV:', error);
    res.status(500).json({ message: 'Error reading ranking data' });
  }
});

// 서버 설정
app.use(express.static(staticPath));

// 클라이언트의 기본 페이지 제공
app.get('*', (req, res) => {
  // `index.html` 파일 경로
  const indexPath = path.join(staticPath, 'index.html');

  try {
    const html = fs.readFileSync(indexPath, 'utf8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Page not found');
  }
});

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
    console.log(chalk.green(`서버가 http://localhost:${PORT}에서 구동 중입니다.`));
});

// 화려한 텍스트 출력
figlet('CAPTAIN AMERICA', { font: 'slant' }, (err, data) => {
  if (err) {
    console.log('Error generating ASCII art');
    return;
  }

  console.log(chalk.blue(data));  // 파란색 아스키 아트 텍스트 출력
  console.log(chalk.green.bold('SERVER running on 5000...'));  // 초록색, 굵은 글씨
  console.log(chalk.yellow('=============================='));  // 노란색 구분선
});