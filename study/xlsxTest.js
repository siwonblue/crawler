const xlsx = require("xlsx");
const cheerio = require("cheerio");
const axios = require("axios");

const workbook = xlsx.readFile("./store/data.xlsx");

const ws = workbook.Sheets.Sheet4;
// console.log(ws["!ref"]);

// console.log(ws);
//  json 을 객체에 넣어줌.
const records = xlsx.utils.sheet_to_json(ws, { header: "A" });
// console.log(records);

// 배열안에 있는 객체 값 처리하는 방식 두 가지

// 1. forEach or map 사용 => 비동기 처리 순서 보장 X (속도 빠름)
// records.forEach((r, i) => {
//   console.log(i, r);
// });

//2. for 에서 array.entries 사용 => 비동기 처리 순서보장 (속도 느림)
// for (const [i, r] of records.entries()) {
//   console.log(i, r.제목, r.링크);
// }
//
// const crawler = async () => {
//   for (const [i, r] of records.entries()) {
//     const res = await axios.get(r.링크);
//     const html = res.data;
//     const $ = cheerio.load(html);
//     const text = $(
//       ".score score_left .star_score #pointNetizenPersentBasic .num9"
//     ).text();
//     console.log(r.제목, text);
//   }
// };
//
// crawler();
