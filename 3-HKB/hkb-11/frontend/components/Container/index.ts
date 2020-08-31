import { Component } from '..'
import * as API from '../../api'
import { CategoryModel } from '../../model/CategoryModel'
import { InvoiceModel } from '../../model/InvoiceModel'
import { PaymentModel } from '../../model/PaymentModel'
import router from '../../router'
import { ROUTE, ROUTER, ROUTES } from '../../utils/constants'
import { App } from '../app'
import { Calendar } from '../Calendar'
import { Chart } from '../Chart'
import { Filter } from '../Filter'
import { Form } from '../Form'
import { List } from '../List'
import { View } from '../view'
import ContainerView from './view'

export class Container extends Component<ContainerView, App> {
  invoiceModel: InvoiceModel = new InvoiceModel()
  categoryModel: CategoryModel = new CategoryModel()
  paymentModel: PaymentModel
  list: List
  filter: Filter
  form: Form
  calendar: Calendar
  chart: Chart
  routerMap: Map<string, Component<View>> = new Map<string, Component<View>>()

  constructor(parent, view: ContainerView) {
    super(parent, view)

    this.paymentModel = this.parent.paymentModel

    this.list = new List(this, this.view.listView)
    this.filter = new Filter(this, this.view.filterView)
    this.form = new Form(this, this.view.formView)
    this.calendar = new Calendar(this, this.view.calendarView)
    this.chart = new Chart(this, this.view.chartView)

    this.routerMap[ROUTE.LIST] = [this.form, this.filter, this.list]
    this.routerMap[ROUTE.CALENDAR] = [this.filter, this.calendar]
    this.routerMap[ROUTE.CHART] = [this.chart]

    router.on(ROUTER.CHANGE_DATE, async ({ year, month }) => {
      this.list.view.clear()
      this.form.view.clear()
      if (this.categoryModel.isEmpty() || this.paymentModel.isEmpty()) {
        const [{ categoryList }, { paymentMethodList }] = await Promise.all([
          API.fetchCategories(),
          API.fetchPayments(),
        ])
        this.categoryModel.setCategories(categoryList)
        this.paymentModel.setPaymentMethods(paymentMethodList)
      }

      const { invoiceList } = await API.fetchInvoices(year, month)
      if (router.year !== year && router.month !== month) return
      invoiceList.forEach((invoice) => {
        invoice.date = new Date(invoice.date)
        this.categoryModel.fillInvoice(invoice)
        this.paymentModel.fillInvoice(invoice)
      })
      this.invoiceModel.setInvoices(invoiceList)
    })
    router.on(
      ROUTER.MUTATE_VIEW,
      ({ path, flag }: { path: string; flag: boolean }) => {
        if (!ROUTES.CONTAINER.includes(path)) return
        if (router.isInvalidPath(path)) return
        const components = this.routerMap[path]
        if (flag) {
          components.forEach((component) => {
            const view = component.view
            view.appendToView(this.view)
            view.clear()
            component.bind()
          })
          this.invoiceModel.emitAll()
          this.categoryModel.emitAll()
          this.paymentModel.emitAll()
          return
        }
        components.forEach((component) => {
          const view = component.view
          view.remove()
          component.unbind()
        })
      }
    )
  }
}
