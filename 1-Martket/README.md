# 🔑 배민 상회 로그인 시스템 구현

## 🏡 Project Repository

[woowa-techcamp-market-15](https://github.com/woowa-techcamp-2020/market-15)  
[Github Wiki](https://github.com/woowa-techcamp-2020/market-15/wiki/Convention)

---

## 📝 기억할 점

### SCSS

- **SCSS 변수를 정의해 놓고 어디에 사용되는지 주석 남기기**

```scss
/* font */
$font-main: "Noto Sans KR";

/* colors */
// input normal border, placeholder
$color-gray-300: #d7dbe6;

// button border
$color-gray-400: #cccccc;

$color-gray-500: #bbc0cd;

// help text, button border
$color-gray-600: #898989;

// outter border
$color-gray-700: rgb(70, 70, 70);
```

- **SCSS 변수와 Mixin만 정의된 파일 앞에는 '\_'를 붙여서 컴파일되지 않도록 함**

```
_definitions.scss
```

### fetch 함수 커스텀

- **요청 메소드마다 공통부분을 함수화하여 사용**  
   이번에는 POST 요청만 사용했지만, GET, PATCH, POST, DELETE에도 적용하면 좋다.

```js
const METHOD = {
  POST(data) {
    return {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    };
  },
};
```

- **fetch 함수 자체도 웹핑하여 사용**  
   fetch 함수 특성상 response가 먼저 도착하고, 그 후에 json() 리턴을 통해 data를 불러옴.  
   따라서 이를 웹핑하여 응답만 필요한 경우와 데이터가 필요한 경우를 분리
  api 요청 함수들도 여기서 정의하면 어떤 api들을 사용하는지 한 눈에 볼 수 있음

```js
const api = (() => {
  const request = (url, config) => {
    return fetch(url, config);
  };
  const requestWithReturn = (url, config) =>
    request(url, config).then((response) => response.json());
  return {
    checkIdDuplication(id) {
      return request("/user/duplicatuon", METHOD.POST({ id }));
    },
    requestJoin(args) {
      return request("/user", METHOD.POST(args));
    },
    requestLogin(id, password) {
      return request("user/auth", METHOD.POST({ id, password }));
    },
  };
})();
```

- **상수를 분리하자**  
   js 코드 내에서 사용할 클래스명, 태그 이름 등의 상수값은 `constants.js` 에서 관리

```js
export const CLASS_NAME = {
  ERROR_CLASS: "error",
  SUCCESS_CLASS: "success",
  ACTIVE_CLASS: "active",
  INPUT_WRAPPER_CLASS: "input-wrapper",
  ERROR_MESSAGE_CLASS: "error-message",
};
```

- **컴포넌트 구조**  
   바닐자 자바스크립트로 컴포넌트를 작성

```js
export default function example(props) {
    this.init = () => {
        this.setElements()
        this.bindEvent()
    }

    this.setElements = () => {
        this.$target = document.querySelector('.example')
        this.$button = this.$target.querySelector('button')
        .
        .
    }

    this.bindEvent = () => {
        this.$target.addEventListener('click', this.onClickListener.bind(this))
        .
        .
    }

    this.onClickListener = (e) => {
        // action
    }

    this.init()
}
```

- **validate 함수를 컴포넌트마다 선언**  
   사용자가 정보를 입력하는 부분을 검증해야 하는데, 검증을 해야하는 컴포넌트에는 `validate`라는 이름의 메소드를 포함하도록 구성  
   제출하는 부분에서 컴포넌트들의 validate 메소드만 호출할 수 있도록 추상화

## 🧑🏻‍💻 배운 것

- **HTTP Status Code**  
   HTTP 상태 코드에 대해 어렴풋이 알았는데, 이번에 프로젝트를 통해 어떤 상태 코드들이 있는지 살펴보게 되었다.  
   [MDN HTTP Status Code](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)

- **Session, Cookie, Token**  
   로그인 기능을 구현하려고 보니, 로그인 정보를 어디에 저장할지 고민하게 되었다.  
   로컬 스토리지, 쿠키, 세션의 차이를 잘 몰랐었는데 이번 기회에 공부를 해보았고,  
   세션이 등장한 이유, 토큰이 등장한 이유에 대해 동욱이형이 잘 설명해줘서 고마웠다.

- **Event Delegation**  
   프레임워크를 많이 쓰다보니 이벤트 위임을 해야 하는 이유를 잘 몰랐었는데,
  바닐라 자바스크립트로 코딩을 하다보니 이벤트 위임을 해야 하는 이유와 하는 방법을 알게 되었다.

  - **이벤트 위임이란?** 이벤트에 대한 리스너를 상위 DOM에 추가해놓는 것  
     **사용하는 이유** 새로운 DOM이 추가될 때마다 이벤트 리스너를 달아주지 않아도 되고, 이벤트 리스너의 개수를 줄일 수 있기 때문  
     **어떻게 사용** 이벤트 리스너를 상위 DOM 객체에 추가하고, 리스너 내부에서 DOM 객체를 판별하여 해당 객체에서 수행할 동작을 지정

- **Express, pug**  
   Express 백엔드는 아예 처음해보는 것인데 공부할 좋은 기회가 되었다. Express 공식 사이트를 보면서 따라했고, pug 템플릿 엔진도 공식 사이트를 참고했다.  
   폴더 구조는 express-generator의 구조를 많이 참고했다. 서버 구축에 대해 어렴풋이 배웠던 것 같다.

- **Fast Fail**  
   이번 프로젝트를 하면서 Fast Fail에 대해 알게 되었는데, 함수를 더 이상 수행할 필요가 없어지면 빠르게 리턴해버리는 기법이다.  
   if문의 깊이가 깊어지지 않고, 함수 수행 조건들이 앞쪽으로 몰려서 조금 더 이해하기 쉬운 기법인 것 같다.

  ```js
  // No!
  function a(value) {
    if (value) {
      // do something
    }
  }

  // Yes!!
  function a(value) {
    if (!value) return;

    // do something
  }
  ```

---

## 🤔 회고

**1. 동료**  
 우테캠에서 첫번째 팀 프로젝트고, 팀 인원도 2명 밖에 없어서 팀원이 어떤 사람일까 많이 궁금했는데 동욱이형이라는 좋은 사람을 만나서 다행이였다.  
 동욱이형은 배려심이 굉장히 높고, 자신이 알고 있는 것을 나에게 적극적으로 알려주었다.
함께 프로젝트르 진행하면서 끝나는 것이 아쉬울 정도로 잘 맞는 팀원이였다. (동욱이형도 그렇게 생각해주면 좋겠다.. ㅎㅎ)  
 첫 프로젝트를 하면서 '좋은 동료가 되는 것'이 목표가 되었다. 팀으로 합을 맞추는 것은 정말 힘든 일이지만, 이번 팀 프로젝트에서는 굉장히 즐거웠다.
아무래도 동욱이형이 많이 배려해주었고, 나도 그에 맞게 많이 배려하려고 노력했기 때문인 것 같다.

**2. Vanilla JavaScript**  
 바닐라 자바스크립트만으로 프로젝트를 진행한 경험도 많지는 않은데, 컴포넌트 기반으로 한 적은 전혀 없었다.  
 동욱이형이 예전에 작성했던 투두리스트 코드을 보면서 컴포넌트 기반의 바닐라 자바스크립트 코딩을 했는데,
바닐라 자바스크립트만으로도 굉장히 짜임새 있게 코딩할 수 있다는 것을 느꼈다.

**3. 코드 리뷰**  
 누군가가 내 코드를 이렇게 치밀하게 봐준 적이 없는데 이번 프로젝트에서 처음으로 상세한 코드리뷰를 받아 보았다.
팀원과의 코딩 스타일이 많은 부분에서 달랐고, 코드 리뷰를 통해 스타일을 맞춰갈 수 있었다.
굉장히 상세하게 코드를 봐주는 동욱이형 덕분에 안 좋은 습관들도 찾을 수 있었고 코드를 많이 개선할 수 있었던 것 같다.
