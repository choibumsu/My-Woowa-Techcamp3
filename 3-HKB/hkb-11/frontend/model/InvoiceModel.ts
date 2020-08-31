import { Observable } from '.'
import { Invoice } from '../../types'
import { CONSTANT, EVENT } from '../utils/constants'

export class InvoiceModel extends Observable {
  invoices: Array<Invoice> = []
  highlightId: number
  sumEarning: number = 0
  sumSpending: number = 0
  earningToggle: boolean = true
  spendingToggle: boolean = true

  addSumEarning(offset: number) {
    this.setSumEarning(this.sumEarning + offset)
  }
  setSumEarning(amount: number) {
    this.sumEarning = amount
    this.emit(EVENT.SET_SUM_EARNING, this.sumEarning)
  }
  addSumSpending(offset: number) {
    this.setSumSpending(this.sumSpending + offset)
  }
  setSumSpending(amount: number) {
    this.sumSpending = amount
    this.emit(EVENT.SET_SUM_SPENDING, this.sumSpending)
  }

  addInvoice(invoice: Invoice) {
    this.invoices = [...this.invoices, invoice]
    const { category, amount } = invoice
    if (category.type === CONSTANT.EARNING) {
      this.emit(EVENT.ADD_INVOICE, { invoice, hidden: !this.earningToggle })
      this.addSumEarning(amount)
      return
    }
    this.emit(EVENT.ADD_INVOICE, { invoice, hidden: !this.spendingToggle })
    this.addSumSpending(amount)
  }
  setEarningToggle(value) {
    this.earningToggle = value
    this.emit(EVENT.EARNING_TOGGLE, value)
  }
  setSpendingToggle(value) {
    this.spendingToggle = value
    this.emit(EVENT.SPENDING_TOGGLE, value)
  }
  removeInvoice(id: number) {
    const invoice = this.invoices.find((x) => x.id === id)
    if (!invoice) return
    if (this.highlightId === id) this.highlightId = undefined
    const { category, amount } = invoice
    if (category.type === CONSTANT.EARNING) this.addSumEarning(-amount)
    else this.addSumSpending(-amount)
    this.invoices = this.invoices.filter((x) => x !== invoice)
    this.emit(EVENT.REMOVE_INVOICE, id)
  }
  setInvoices(invoices: Array<Invoice>) {
    this.setSumSpending(0)
    this.setSumEarning(0)
    this.clear()
    invoices.forEach((invoice) => {
      this.addInvoice(invoice)
    })
    this.emit(EVENT.SET_INVOICES, this.invoices)
  }
  updateInvoice(invoice: Invoice) {
    const { id } = invoice
    this.removeInvoice(id)
    this.addInvoice(invoice)
  }
  highlight(id: number) {
    if (id === this.highlightId) {
      this.emit(EVENT.HIGHLIGHT_INVOICE, { id, flag: false })
      return
    }
    if (this.highlightId !== undefined) {
      this.emit(EVENT.HIGHLIGHT_INVOICE, { id: this.highlightId, flag: false })
    }
    this.emit(EVENT.HIGHLIGHT_INVOICE, { id, flag: true })
    this.highlightId = id
  }
  clear() {
    this.invoices = new Array<Invoice>()
    this.emit(EVENT.CLEAR_INVOICES)
  }
  findInvoiceById(id: number) {
    return this.invoices.find((invoice) => invoice.id === id)
  }
  emitAll() {
    this.emit(EVENT.SET_INVOICES, this.invoices)
    this.emit(EVENT.EARNING_TOGGLE, this.earningToggle)
    this.emit(EVENT.SPENDING_TOGGLE, this.spendingToggle)
    this.emit(EVENT.SET_SUM_EARNING, this.sumEarning)
    this.emit(EVENT.SET_SUM_SPENDING, this.sumSpending)
  }
}
