import { PaymentMethod } from '../../../types'
import { CLASS, MODAL_CLASS } from '../../utils/constants'
import { templateToElement } from '../../utils/ElementGenerator'
import { View } from '../view'
import './style.scss'
import { paymentTemplate, template } from './template'

export default class ModalView extends View {
  $buttonClose: HTMLElement
  $inputPayment: HTMLInputElement
  $buttonAddPayment: HTMLButtonElement
  $paymentList: HTMLDivElement
  paymentAddHandler: Function
  paymentRemoveHandler: Function

  constructor() {
    super(template)
    this.hide()
  }
  mount(): void {
    this.$buttonClose = <HTMLElement>this.query(`.${MODAL_CLASS.CLOSE_BTN}`)
    this.$inputPayment = <HTMLInputElement>(
      this.query(`.${MODAL_CLASS.INPUT_PAYMENT}`)
    )
    this.$buttonAddPayment = <HTMLInputElement>(
      this.query(`.${MODAL_CLASS.ADD_BTN}`)
    )
    this.$paymentList = <HTMLDivElement>this.query('.payment-list')

    this.$element.addEventListener('click', this.onClickHandler.bind(this))
  }

  bindPaymentAddHandler(handler) {
    this.paymentAddHandler = handler
  }

  bindPaymentRemoveHandler(handler) {
    this.paymentRemoveHandler = handler
  }

  onClickHandler(e) {
    const $buttonClose = e.target.closest(`.${MODAL_CLASS.CLOSE_BTN}`)
    if ($buttonClose) {
      this.closeModal()
      return
    }

    const $buttonAddPayment = e.target.closest(`.${MODAL_CLASS.ADD_BTN}`)
    if ($buttonAddPayment) {
      this.paymentAddHandler(this.getPaymentData())
      return
    }

    const $buttonRemovePayment = e.target.closest(`.${MODAL_CLASS.REMOVE_BTN}`)
    if ($buttonRemovePayment) {
      const $payment = $buttonRemovePayment.closest(
        `.${MODAL_CLASS.PAYMENT_ROW}`
      )
      this.paymentRemoveHandler(+$payment.dataset.id)
      return
    }
  }

  getPaymentData() {
    return {
      id: 0,
      title: this.$inputPayment.value,
    }
  }

  addPayment(payment: PaymentMethod) {
    const $payment = templateToElement(paymentTemplate)
    $payment.dataset.id = payment.id.toString()
    const $itemName = <HTMLDivElement>(
      $payment.querySelector(`.${CLASS.ITEM}.${CLASS.CENTER}`)
    )
    $itemName.innerText = payment.title
    this.$paymentList.appendChild($payment)
  }

  removePayment(paymentId: number) {
    const $payment = this.query(
      `.${MODAL_CLASS.PAYMENT_ROW}[data-id='${paymentId}']`
    )
    this.$paymentList.removeChild($payment)
  }

  setPayments(payments: PaymentMethod[]) {
    this.removePayments()

    payments.forEach((payment) => {
      this.addPayment(payment)
    })
  }

  removePayments() {
    this.$paymentList.innerHTML = ''
  }

  showModal() {
    this.$element.classList.remove(CLASS.HIDDEN)
    document.body.classList.add(CLASS.STOP_SCROLL)
  }

  closeModal() {
    this.$element.classList.add(CLASS.HIDDEN)
    document.body.classList.remove(CLASS.STOP_SCROLL)
  }

  clearModal() {
    this.$inputPayment.value = ''
  }
}
