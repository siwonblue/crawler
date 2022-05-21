// csv parser 없이 fs 로 데이터 불러와서 2차원 배열에 담아주기
const fs = require("fs");
const csv = fs.readFileSync("./store/test.csv").toString("utf8");

const result = csv.split("\n").map((c, i) => {
  return c.split(",");
});
result.map((r, i) => {
  console.log(i, r);
});
