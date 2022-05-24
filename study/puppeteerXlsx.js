// 데이터 가져오고 xlsx 파일에 내용 추가
// puppeteer 이용

const fs = require('fs');
const puppeteer = require('puppeteer');
const xlsx = require('xlsx');
const add_to_sheet = require('./add_to_sheet');
const axios = require('axios');
// parsing data
const workbook = xlsx.readFile('./store/xlsx/data.xlsx');
const ws = workbook.Sheets.영화목록;
// records is 2-D array
const records = xlsx.utils.sheet_to_json(ws);

// 파일 생성하는 스니펫이니까 외워두면 좋음
fs.readdir('screenshot', (err) => {
  if (err) {
    console.error(' screenshot 폴더가 없어서 새로 생성');
    // Sync 코드는 블로킹을 일으키기 때문에 코드 중간에 있으면 좋지 않음
    // sync 가 있긴해도 위쪽이라 not bad
    fs.mkdirSync('screenshot');
  }
});

fs.readdir('poster', (err) => {
  if (err) {
    console.error(' poster 폴더가 없어서 새로 생성');
    fs.mkdirSync('poster');
  }
});

const crawler = async () => {
  try {
    // args 옵션을 이용해서 브라우저 크기 조정
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size=1000,700'],
    });
    const page = await browser.newPage();
    // setViewport 를 이용해서 페이지 크기 조정
    await page.setViewport({
      width: 1000,
      height: 700,
    });
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36'
    );
    // add_to_sheet 를 이용해서 xlsx 파일에 데이터 삽입
    add_to_sheet(ws, 'C1', 's', '평점');
    add_to_sheet(ws, 'D1', 's', '이미지');

    // for of 문을 이용해서 반복문
    // 하나씩 차례대로 실행해서 순서 보장하지만 속도가 느림
    for ([i, r] of records.entries()) {
      await page.goto(r.링크);
      // 페이지를 생성하고 page.evaluate 를 이용해서 DOM tree 조작
      const result = await page.evaluate(() => {
        // get DOM element
        const scoreEl = document.querySelector('#pointNetizenPersentBasic');
        const imgEl = document.querySelector(
          '#content > div.article > div.mv_info_area > div.poster > a > img'
        );
        let score = '';
        let img = '';
        if (scoreEl) {
          score = scoreEl.textContent;
        }
        if (imgEl) {
          img = imgEl.src;
        }
        return { score, img };
      });
      if (result.score) {
        // 평점을 가져오고 그 값을 파일에 저장하기
        console.log(`'${r.제목}' 평점 ${result.score.trim()}`);
        const newCell = 'C' + (i + 2);
        add_to_sheet(ws, newCell, 'n', result.score.trim());
      }
      if (result.img) {
        // xlsx 파일에 이미지 url 저장
        const newCell = 'D' + (i + 2);
        add_to_sheet(ws, newCell, 's', result.img.replace(/\?.*$/, ''));

        // axios get 요청을 통해 버퍼로 가져옴
        const imgResult = await axios.get(result.img.replace(/\?.*$/, ''), {
          responseType: 'arraybuffer',
        });
        // 여기서 Sync 는 파일 아래쪽에 존재하기 때문에 사용해도 not bad
        fs.writeFileSync(`poster/${r.제목}.jpg`, imgResult.data);

        // screenshot
        await page.screenshot({ path: `screenshot/${r.제목}.png` });
      }
    }

    await page.close();
    await browser.close();
    xlsx.writeFile(workbook, './store/xlsx/result.xlsx');
  } catch (e) {
    console.error(e);
  }
};

crawler();
