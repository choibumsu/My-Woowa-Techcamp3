import CalendarView from '../Calendar/view'
import ChartView from '../Chart/view'
import FilterView from '../Filter/view'
import FormView from '../Form/view'
import ListView from '../List/view'
import { View } from '../view'
import './style.scss'
import { template } from './template'

export default class ContainerView extends View {
  formView: FormView
  filterView: FilterView
  listView: ListView
  calendarView: CalendarView
  chartView: ChartView

  constructor() {
    super(template)
  }

  mount(): void {
    this.formView = new FormView()
    this.filterView = new FilterView()
    this.listView = new ListView()
    this.calendarView = new CalendarView()
    this.chartView = new ChartView()
  }
}
