
<h1 align="center">레진엔터테인먼트 프론트엔드 과제 👋</h1>

<br>


## :wrench: 사용 스택과 선정 이유

- NextJS `13.4.19` => 검색 엔진 최적화가 가능하며, Mock API를 만들 수 있습니다. 부분적으로 SSR을 적용할 수 있으며, Image 최적화를 손쉽게 할 수 있습니다.

- ReactJS `18.2.0` => 생산성이 좋고 Component별로 관리하여 유지보수가 편하고 가독성이 좋습니다.

- Emotion `11.11.1` => CSS in JS 방식이 가독성이 좋고, Styled Component방식은 Styled Element와 Component간의 구분이 모호하고(둘 다 대문자로 시작 & 하이라이팅 색 같음) 무엇보다 NextJS에서 추가적인 설정이 필요없습니다.

- Typescript `5.1.6` => 타입을 강제하여 안정성 높은 프로그래밍이 가능합니다.

- React-Query `3.39.3` => data fetch에 관련된 많은 기능들을 제공합니다. 직접 핸들링 하는 것 보다 생산성이 좋고 직관적입니다.

<br>
<br>

##  :speech_balloon:상세 설명

### 렌더링 방식

> 부분적으로 SSR을 적용하여 최소한의 검색 엔진 최적화를 신경썼습니다. <br>웹툰 data fetch의 경우, DB에서 데이터를 꺼내와 html을 사전렌더링할 때까지 유저가 빈페이지를 보기 때문에, fetch 하는 동안 다른 UI와 skeleton UI를 사전 렌더링하여 유저가 기다리는 시간동안 fetch 중임을 인지하고 다른 정보를 습득할 수 있도록 합니다.

### Mock API

> Mock Data를 배열로 합쳐 page에 맞는 인덱스 데이터를 리턴합니다. 숫자가 아닌 값이 들어오면 에러를 리턴하고, 클라이언트는 에러를 출력 후 새로고침합니다.

### 무한 스크롤

> Intersection Observer를 custom Hook으로 만들어 웹툰 리스트의 마지막 엘리먼트를 관찰합니다. <br> 마지막 엘리먼트가 viewport에 보이면 다음 페이지 데이터를 fetch합니다. <br>
data fetching은 react-query의 useInfiniteQuery로 연속적으로 페이지를 fetch합니다. <br>
페이지가 마지막이라면 마지막 페이지 안내 문구를 렌더링합니다.

### 필터링

> 필터 버튼 4개의 상태와 정보를 state로 관리합니다. 필터에 맞는 조건은 필터 키와 매핑하여 메소드로 만들었습니다. <br>
필터 버튼이 눌리거나, 필터가 눌린 상태로 데이터가 fetch 됐을 때 필터링을 수행합니다.
<br> 필터링을 위해 원본 데이터와 필터링된 데이터를 따로 관리합니다.

### 테스트

> jest와 react-testing-library를 이용하여 단위 테스트를 진행했습니다. 필터 버튼이 올바른 웹툰을 렌더링하는지, 무한스크롤이 올바른 페이지를 가져오는지 테스트할 수 있습니다.

### 기타

- 시멘틱 마크업을 통해 SEO를 달성했습니다.
- 버튼과 같은 공통 UI는 common Style로 분리했으며, 프로젝트 기본 컬러를 css 변수로 설정했습니다.
- 404페이지를 만들어 index로 리다이렉트 시켰습니다.

<br>
<br>


## :question:트러블 슈팅

### 필터링 이슈
 
 > 필터가 적용된 상태에서 다음 페이지를 fetch했을 때, 필터에 일치하는 데이터가 없으면 이미 관찰 중인 target이 viewport에 들어왔기 때문에 추가적인 fetch가 일어나지 않았습니다. <br>
 이를 해결하기 위해, 필터링된 데이터가 있을 때까지 계속해서 다음 페이지를 fetch 하도록 개발했습니다.

### 렌더링 이슈

> skeleton UI를 렌더링하고, data가 fetch되면 data를 렌더링합니다. <br> 이 때, skeleton UI가 사라지면서 스크롤이 줄어들었다가, data가 렌더링되고 스크롤이 원상복구되면서 Blink(깜빡임) 현상이 일어났습니다.
처음엔 스크롤을 고정하는 방식으로 접근했지만, 렌더링 순서에 문제가 있음을 깨닫고, useLayoutEffect를 사용하여 paint되기전에 data state를 업데이트 하여 해결했습니다.


<br>
<br>

## :clipboard: 컨벤션

### Git Commit 컨벤션

```
feat        : 기능 (새로운 기능)
fix         : 버그 (버그 수정)
refactor    : 리팩토링
design      : CSS 등 사용자 UI 디자인 변경
comment     : 필요한 주석 추가 및 변경
style       : 스타일 (코드 형식, 세미콜론 추가: 비즈니스 로직에 변경 없음)
docs        : 문서 수정 (문서 추가, 수정, 삭제, README)
test        : 테스트 (테스트 코드 추가, 수정, 삭제: 비즈니스 로직에 변경 없음)
chore       : 기타 변경사항 (빌드 스크립트 수정, assets, 패키지 매니저 등)
init        : 초기 생성
install     : 라이브러리 설치
rename      : 파일 혹은 폴더명을 수정하거나 옮기는 작업만 한 경우
remove      : 파일을 삭제하는 작업만 수행한 경우
```

### 코드 컨벤션

```
네이밍 : 카멜케이스
css : inline css 금지 , css 템플릿은 컴포넌트 상단, styled 방식 사용 x
props : props가 한개인 경우를 제외하고 interface 생성
※ 기타 컨벤션은 prettier과 eslint를 따랐습니다.
```

<br>
<br>

## :file_folder:폴더 구조
```
src
├── components
|  ├── ComicBox.tsx
|  ├── ComicsContainer.tsx
|  ├── ComicSkeleton.tsx
|  ├── FilterBox.tsx
|  └── Header.tsx
├── hooks
|  └── useIntersectionObserver.tsx
├── interfaces
|  ├── comicsInterface.ts
|  └── filterInterface.ts
├── pages
|  ├── 404.tsx
|  ├── api
|  |  └── comics
|  |     ├── drama.ts
|  |     └── romance.ts
|  ├── datas
|  |  ├── drama
|  |  |  └── dramaComicDatas.ts
|  |  └── romance
|  |     └── romanceComicDatas.ts
|  ├── ranking.tsx
|  ├── _app.tsx
|  └── _document.tsx
├── styles
|  ├── commonStyles.ts
|  └── globals.ts
└── test
   └── App.test.spec.tsx
```

<br>
<br>

## :runner: 설치 및 시작

```bash
$ npm install
$ npm run dev
```

### 단위 테스트
```
$ npm run test
```

### 접속

```
 http://localhost:3000
```

