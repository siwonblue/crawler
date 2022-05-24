# momuCrawler

모무 소비자조사 참여자 경품추첨을 위한 크롤러

현재 데이터는 구글 스프레드 시트에 저장되어 있어서 그것만 가져와서
경품 추첨을 해주면 되지만, 실제로 다양한 종류의 데이터를 받을 것을 고려해
일반적인 경우까지 다 함께 공부해서 정리

~~IT 창업 동아리답게 팀원들이 랜덤 숫자 불러서 추첨 완료했습니다 ^^~~

**크롤러 공부를 위한 레포로 사용 예정**


## 데이터의 종류

### 1.csv

- csv 파일은 콤마로 key,value 구분된 파일

csv 파일 예시1)

```csv
전시원, 010-XXXX-XXXX
김시원, 010-XXXX-XXXX
```

csv 파일 예시2)

```csv
NAME,AGE
Daffy Duck,24
Bugs Bunny,22
```

- 노드에서는 csv 파일을 읽을 때 csv-parse 를 사용함
- 사용법은 공식문서 참조 (csv-parse npm)
- fs 로 읽고 배열로 만들어 주기만 하면 끝

### 2.엑셀파일

### 파싱

```js
const xlsx = require('xlsx');
```

- xlsx 를 이용하여 엑셀 파일 읽기
- 링크 추출 후 axios 이용해서 브라우저로 요청
- cheerio 이용하여 응답으로 받은 html 파싱
- 원하는 값 추출 후 다시 엑셀파일에 write

# 처리 방식

- for( of array.entries())
- map | forEach => Promise.all 과 함께 사용

- Promise.all 을 이용하면 순서 보장 X, 속도 빠름
- for of 사용하면 순서 보장, 속도 느림

> 여기까지 동작 순서

1. 2차원 배열로 만듦
2. 배열 읽고 브라우저로 이동
3. 그곳에서 html 에 있는 원하는 데이터 추출
4. 그 데이터를 다시 2차원 배열안에 넣어줌
5. csv, xlsx 로 만들어주면 끝


# infinite Scroll crawler

xlsx, csv 파일에 나와있는 특정 주소로 이동하지 않고
특정 웹 사이트에 가서 모든 내용을 다 가져올 때 사용


1. 페이지로 이동
2. 원하는 요소 css 선택자로 선택
3. 필요한 정보 저장 후 element 제거
4. 정보 파일로 저장