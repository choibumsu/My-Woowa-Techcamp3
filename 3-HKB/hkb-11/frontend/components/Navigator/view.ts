import { View } from '../view'
import './style.scss'
import { template } from './template'

export default class NavigatorView extends View {
  $month: HTMLDivElement

  constructor() {
    super(template)
  }

  mount(): void {
    this.$month = <HTMLDivElement>this.query('.month')
  }

  setDate(year, month) {
    this.$month.innerText = `${year}년 ${month}월`
  }
}
