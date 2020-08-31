export const template: string = /*html*/ `
  <div id='payment-modal'>
    <div class="modal-background"></div>
    <div class="modal">
      <div class="modal-header">
        <div class='modal-title'>
          결제 수단 관리
        </div>
        <i class="float close-btn f7-icons">xmark</i>
      </div>
      <div class="modal-body">
        <form class="payment-form">
          <input class="input-payment" placeholder='결제 수단 이름' />
          <button type="button" class="button button-add-payment">등록</button>
        </form>
        <div class="rows payment-list"></div>
      </div>
    </div>
  </div>
`

export const paymentTemplate: string = /*html*/ `
  <div class='row payment-row' data-id=''>
    <div class="item center">현대카드</div>
    <div class="item right">
      <i class="remove-btn f7-icons">trash</i>
    </div>
  </div>
`
