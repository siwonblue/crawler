// 데이터 가져오고 csv 파일에 내용 추가
const fs = require('fs');
const puppeteer = require('puppeteer');
const { stringify } = require('csv-stringify/sync');
const { parse } = require('csv-parse/sync');
// const csv = fs
//   .readFileSync('./store/csv/test.csv')
//   .toString('utf8')
//   .split('\n');
// const records = csv.map((r, i) => {
//   return r.split(',');
// });
// console.log(records);

const csv = fs.readFileSync('./store/csv/test.csv').toString('utf-8');
const records = parse(csv);

const crawler = async () => {
  try {
    const result = [];
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    // 차단을 막기 위해서 userAgent 를 설정해줌
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36'
    );
    for ([i, r] of records.entries()) {
      await page.goto(r[1]);
      // html 에서 텍스트 추출
      const text = await page.evaluate(() => {
        const score = document.querySelector('#pointNetizenPersentBasic');
        if (score) {
          console.log('score', score);
          return score.textContent;
        }
      });
      // 추출된 텍스트가 있다면 배열에 정보 담기
      if (text) {
        result[i] = [r[0], r[1], text];
      }
      page.waitForTimeout(500);
    }

    await page.close();
    await browser.close();
    // result 는 이차원 배열
    // 완성된 배열을 다시 문자열로 만든 후 csv 파일로 생성
    // console.log(result);
    const str = stringify(result);
    fs.writeFileSync('./store/csv/result.csv', str);
  } catch (e) {
    console.error(e);
  }
};
crawler();
