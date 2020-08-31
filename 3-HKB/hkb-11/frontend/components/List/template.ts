export const template: string = /*html*/ `
  <section id='invoice-list'>
  </section>
`

export const wrapperRowTemplate: string = /*html*/ `
  <div class='invoice-wrapper'>
    <div class="date-row row">
      <div class="item left">
        <span class="date"></span><span class="day"></span><span class="hidden-date hidden"></span>
      </div>
      <div class="item right sum-box row">
        <span class="item left earning-sum-box">
          <span>+</span>
          <span class="earning-sum">0</span>
          <span>원</span>
        </span>
        <span class="item right spending-sum-box">
          <span>–</span>
          <span class="spending-sum">0</span>
          <span>원</span>
        </span>
      </div>
    </div>
    <div class="rows">
    </div>
  </div>
`

export const invoiceRowTemplate: string = /*html*/ `
  <div class='row invoice'>
    <div class="float">
      <div class="date"></div>
      <i class="button-edit f7-icons">pencil_circle</i>
    </div>
    <div class="hidden">
      <div class="hidden-id"></div>
      <div class="hidden-date"></div>
    </div>
    <div class="item left">
      <div class="type hidden"></div>
      <div class="category"></div>
      <div class="content"></div>
    </div>
    <div class="item right">
      <div class="payment"></div>
      <div class="amount-pre"></div>
      <div class="amount"></div>
      <div class="amount-post">
        원
      </div>
    </div>
  </div>
`
