import { Component } from '..'
import { Invoice } from '../../../types'
import { InvoiceModel } from '../../model/InvoiceModel'
import { CONSTANT, EVENT } from '../../utils/constants'
import { Container } from '../Container'
import ChartView from './view'

function isSpending(invoice: Invoice) {
  return invoice.category.type === CONSTANT.SPENDING
}
function invoiceReducer(picker) {
  return (prev, invoice: Invoice) => {
    const key = picker(invoice)
    const beforeAmount = key in prev ? prev[key] : 0
    return {
      ...prev,
      [key]: invoice.amount + beforeAmount,
    }
  }
}
function pickDate(invoice: Invoice) {
  return invoice.date.getDate()
}
function pickCategory(invoice: Invoice) {
  return invoice.category.title
}
function sortByValue(obj) {
  return Object.entries(obj).sort(
    (a: [string, number], b: [string, number]) => b[1] - a[1]
  )
}
export class Chart extends Component<ChartView, Container> {
  invoiceModel: InvoiceModel

  constructor(parent, view: ChartView) {
    super(parent, view)
    this.invoiceModel = this.parent.invoiceModel
  }
  aggregateByDate(invoices: Invoice[]) {
    return invoices.filter(isSpending).reduce(invoiceReducer(pickDate), {})
  }
  aggregateByCategory(invoices: Invoice[]) {
    const spendingInvoices = invoices.filter(isSpending)
    const totalAmount = spendingInvoices.reduce((a, b) => a + b.amount, 0)
    return sortByValue(
      spendingInvoices.reduce(invoiceReducer(pickCategory), {})
    ).map(([title, amount]: [string, number]) => ({
      title,
      amount,
      ang: (amount / totalAmount) * 360,
    }))
  }
  bind() {
    this.invoiceModel.on(EVENT.SET_INVOICES, (invoices: Invoice[]) => {
      this.view.barChartView.renderBarChart(this.aggregateByDate(invoices))
      this.view.piChartView.renderPiChart(this.aggregateByCategory(invoices))
    })
  }
  unbind() {
    this.invoiceModel.off(EVENT.SET_INVOICES)
  }
}
