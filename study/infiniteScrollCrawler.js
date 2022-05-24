const fs = require('fs');
const puppeteer = require('puppeteer');
const add_to_sheet = require('./add_to_sheet');
const axios = require('axios');

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size=1500,1100'],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1500,
      height: 1000,
    });

    await page.goto('https://unsplash.com/');
    const result = await page.evaluate(() => {
      // fix scroll to absolute coordinate (0,0) to avoid attach to bottom
      // window.scrollTo(0, 0);
      let img = [];
      // imgEls is type of NodeList
      // can use forEach, Array.form(), more details see MDN
      const imgEls = document.querySelectorAll('.ripi6 div.VQW0y.Jl9NH');
      if (imgEls.length) {
        imgEls.forEach((v) => {
          //
          img.push(v.querySelector('img.YVj9w').src);
          let temp = v.closest('figure');
          const className = temp.closest('div').className;
          if (className === '') {
            temp.closest('div').remove();
          } else if (className === 'ripi6') {
            temp.remove();
          }
        });
      }
      return img;
    });

    console.log(result.length);
    // await page.close();
    // await browser.close();
  } catch (e) {}
};
crawler();
