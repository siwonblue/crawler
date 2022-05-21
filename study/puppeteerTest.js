const puppeteer = require('puppeteer');
const fs = require('fs');

const csv = fs.readFileSync('./store/test.csv').toString('utf8');

const result = csv.split('\n').map((c, i) => {
  return c.split(',');
});
result.map((r, i) => {
  // console.log(i, r);
});

const crawler = async () => {
  const browser = await puppeteer.launch({ headless: false });

  // 모든 비동기 요청을 동시에 실행하지만 순서가 보장되지 않음
  const [page, page2, page3] = await Promise.all([
    browser.newPage(),
    browser.newPage(),
    browser.newPage(),
  ]);

  // 모든 비동기 요청을 동시에 실행하지만 순서가 보장되지 않음
  await Promise.all([
    page.goto('https://naver.com'),
    page2.goto('https://google.com'),
    page3.goto('https://inflearn.com'),
  ]);

  // 비동기 처리라서 순서 보장이지만 속도가 느림
  // await page.goto("https://naver.com");
  // await page.goto("https://google.com");
  // await page.goto("https://inflearn.com");

  await Promise.all([
    page.waitForTimeout(3000),
    page2.waitForTimeout(3000),
    page3.waitForTimeout(3000),
  ]);

  await browser.close();
};
// crawler();
