# 🗄 결제내역 관리 가계부

## 🏡 Project Repository

[woowa-techcamp-hkb-11](https://github.com/woowa-techcamp-2020/hkb-11)  
[Team Notion](https://www.notion.so/bumsu/HKB-11-Team-Notion-a979dd1fb6e14cd5a30382c58403de47)  
[Github Project](https://github.com/woowa-techcamp-2020/hkb-11/projects/2)  
Slack에 Github 연동하여, Issue, PR에 대한 알림을 받음

---

## 📝 기억할 점

### 개발환경과 배포환경 나누기

- **Webpack 빌드 파일 분기**  
  개발환경과 배포환경을 나누는 것은 당연한 것이지만, 지난 프로젝트에 적용하지는 못 했었는데 이번 프로젝트에는 분기를 했다.

  ```bash
  webpack.common.js
  webpack.dev.js
  webpack.prod.js
  ```

- **scss 분기**  
  dev 환경에서는 css 파일을 만들지 않아서, MiniCssExtractPlugin이 동작하지 않았다.
  그래서 dev 환경에서는 style-loader를 사용하고 prod 환경에서는 MiniCssExtractPlugin.loader를 적용하였다.

  ```js
  // dev
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  // production
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  ```

### Query를 한 파일에 모음

- SQL 쿼리문 들을 마치 상수와 같이 취급하여 하나의 파일에서 관리했다. 변수명에 쿼리의 의미를 함축하여 훨씬 직관적으로 보이도록 했다.
  ```ts
  const queries = {
    SELECT_CATEGORY_LIST: `SELECT * FROM Category`,
    SELECT_PAYMENT_METHOD_LIST: `SELECT * FROM PaymentMethod WHERE userId=?`,
    SELECT_PAYMENT_METHOD: `SELECT * FROM PaymentMethod WHERE id=?`,
    .
    .
  }
  ```

### Observer Pattern

- **Event Emitter**  
   지난 프로젝트에서 사용했던 것과 유사하게 Event Emitter를 만들어서 Observable 클래스를 구현했다. 이벤트명을 지정하여 on으로 구독하고, off로 구독을 해제한다.
  이벤트를 전파하는 부분에서는 emit을 실행하고, 구독한 쪽에서 등록한 콜백 함수들을 모두 실행한다.

  ```ts
  export class Observable {
    observers: Set<IEvent> = new Set();
    on(type: string, handler: Function) {
      this.observers.add({
        type,
        handler,
      });
    }
    off(type: string) {
      Array.from(this.observers)
        .filter((x) => x.type === type)
        .forEach((item: IEvent) => {
          this.observers.delete(item);
        });
    }
    emit(type: string, payload = undefined) {
      Array.from(this.observers)
        .filter((x) => x.type === type)
        .forEach((observer) => {
          observer.handler(payload);
        });
    }
  }
  ```

### MVC Pattern

- **Model-View-Component**  
  MVC 패턴을 적용하여 데이터와 뷰간의 연결을 느슨하게 했다. 우리는 Model과 View가 있었고, 컨트롤러의 역할을 하는 Component가 있었다. Component는 View와 1:1 관계로 모든 컴포넌트는 각자의 View가 있는 형태고, Component는 여러개의 Model을 가지고 있을 수 있는 형태이다.

  ```ts
  // Component
  // View 하나를 인자로 받고, constructor에서 필요한 Model들을 불러옴
  export class Calendar extends Component<CalendarView, Container> {
    invoiceModel: InvoiceModel

    constructor(parent, view: CalendarView) {
      super(parent, view)

      this.invoiceModel = this.parent.invoiceModel
    }
    .
    .
  }
  ```

- **Model은 Observable**  
  Model은 구독이 가능한 클래스이다. 즉, Component가 Model을 구독하고 있는 형태이고, Component가 Model의 변화를 인식하면 View에게 변화를 준다.  
  View는 Model의 변화를 직접적을 알지 못 하고, Component를 통해서 알게 된다.
  이는 반대로 Model도 View에 직접적인 영향을 주지 않기 때문에 느슨한 연결을 했다고 할 수 있다.

  ```ts
  // In Component
  bind() {
    this.invoiceModel.on(EVENT.EARNING_TOGGLE, (isClicked: boolean) => {
      this.view.setEarningVisible(isClicked)
    })

    this.invoiceModel.on(EVENT.SPENDING_TOGGLE, (isClicked: boolean) => {
      this.view.setSpendingVisible(isClicked)
    })
    .
    .
  }
  ```

- **구독/해제를 자동화**
  Model의 변화를 구독하는 이유는 결국에 View를 변경하기 위함이다. 즉, View를 변경할 필요가 없다면 Model을 구독하고 있는 것은 굉장한 낭비이다.  
  그래서 Component마다 bind / unbind 메소드를 만들었다. router에서 보여지는 Component를 통제하는데, 이때 보여지는 Component는 bind을 수행하여 Model의 변화에 따라 View를 변화시키도록 한다. 반대로 보여지지 않게 된 Component는 unbind를 수행하여 Model이 변하더라도 View를 조작하지 않도록 한다.

  - bind : Model의 변화를 구독하는 함수
  - unbind : Model에 대한 구독을 해제하는 함수

  ```ts
  // In Component
    bind() {
      this.invoiceModel.on(EVENT.EARNING_TOGGLE, (isClicked: boolean) => {
        this.view.setEarningVisible(isClicked)
      })

      this.invoiceModel.on(EVENT.SPENDING_TOGGLE, (isClicked: boolean) => {
        this.view.setSpendingVisible(isClicked)
      })
    }

    unbind() {
      this.invoiceModel.off(EVENT.EARNING_TOGGLE)
      this.invoiceModel.off(EVENT.SPENDING_TOGGLE)
    }
  ```

### template을 분리하자

- **template.ts 분리**  
  View에 수반되는 html 코드는 따로 분리하여 관리했다. 이렇게 하지 않으면 View의 코드가 너무 길어지는 현상이 발생한다. 반면 분리하면 View는 DOM 조작하는 함수들로만 구성할 수 있고, template에는 html 마크업 구조에만 집중할 수 있다.  
  Component에 view가 1:1 관계로 설계했기 때문에, Component 마다 아래와 같은 구조를 갖게 되었다.

  - index.ts : Component
  - view.ts : View
  - template.ts : HTML
  - style.scss : CSS

- **상수를 분리하자**  
  클래스명이나 이벤트명 등의 매직넘버들은 따로 관리하는 것이 좋다. 그래서 View에서는 이러한 매직 넘버를 관리하기 위해 util/constants.ts 를 만들었다. 지금 보니 template.ts에서도 constants.ts에 있는 변수들을 적용하면 더 좋았겠다는 생각이 든다.

## 🧑🏻‍💻 배운 것

- **폴더 구조**  
  폴더 구조를 어떻게 하면 보기 편하고, 깊이는 깊지 않게 유지하면서도 지저분하지 않게 짤지 많은 고민을 했다. 많은 리팩토링 과정을 거쳐 지금과 같은 구조가 되었다.  
  처음에는 style 폴더, template 폴더, view 폴더 전부 따로 해볼까도 생각해보았는데, 같은 컴포넌트에 속하는 코드는 가까이 있는 것이 좋을 것 같아서 컴포넌트 단위로 묶었다.  
  모델의 경우, 하나의 모델을 여러 컴포넌트를 여러 컴포넌트에서 구독할 수 있기 때문에 분리하였다.

  - components

    - component1, component2, ...

      - index.ts
      - style.scss
      - template.ts
      - style.scss

  - model

    - index.ts
    - model1, model2, ...

- **상속**  
  Observable 클래스, Component 클래스 등의 추상 클래스들을 선언해놓고 이를 상속받아서 사용했다.
  바닐라 자바스크립트로 객체 지향적으로 코딩을 해본 경험은 많지 않았는데 좋은 경험이 된 것 같다.

  - **상속이란?** : 어떤 클래스의 기능을 확장, 수정해서 사용하고 싶을 때 상속을 받아서 사용한다.
  - **추상 클래스** : abstract 메소드를 하나 이상 갖는 클래스로, 자식 클래스의 메소드를 강제할 수 있다.

- **SVG 차트**  
  이번 프로젝트 기획으로 차트가 나왔는데, 어떻게 구현해야 할 지 막막했었다. 그런데 수현이형이 svg로 뚝딱뚝딱 만들고 설명도 너무 잘 해주어서 고마웠다.

  - **SVG** : path의 좌표를 찍고 안쪽에 색을 채워서 모양을 만들 수 있다!

---

## 🤔 회고

**1. TypeScript**  
팀원인 수현이형도 타입스크립트에 대해 잘 몰랐고 나도 잘 몰랐는데, 주변에 타입스크립트를 잘 하는 사람이 많으니까 모르는거 물어보면서 도전해보자고 해서 사용했다.  
사실 TypeScript를 사용했다고 하기에는 너무 좁은 범위에서 사용을 했는데, 일단 첫 시작부터 완벽히 사용할 수는 없기때문에 우리 팀은 사용했다는 것 자체에 만족했다.  
앞으로 더 발전하면 되니까 😅

**2. 구조 설계**  
이번 프로젝트는 굉장히 설계에 공을 많이 들인 프로젝트였다. 2주간의 프로젝트인데 첫 일주일동안은 거의 설계만 진행했고 개발된 사항은 많지 않았다.  
둘째주에도 계속적으로 폴더구조를 수정하고 구조에 대한 리팩토링을 많이 진행했다.
그래서 기능개발이 조금 부족한 면도 있긴 한데, 구조에 대해 깊게 생각해보고 서로 이야기를 많이 나누어보았다는 점이 굉장히 좋았다.  
구조에 대한 아이디어도 수현이형이 많이 내주었고, 설계도 같이 하는데 수현이형이 많이 잡아주었다.
굉장한 실력자라고 느꼈다. (역시 아그라작 😲) 덕분에 MVC 패턴에 대한 이해도 많이 늘었고 매우매우 감사하다.

**3. Homework Driven Development**  
우리 팀은 숙제 기반의 개발을 진행했다. 아무래도 내가 저녁에 집에서 작업하는 것을 선호하다보니 칼퇴를 많이 했는데, 집에 가기 전에 다음날까지 개발할 것, 공부할 것 등을 정하고 헤어졌다.  
이슈나 풀리퀘스트가 올라올 때마다 슬랙 메세지가 가도록 설정해두었는데, 새벽에 작업을 하다보면 수현이형의 풀리퀘스트가 종종 올라왔다.
그럴 때마다 '아니 이 시간에 개발을 하고 있다고..??' 라는 생각을 했었는데, 그 생각을 하고 있던 나도 개발중이였다. 🤣  
하여튼 너무 열심히 해준 수현이형에게 리스펙트를 표한다.

**4. 페어 프로그래밍**  
첫번째 프로젝트는 기간이 너무 짧기도 해서 페어 프로그래밍을 많이 진행하지는 못 했고, 두번째 프로젝트는 재택으로도 많이 진행해서 페어 프로그래밍을 많이 하지 못 했다.
이번 프로젝트에서는 근무시간에 따로 작업한 적이 거의 없다 싶을 정도로, 페어 프로그래밍을 많이 진행했다.  
페어로 진행하면서 불편하거나 힘든 점은 거의 느끼지 못 했고, 너무 재미있어서 계속 페어로 진행하고 싶었다. 수현이형이 워낙 유쾌한 사람이고 배려심도 많아서, 삽질하는 나를 잘 이끌어준 것 같다.
