# 🗓 드래그&드랍 투두 리스트

## 🏡 Project Repository

[woowa-techcamp-todo-2](https://github.com/woowa-techcamp-2020/todo-2)  
Wiki, Project Board 사용

---

## 📝 기억할 점

### API 호출시 반환 형태 통일

- fetch 함수의 특성상 status code가 먼저 오고 json을 리턴해야 data를 받을 수 있음  
  그래서 status code가 200일 때에만 json을 리턴하도록 설계했는데, 이 함수를 사용하는 입장에서 status code 값이 달라질 때만 리턴값 형태가 달라지면 사용성이 떨어질 것이다.  
  그래서 status code가 달라도 리턴값의 형태는 유지하도록 하였다.

```js
export const loginApi = async (username) => {
  const response = await fetch(
    `${apiUrlBase}/login`,
    METHOD.POST({ username })
  );

  if (response.ok) {
    const data = await response.json();
    return [data, response.status];
  } else {
    return [null, response.status];
  }
};
```

### Event Emitter

- **컴포넌트 간의 통신시 옵저버 패턴 적용**  
  부모 자식 컴포넌트가 아니라면 props를 통해서 데이터를 전송할 수가 없다. 그래서 이번에는 옵저버 패턴을 적용하여 Event Emitter를 사용해보았다.  
   내가 경험이 있는 Vue.js가 사용하는 방법과 유사하게 구현을 해보았다.

```js
class Emitter {
  on(type, callback) {
    this["_on" + type] = this["_on" + type] || [];
    this["_on" + type].push(callback);
  }

  emit(type, args) {
    this["_on" + type] &&
      this["_on" + type].forEach((callback) => {
        callback(args);
      });
  }
}

export default new Emitter();
```

### DOM parser

- **새로운 DOM 객체를 만들때에 DOM Parser를 사용**  
   template literal로 작성된 DOM 객체를 문자열에서 실제 DOM으로 변환해야하는데, 이때 DOM Parser를 사용함

```js
export const templateToElement = (template) => {
  const parser = new DOMParser();

  return parser.parseFromString(template, "text/html").body.firstElementChild;
};
```

### Router

- **간단한 라우터는 간단하게**  
   작업해야 할 API의 개수가 많지 않아서, 라우터를 따로 분리하지 않고 하나의 파일안에 모두 작성함. 개수가 적다보니 훨씬 눈에 잘 들어오는 효과가 있었음

- **모델, 컨트롤러도 마찬가지**

### Drag&Drop

- **Pointer move event**  
   마우스와 터치 이벤트를 모두 지원해주는 이벤트가 Pointer 이벤트. 이를 사용해 모바일과 PC 모두 지원할 수 있도록 함

- **ponter-events: none 를 사용하여 드래그 구현**  
   CSS 속성 중 pointer-events 속성에 none을 주면 해당 DOM 객체는 포인터 이벤트가 적용되지 않음  
   이를 카피한 카드에 적용하면 포인터가 위치한 자리에 있는 DOM 객체를 구할 때 카피된 카드는 제외하고 선택함. 이를 통해 현재 포인터에 위치한 컬럼, 카드를 선택할 수 있게 됨.

  ```scss
  .card.copy {
    position: absolute;
    pointer-events: none;
    opacity: 0.8;
  }
  ```

- **closet, offset 등 Web API 활용**  
   카드의 정 가운데를 기준으로 이동시키기 위해 너비, 높이를 계산함.  
   컬럼, 카드간의 간격으로 인한 오차가 발생하였다. 이는 컬럼 간격, 카드 간격을 계산하여 정 가운데 기준으로 간격만큼의 직사각형을 그리고, 꼭지점 4개를 사용해 겹치는 컬럼과 카드를 계산하였다. 이렇게 하면 컬럼이나 카드가 2개 이상 겹치는 일도 없고, 컬럼, 카드와 겹치지 않는 일도 없도록 했다.

- **Event Delegation**  
   이벤트 위임을 통해 상위 DOM에 이벤트 리스너를 달아주면 된다고 알고, 컴포넌트별로 최상위 DOM 객체에 이베트 리스너를 달았다. 그런데 부모-자식 컴포넌트 관계에서도 자식의 이벤트 리스너를 부모에 달아주는게 좋다는 걸 알게 되었다. 이벤트 위임에는 이벤트 리스너를 자체를 줄이기 위한 목적도 있기 때문에 상위 컴포넌트에만 이벤트 리스너를 달아주는 것이 좋다.  
   처음에는 Card 컴포넌트마다 onClickHandler, onPointermoveHandler 등을 달았었는데, 위 사실을 알게 된 후 Column 컴포넌트로 이벤트 리스너를 이동시키는 리팩토링 과정을 거쳤다. 상위 컴포넌트에 작성한 이벤트 리스너에서 하위 컴포넌트의 메소드를 호출하는 구조가 되었다.

  ```js
  // In Column Component
  // parent : Column, child : CardForm
  onClickHandler(e) {
      if (e.target.classList.contains(COLUMN_CLASS.ADD_BTN)) {
          this.cardForm.toggleCardForm()
          return
      }

      if (e.target.classList.contains(CARD_FORM_CLASS.CANCEL_BTN)) {
          this.cardForm.toggleCardForm()
          return
      }
  }
  ```

## 🧑🏻‍💻 배운 것

- **Webpack, Babel**  
  웹팩과 바벨을 사용해본 적은 있지만, 프레임워크에 의해 감춰져 있거나 잘 모르고 사용을 했다. 이번에는 웹팩과 바벨을 처음부터 설정해봄으로써 사용하는 이유나 사용법에 대해 공부할 수 있었다.

  - **Webpack** : 프로젝트내에 흩어져있는 js 코드, scss 코드 등을 합펴서 하나의 파일로 만들어주는 번들러
  - **Babel** : 최신 자바스크립트 문법을 옛날 브라우저에도 호환되도록 이전 문법으로 번역해주는 트랜스파일러

- **closet, insertBefore, elementFromPoint 등 Web API**  
   Web API 중에서 자주 사용하는 것들만 알고 있었는데, 드래그 앤 드랍을 구현하면서 몰랐던 Web API를 많이 사용하였다. insertBefore와 유사한 insertAfter를 사용하고 싶었는데, 존재하지 않아서 nextElementSilbling을 한 후 insertBefore를 수행하였다.

  - **closet** : 타켓의 부모 DOM 중 셀렉터에 해당하는 가장 가까운 객체를 찾아줌
  - **insertBefore** : 객체의 바로 이전 위치에 객체를 삽입
  - **elementFromPoint** : 포인터가 위치한 지점에 있는 객체를 찾아줌

- **class 기반의 component 작성**  
   지난 프로젝트에서는 function을 사용한 것과 달리 class 기반의 컴포넌트를 작성하였다. class 기반으로 작성하면 constructor에서 초기화를 할 수 있었고, 메소드 선언시 this를 붙이지 않아도 됐다. 프로토타입을 통한 상속이 아닌, 클래스 상속을 할 수 있는 점도 장점인데 이는 이번 프로젝트에선 사용해보지 못 했다.

---

## 🤔 회고

**1. 깃허브 프로젝트를 통한 일정 관리**  
깃허브 프로젝트 보드를 사용하여 일정 관리를 해보았는데 확실히 협업에 도움이 됐다. 이전에도 트렐로, 지라 등의 일정 관리 도구와 깃허브 프로젝트 보드도 사용해봤었는데, 효과적으로 서로 어떤 작업을 하고 있고 어떤 작업이 남았는지 알 수 있어서 좋았다.  
이번 프로젝트에서는 팀원분인 기진님이 재택 근무를 많이 하셨는데, 원격으로도 협업을 하기에 도움이 많이 됐다. 이슈 카드를 통해 현재 작업중인 것을 확인할 수 있었고 업무를 배분하는데에도 효과적이였다.

**2. 화상 스크럼**  
재택 근무를 꽤 많이 진행했는데 아침마다 구글 행아웃으로 화상 스크럼을 진행했다. 확실히 직접 얼굴을 보고 스크럼을 진행하는 것과는 차이가 있었지만, 서로의 상태를 확인하기에는 충분했던 것 같다.  
다만, 페어 프로그래밍이나 코드 리뷰에 있어서는 화상으로 하면 전달력이 조금 떨어지는 것을 느꼈고 확실히 대면했을 때 더 원활한 의사소통을 있을 것 같다는 생각을 했다. 그래도 온라인으로 최대한 협업하려고 했고, 큰 문제 없이 잘 프로젝트가 마무리 됐다.

**3. 문서화 부재의 아쉬움**  
이번 프로젝트는 내가 조금 더 주도적인 면이 있었는데, 내가 문서화에 신경을 많이 쓰지 않아서 팀으로 남긴 문서가 많지 않다. 참고 자료나 기능 개발에 있어서 새로 도입한 기술, 핵심 기술 등을 문서화해서 남겨놓으면 좋았을텐데 조금 아쉽다.

**4. 미리미리 배포하자**  
배포가 익숙한 편이 아니고 기능 개발에 시간이 부족하다보니까 미리 배포를 하지 못 했다. 데모 당일날 배포를 시도했는데, 중간에 실수를 해서 ec2가 먹통이 되어서 처음부터 다시 만들었다. 부랴부랴 배포를 간신히 성공했는데 배포 버전에서 시간 설정이 다르게 나왔다. 개발 환경과 배포 환경에서의 차이를 간과했던 것이다. 그래서 다음에는 미리미리 배포도 해보고 문제를 미리 파악할 필요가 있다고 느꼈다.

**5. 알려줄 수 있다면 최대한 알려주자**  
내가 모르는 부분이 있고 팀원이 모르는 부분이 있을텐데, 알려줄 수 있다면 최대한 적극적으로 알려줘야 함께 성장할 수 있다고 생각한다. 서로 모르는 부분이 다르고 아는 부분이 다른데 서로 채워줄 수 있다면 얼마나 좋은가!
나는 Git이나 CSS 측면에서 조금 더 알고 있는 부분들이 있었는데, 코드 리뷰를 하거나 같이 코딩을 할 때 알고 있는 부분을 최대한 알려주려고 노력했다. 기진님도 많이 알려주어서 고맙다고 하셨고, 나도 그렇게 생각해주셔서 고맙다고 했다. 서로 알려주고 그에 대한 감사함을 표하는게 진짜 좋은 현상이라고 생각하고 이번 프로젝트에서는 그 부분이 가장 뿌듯했다.
