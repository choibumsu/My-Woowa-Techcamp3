# Market 15 Team

배민상회 서비스의 로그인, 회원가입을 구현해보자.

## ✋Team Members

- 최범수
- 홍동욱

## 😆 프로젝트 구조

```bash
|--MARKET-15
|-- public
        |-- fonts
        	...
        |-- images
        	...
        |-- stylesheets
        	|-- css
		    ... // 컴파일된 scss파일 저장
        	|-- scss
        	    ... // scss 파일들
        |-- javascripts
	    |-- pages
        	... // page 관련 컴포넌트
            |-- components
        	|-- common
        	    ... // 공통 컴포넌트
        	|-- join
                    ... // join page component
	    |-- utils
	        .. // utils functions
	    |-- api
	        .. // api 관련
|-- src
    |-- config
	|-- db.js // db config
    |-- controllers
        |-- main
	    |-- index.js // API 라우팅 함수
	    |-- main-ctrl.js // 컨트롤러 콜백함수
    |-- user
	|-- index.js
	|-- user-ctrl.js
    |-- model
	|-- user.js
    |-- routes
	|-- index.js // pug 파일 serving 함수
    |-- utils
	|-- constants.js //상수
    |-- views
	... pug 파일들

```

## 🏅 기술 스택

**Frontend**

- VanilaJS
- scss

**Backend**

- express
- levelDB
- pug(template engine)

## 🏃‍♂️Quick Start

### Clone & Install packages
```bash
git clone https://github.com/woowa-techcamp-2020/market-15.git

cd market-15

npm install
```


### Add secret key file

Insert `secrets.js` to `src/config`

```javascript
/* src/config/secrets.js */

const SECRET_KEYS = {
  SESSION_KEY: 'your-secret-key',
}

module.exports = { SECRET_KEYS }
```


### Run express server
```bash
npm run dev
```
Then, you can access to your server http://localhost:4000 or http://127.0.0.1:4000


## 🐣 Project init setting

### Express

#### 1. Setting

**server.js**

```javascript
const express = require('express')
const app = express()
```

`express` 인스턴스 생성

```javascript
app.listen(4000, () => {
  console.log(`Express server has started on port 4000`)
})
```

4000 포트로 서버를 Open

#### 2. Routing

**server.js**

```js
...
const bodyParser = require('body-parser')
const userRoute = require('./controller/user')

app.use(bodyParser.json())
app.use('/', userRoute)
...
```

- `bodyParser`는 req의 body를 파싱해서 우리가 사용할 수 있게 해줌.

**routes/user.js**

```javascript
const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
  res.render('login-page')
})

module.exports = router
```

- `router[HTTP METHOD].('경로', callback)` 형식

- `res.status(number)` : response status 설정
- `res.json(jsonObject)` : JSON 형식으로 response

### Pug

#### 1. Setting

**server.js**

```javascript
app.set('view engine', 'pug')
```

view engine을 pug engine으로 설정한다.

```javascript
app.set('views', path.join(`${__dirname}/../`, 'frontend'))
app.use(express.static(path.join(`${__dirname}/../`, 'frontend')))
```

pug 파일이 들어있는 경로를 설정한다.

#### 2. HTML Serving

**router.js**

```js
router.get('/login', (req, res) => {
  res.render('login-page')
  // 해당 pug 파일을 전송한다.
})
```

`render` 메소드를 사용하여 serving한다. 파일은 `server.js`에서 설정한 경로를 참조한다.

#### 3. Javascript Serving

**login-page.pug**

```pug
doctype html
head
  title woowa-market
#container.col
  h1 &#xBC30;&#xBBFC; &#xC0C1;&#xD68C; &#xB85C;&#xADF8;&#xC778;
  input(class='id-input' placeholder='아이디를 입력해주세요.')
  input(class='password-input' placeholder='비밀번호를 입력해주세요.')
button Login
script(type='module' src='./pages/LoginPage.js')
```

`script` 태그에 경로를 설정하면 해당 경로를 참조하여 js를 실행한다.
