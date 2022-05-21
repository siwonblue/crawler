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

// write dir by using fs module
// typical code to mkdir, so recommend to memorize code blow
fs.readdir('screenshot', (err) => {
  if (err) {
    console.error(' screenshot 폴더가 없어서 새로 생성');
    // can use Sync, because this line is in top of code
    // Sync causes blocking, so do not use this in middle of code
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
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36'
    );
    // use add_to_sheet to write data in xlsx file
    add_to_sheet(ws, 'C1', 's', '평점');
    add_to_sheet(ws, 'D1', 's', '이미지');

    // using for( of array.entries()){}
    // do process one by one, so guarantee order but slow
    for ([i, r] of records.entries()) {
      await page.goto(r.링크);
      // after creating page, using page.evaluate to manipulate dom tree
      const result = await page.evaluate(() => {
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
        console.log(`'${r.제목}' 평점 ${result.score.trim()}`);
        const newCell = 'C' + (i + 2);
        add_to_sheet(ws, newCell, 'n', result.score.trim());
      }
      if (result.img) {
        // insert img url into xlsx file
        const newCell = 'D' + (i + 2);
        add_to_sheet(ws, newCell, 's', result.img.replace(/\?.*$/, ''));

        // request axios get, then parsing img buffer
        const imgResult = await axios.get(result.img.replace(/\?.*$/, ''), {
          responseType: 'arraybuffer',
        });
        fs.writeFileSync(`poster/${r.제목}.jpg`, imgResult.data);
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
