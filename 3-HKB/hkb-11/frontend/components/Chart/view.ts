import { View } from '../view'
import { BarChartView } from './BarChartView'
import { PiChartView } from './PiChartView'
import './style.scss'
import { template } from './template'
export default class ChartView extends View {
  piChartView: PiChartView
  barChartView: BarChartView
  $pi: HTMLInputElement
  $bar: HTMLInputElement
  constructor() {
    super(template)
    this.piChartView.appendToView(this)
    this.barChartView.appendToView(this)
    this.$element.addEventListener('click', ({ target }) => {
      if (!(target instanceof HTMLInputElement)) return
      if (target === this.$pi) {
        this.showPiChart()
      }
      if (target === this.$bar) {
        this.showBarChart()
      }
    })
  }
  showBarChart() {
    this.$bar.checked = true
    this.piChartView.hide()
    this.barChartView.show()
  }
  showPiChart() {
    this.$pi.checked = true
    this.piChartView.show()
    this.barChartView.hide()
  }
  clear() {
    this.showBarChart()
  }
  mount(): void {
    this.$bar = <HTMLInputElement>this.query('#bar')
    this.$pi = <HTMLInputElement>this.query('#pi')
    this.piChartView = new PiChartView()
    this.barChartView = new BarChartView()
  }
}
