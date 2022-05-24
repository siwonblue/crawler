const fs = require('fs');
const puppeteer = require('puppeteer');
const add_to_sheet = require('./add_to_sheet');
const axios = require('axios');
const xlsx = require('xlsx');

fs.readdir('imgs', (err) => {
  if (err) {
    console.error(' imgs 폴더가 없어서 새로 생성');
    // Sync 코드는 블로킹을 일으키기 때문에 코드 중간에 있으면 좋지 않음
    // sync 가 있긴해도 코드 위쪽이라 not bad
    fs.mkdirSync('imgs');
  }
});

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

    let result = [];
    while (result.length < 60) {
      const srcs = await page.evaluate(() => {
        // 화면을 (0,200) 으로 고정
        window.scrollTo(0, 200);

        let imgs = [];
        // imgEls is type of NodeList
        // NodeList 는 어레이는 아닌데 iterable 해서 forEach 사용가능, map 은 불가
        // 자세한 사항은 MDN 문서 참조
        const imgEls = document.querySelectorAll('.ripi6 div.VQW0y.Jl9NH');
        if (imgEls.length) {
          imgEls.forEach((v) => {
            // 이미지 소스 담기
            imgs.push(v.querySelector('img.YVj9w').src);

            // 인피니티 스크롤링을 위해서 소스 정보 담은 element 제거
            let temp = v.closest('figure');
            const className = temp.closest('div').className;
            if (className === '') {
              temp.closest('div').remove();
            } else if (className === 'ripi6') {
              temp.remove();
            }
          });
        }
        return imgs;
      });
      result = result.concat(srcs);
      // figure 태그가 새로 로딩될 때 까지 기다리는 명령어
      // await page.waitForSelector('figure');
    }
    // add_to_sheet(ws, 'A1', 's', '번호');
    // add_to_sheet(ws, 'B1', 's', '주소');
    // for (const [src, i] of result) {
    //   let newNumCell = 'A' + i + 2;
    //   let newSrcCell = 'B' + i + 2;
    //   add_to_sheet(ws, newNumCell, 'n', i + 1);
    //   add_to_sheet(ws, newSrcCell, 'n', src.replace(/\?.*$/, ''));
    // }

    // 버퍼 형식으로 받은 다음에 파일로 만드는 코드
    // for (const src of result) {
    //   const result = await axios.get(src, {
    //     responseType: 'arraybuffer',
    //   });
    //   fs.writeFileSync(`imgs/${new Date().valueOf()}.jpge`, result.data);
    // }
    console.log(result.length);
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};
crawler();
