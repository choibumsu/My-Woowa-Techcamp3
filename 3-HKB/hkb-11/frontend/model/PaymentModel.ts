import { Observable } from '.'
import { Invoice, PaymentMethod } from '../../types'
import { EVENT } from '../utils/constants'

export class PaymentModel extends Observable {
  paymentMethods: Array<PaymentMethod> = []

  fillInvoice(invoice: Invoice) {
    const payment = this.findPaymentMethodsById(invoice.paymentMethod.id)
    invoice.paymentMethod.title = payment.title
  }
  addPaymentMethod(paymentMethod: PaymentMethod) {
    this.paymentMethods = [...this.paymentMethods, paymentMethod]
    this.emit(EVENT.ADD_PAYMENT, paymentMethod)
  }

  setPaymentMethods(paymentMethods: Array<PaymentMethod>) {
    this.clear()
    this.paymentMethods = paymentMethods
    this.emit(EVENT.SET_PAYMENTS, this.paymentMethods)
  }

  removePaymentMethod(id: number) {
    this.paymentMethods = this.paymentMethods.filter(
      (paymentMethod) => paymentMethod.id !== id
    )
    this.emit(EVENT.REMOVE_PAYMENT, id)
  }

  findPaymentMethodsById(id: number) {
    return this.paymentMethods.find((paymentMethod) => paymentMethod.id === id)
  }

  clear() {
    this.paymentMethods = new Array<PaymentMethod>()
    this.emit(EVENT.CLEAR_PAYMENTS)
  }

  isEmpty() {
    return this.paymentMethods.length === 0
  }

  emitAll() {
    this.emit(EVENT.SET_PAYMENTS, this.paymentMethods)
  }
}
