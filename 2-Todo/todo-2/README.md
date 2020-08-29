# Todo 2 Team

Drag&Drop Todo List

## ✋Team Members
- [![title](https://img.shields.io/badge/DEVLOPER-노기진-123456)](https://github.com/nohgijin)
- [![title](https://img.shields.io/badge/DEVLOPER-최범수-123456)](https://github.com/choibumsu)

------
## 🧞Quick Start

### 1. Clone & Install Packages
```bash
git clone https://github.com/woowa-techcamp-2020/todo-2.git

cd todo-2

npm install
```

### 2. Add secrets.js
Add `secrets.js` to `config` folder

```js
const DB_CONFIG = {
  host: '${mysqlServerIp}',
  user: '${mysqlUser}',
  password: '********',
  database: '${mysqlSchema}',
}

module.exports = { DB_CONFIG }
```

### 3. Run develop server
```bash
npm run dev
```

Then, you can access to your server http://localhost:3000

------

## 기술 스택

**Frontend**
- ![title](https://img.shields.io/badge/-HTML5-E34F26?&logo=html5&logoColor=white)
- ![title](https://img.shields.io/badge/-SCSS-CC6699?&logo=Sass&logoColor=white)
- ![title](https://img.shields.io/badge/-Vanila_javascript-EDD63F?&logo=javascript&logoColor=white)
- ![title](https://img.shields.io/badge/-Webpack-7ac5f1?&logo=Webpack&logoColor=white)
- ![title](https://img.shields.io/badge/-Babel-eece4f?&logo=Babel&logoColor=white)

**Backend**
- ![title](https://img.shields.io/badge/-Node.js-339933?&logo=Node.js&logoColor=white)
- ![title](https://img.shields.io/badge/-Express-191919?&logo=Node.js&logoColor=white)
- ![title](https://img.shields.io/badge/-MySQL-4479A1?&logo=MySQL&logoColor=white)

**ETC**
- ![title](https://img.shields.io/badge/-EC2-232F3E?&logo=Amazon-AWS&logoColor=white)
- ![title](https://img.shields.io/badge/-Github-181717?&logo=Github&logoColor=white)
- ![title](https://img.shields.io/badge/-Slack-4A154B?&logo=Slack&logoColor=white)


------

## 프로젝트 구조

```bash
|--todo-2
    |-- config  
    |
    |-- public  // Frontend
    |   |-- images
    |   |   ...
    |   |
    |   |-- javascripts
    |   |   |-- api
    |   |   |   ...  // api 호출 함수 모음
    |   |   |
    |   |   |-- components
    |   |   |   ...  // 컴포넌트 파일
    |   |   |
    |   |   |-- utils
    |   |   |   ...  // 유틸 함수 모음
    |   |   |
    |   |   |-- index.js  // webpack entry point
    |   |
    |   |-- stylesheets
    |       |-- common
    |       |   ...  // scss 변수, mixin 등 공통 스타일
    |       |
    |       |-- components
    |           ...  // 컴포넌트별 스타일
    |         
    |-- src  // Backend
    |   |-- controller.js  // 라우터 요청에 따른 작업 처리
    |   |-- model.js  // 데이터베이스 작업 처리
    |   |-- router.js
    |
    |-- views
        ...  // pug 파일
```