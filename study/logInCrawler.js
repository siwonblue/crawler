const dotenv = require('dotenv');
const puppeteer = require('puppeteer');
dotenv.config();
const crawler = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1000,700'],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 700,
  });

  await page.goto('https://saint.sogang.ac.kr/irj/portal');
  await page.evaluate(() => {
    document.querySelector('#login_id').value = process.env.SOGANG_ID;
    document.querySelector('#login_pw').value = process.env.SOGANG_PWD;
    document.querySelector('li.btn > a').click();
  });
  await page.close();
  await browser.close();
};

crawler();
