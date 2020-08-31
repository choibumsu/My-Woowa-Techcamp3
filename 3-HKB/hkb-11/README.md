# HKB 11 Team

결제내역 관리 프로젝트  
**[팀 협업 노션](https://www.notion.so/bumsu/HKB-11-Team-Notion-a979dd1fb6e14cd5a30382c58403de47)**

## ✋Team Members
- [![title](https://img.shields.io/badge/DEVLOPER-전수현-123456)](https://github.com/agrajak)
- [![title](https://img.shields.io/badge/DEVLOPER-최범수-123456)](https://github.com/choibumsu)

------

## Team Rules

👉🏻 [In here](https://github.com/woowa-techcamp-2020/hkb-11/wiki/Ground-Rule)

------
## 🧞Quick Start

### 1. Clone & Install Packages
```bash
git clone https://github.com/woowa-techcamp-2020/hkb-11.git

cd hkb-11

npm install
```

### 2. Add .env
Add `.env` to root folder

```
DB_HOST= *.*.*.*
DB_USER= agrajak
DB_PASSWORD= ********
DB_DATABASE= hkb 
```

### 3. Run server
**Develop mode**
```bash
npm run dev
```

automatically open http://localhost:9000

**Production mode**
```bash
npm start
```

Then, you can access to your server http://localhost:3000

------

## 👨🏻‍💻 기술 스택
**Common**
- ![title](https://img.shields.io/badge/-TypeScript-007ACC?&logo=TypeScript&logoColor=white)
- ![title](https://img.shields.io/badge/-NPM-CB3837?&logo=NPM&logoColor=white)
- ![title](https://img.shields.io/badge/-ESLint-4B32C3?&logo=ESLint&logoColor=white)
- ![title](https://img.shields.io/badge/-Prettier-F7B93E?&logo=Prettier&logoColor=white)


**Frontend**
- ![title](https://img.shields.io/badge/-HTML5-E34F26?&logo=html5&logoColor=white)
- ![title](https://img.shields.io/badge/-SCSS-CC6699?&logo=Sass&logoColor=white)
- ![title](https://img.shields.io/badge/-Webpack-7ac5f1?&logo=Webpack&logoColor=white)
- ![title](https://img.shields.io/badge/-Babel-eece4f?&logo=Babel&logoColor=white)

**Backend**
- ![title](https://img.shields.io/badge/-Node.js-339933?&logo=Node.js&logoColor=white)
- ![title](https://img.shields.io/badge/-Express-191919?&logo=Node.js&logoColor=white)
- ![title](https://img.shields.io/badge/-Passport-32dd65?&logo=Node.js&logoColor=white)
- ![title](https://img.shields.io/badge/-MySQL-4479A1?&logo=MySQL&logoColor=white)

**ETC**
- ![title](https://img.shields.io/badge/-EC2-232F3E?&logo=Amazon-AWS&logoColor=white)
- ![title](https://img.shields.io/badge/-Github-181717?&logo=Github&logoColor=white)
- ![title](https://img.shields.io/badge/-Notion-000000?&logo=Notion&logoColor=white)
- ![title](https://img.shields.io/badge/-Slack-4A154B?&logo=Slack&logoColor=white)


------

## Frontend Architecture

### MVC 패턴
- Model
- View
- Component (=Controller)

### Observer 패턴
- Model : Observable Class
- Component : Model 구독
- Model의 변화가 생기면 구독한 Component에 연락
- Component는 자신이 가지고 있는 View의 핸들러를 호출
- View의 핸들러는 자신의 화면을 조작하는 역할을 담당

**Model과 View의 연결을 느슨하게 함**

------

## Database

### ERD
![ERD](./doc/erd.png)

------
## 협업 방식

### 1. Notion
![ERD](./doc/notion.png)

[HKB Team 11 Notion Check It Out!](https://www.notion.so/bumsu/HKB-11-Team-Notion-a979dd1fb6e14cd5a30382c58403de47)


------

### 2. Github Project Board
![Github_board](./doc/github_board.png)

- Github Board를 통해 이슈를 생성
- 이슈에 라벨과 마일스톤 등록 후 업무 분할
- 컴포넌트별로 이슈를 만들고, 해당 컴포넌트에서 수행해야 하는 모든 동작을 이슈에 작성
- 이슈 내용에 체크박스를 통해 팀원이 세부적인 진행사항을 파악할 수 있도록 함

------

### 3. Slack

![slack](./doc/slack.png)

- Github에서 이슈 생성 및 종료, 풀리퀘스트 등록 및 머지 등의 작업마다 슬랙 메세지 전송

------

### 4.Pair Programming

![pair](https://gmlwjd9405.github.io/images/agile-pair-programming/real-pair-programming.png)

- 폴더 구조 설계, DB Table 설계, HTML 마크업 등의 작업을 페어 프로그래밍으로 진행
- Thanks to Lenovo Monitor

------

### 5. Code Convention

아래 모든 것들의 컨벤션을 정의하고 작업
- branch, issue, commit message
- file name, class name, variable name
- function name
  - HTMLElement 변수는 `$`로 시작한다.
  - 버튼에 할당된 이벤트핸들러는 행위를 기준으로 `bind+명사+동사+handler` 라고 정한다.  (ex. `.button-add-invoice` -> `bindAddInvoiceHandler` )


