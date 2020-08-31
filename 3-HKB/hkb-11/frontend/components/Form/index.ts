import { Component } from '..'
import { Category, Invoice, PaymentMethod } from '../../../types'
import { deleteInvoice, postInvoice, updateInvoice } from '../../api'
import { CategoryModel } from '../../model/CategoryModel'
import { InvoiceModel } from '../../model/InvoiceModel'
import { PaymentModel } from '../../model/PaymentModel'
import { EVENT, FORM_CLASS } from '../../utils/constants'
import { Container } from '../Container'
import FormView from './view'

export class Form extends Component<FormView, Container> {
  invoiceModel: InvoiceModel
  categoryModel: CategoryModel
  paymentModel: PaymentModel

  constructor(parent, view: FormView) {
    super(parent, view)

    this.invoiceModel = this.parent.invoiceModel
    this.categoryModel = this.parent.categoryModel
    this.paymentModel = this.parent.paymentModel

    this.view.bindInvoiceAddHandler(this.handleInvoiceAdd.bind(this))
    this.view.bindInvoiceRemoveHandler(this.handleInvoiceRemove.bind(this))
    this.view.bindInvoiceUpdateHandler(this.handleInvoiceUpdate.bind(this))
  }
  async handleInvoiceAdd(invoice: Invoice) {
    try {
      const { invoiceId } = await postInvoice(invoice)
      this.invoiceModel.addInvoice(
        Object.assign(
          {
            id: invoiceId,
          },
          invoice
        )
      )
      this.view.changeFloatBtn(FORM_CLASS.CLEAR_BTN)
      this.view.clear()
    } catch (error) {
      console.error(error)
    }
  }
  async handleInvoiceRemove(id: number) {
    await deleteInvoice(id)
    this.invoiceModel.removeInvoice(id)

    this.view.changeFloatBtn(FORM_CLASS.CLEAR_BTN)
    this.view.clear()
  }
  async handleInvoiceUpdate(invoice: Invoice) {
    await updateInvoice(invoice)
    this.invoiceModel.updateInvoice(invoice)

    this.view.changeFloatBtn(FORM_CLASS.CLEAR_BTN)
    this.view.clear()
  }

  bind() {
    this.invoiceModel.on(EVENT.HIGHLIGHT_INVOICE, ({ id, flag }) => {
      if (flag === false) return

      const invoice: Invoice = this.invoiceModel.findInvoiceById(id)
      this.view.setInvoiceData(invoice)
    })

    this.categoryModel.on(EVENT.SET_CATEGORIES, (categories: Category[]) => {
      this.view.setCategories(categories)
    })

    this.paymentModel.on(EVENT.SET_PAYMENTS, (payments: PaymentMethod[]) => {
      this.view.setPayments(payments)
    })

    this.paymentModel.on(EVENT.ADD_PAYMENT, (payment: PaymentMethod) => {
      this.view.addPayment(payment)
    })

    this.paymentModel.on(EVENT.REMOVE_PAYMENT, (paymentId: number) => {
      this.view.removePayment(paymentId)
    })
  }

  unbind() {
    this.invoiceModel.off(EVENT.HIGHLIGHT_INVOICE)
    this.categoryModel.off(EVENT.SET_CATEGORIES)
    this.paymentModel.off(EVENT.ADD_PAYMENT)
    this.paymentModel.off(EVENT.SET_PAYMENTS)
    this.paymentModel.off(EVENT.REMOVE_PAYMENT)
  }
}
