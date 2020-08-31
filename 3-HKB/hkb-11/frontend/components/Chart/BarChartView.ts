import router from '../../router'
import { formatAmount } from '../../utils'
import { templateToElement } from '../../utils/ElementGenerator'
import { createSVGCircle, createSVGLine, createSVGText, View } from '../view'
import config from './config'
import { barChartTemplate, barDisplayTemplate } from './template'

function range(idx) {
  return Array.from({ length: idx }, (_, i) => i)
}

function getOffsetX(dayN) {
  const { width, padding } = config
  return (width - padding * 2) / dayN
}

function createConnectionLines(dayN) {
  const { height, padding, paddingY } = config
  const y = height - paddingY
  const offsetX = getOffsetX(dayN)
  return range(dayN - 1).map((i) =>
    createSVGLine({
      className: 'connection-line',
      id: `l${i + 1}`,
      x1: padding + offsetX * (i + 2) - offsetX,
      x2: padding + offsetX * (i + 2),
      y1: y,
      y2: y,
    })
  )
}
function createDateCircles(dayN) {
  const { height, paddingY, padding } = config
  const y = height - paddingY
  const offsetX = getOffsetX(dayN)
  return range(dayN - 1).map((i) =>
    createSVGCircle({
      id: `c${i + 1}`,
      className: 'date-circle',
      cx: padding + offsetX * (i + 1),
      cy: y,
    })
  )
}
function createDateNumbers(dayN) {
  const { height, paddingY, padding, paddingX2 } = config
  const y = height - paddingY + paddingX2
  const offsetX = getOffsetX(dayN)
  return range(dayN - 1).map((i) =>
    createSVGText({
      className: 'date-number',
      id: `d${i + 1}`,
      x: padding + offsetX * (i + 1),
      y,
      text: i + 1,
    })
  )
}
function createGridLines(lines) {
  const { width, paddingX, paddingY, lineHeight } = config
  return range(lines)
    .map((i) => paddingY + lineHeight * (i + 1))
    .map((y) =>
      createSVGLine({
        className: 'grid-line',
        x1: paddingX,
        x2: width - paddingX,
        y1: y,
        y2: y,
      })
    )
}
function createGridNumbers(lines) {
  const { paddingX, paddingX2, paddingY, lineHeight } = config
  return range(lines).map((i) =>
    createSVGText({
      className: 'grid-number',
      id: `h${lines - i - 1}`,
      x: paddingX - paddingX2,
      y: paddingY + lineHeight * (i + 1) + 6,
    })
  )
}

export class BarChartView extends View {
  $barChart: SVGElement
  $barDisplay: HTMLDivElement
  $selectedDateNumber: SVGTextElement
  constructor() {
    super(barChartTemplate)
    this.$barChart = <SVGElement>this.query('#bar-chart svg')
    this.$barDisplay = <HTMLDivElement>templateToElement(barDisplayTemplate)
    this.$element.insertBefore(this.$barDisplay, null)
    this.initBarChart()
    this.$barChart.addEventListener(
      'mousemove',
      this.handleMouseMove.bind(this)
    )
  }
  handleMouseMove(event) {
    const { target } = event
    if (!(target instanceof Element)) return
    const $circle = target.closest('circle')
    if (!$circle) {
      this.$barDisplay.classList.add('transparent')
      this.$selectedDateNumber?.classList.remove('selected')
      return
    }
    this.$barDisplay.classList.remove('transparent')
    const cx = parseInt($circle.getAttribute('cx')),
      cy = parseInt($circle.getAttribute('cy'))
    const amount = formatAmount(parseInt($circle.getAttribute('amount')))
    this.$barDisplay.innerText = `${amount || 0}원`
    const { width, height } = this.$barDisplay.getBoundingClientRect()
    this.$barDisplay.setAttribute(
      'style',
      `left: ${cx - width / 2}; top: ${cy - height * 1.3};`
    )
    this.$selectedDateNumber = <SVGTextElement>(
      this.query(`#d${$circle.id.slice(1)}`)
    )
    this.$selectedDateNumber.classList.add('selected')
    // debugger
  }
  mount() {}
  insertBarChartTemplate(...templates: string[]) {
    templates.forEach((template) => {
      this.$barChart.insertAdjacentHTML('beforeend', template)
    })
  }
  setBarMaxHeight(height) {
    const { lines } = config
    for (let i = 0; i < lines; i++) {
      const text = <SVGTextElement>this.$barChart.querySelector(`text#h${i}`)
      text.textContent =
        height == 0 ? '' : formatAmount(Math.floor((height / (lines - 1)) * i))
    }
  }
  setBarHeight(date, ratio, amount) {
    const { paddingY, height, lineHeight } = config
    const circle = <SVGCircleElement>this.$barChart.querySelector(`#c${date}`)
    const line = <SVGLineElement>this.$barChart.querySelector(`#l${date}`)
    const beforeLine = <SVGLineElement>(
      this.$barChart.querySelector(`#l${parseInt(date) - 1}`)
    )
    const y = height - paddingY - (height - 2 * paddingY - lineHeight) * ratio
    if (line) {
      line.setAttribute('y1', `${y}`)
    }
    if (beforeLine) {
      beforeLine.setAttribute('y2', `${y}`)
    }
    circle.setAttribute('cy', `${y}`)
    circle.setAttribute('amount', `${amount}`)
  }
  renderBarChart(arr) {
    this.initBarChart()
    const maxAmount = Math.max(...(<number[]>Object.values(arr)), 0)
    const maxHeight = 1.5 * maxAmount - ((1.5 * maxAmount) % 1000)
    this.setBarMaxHeight(maxHeight)
    Object.entries(arr).forEach(([date, amount]: [string, number]) => {
      this.setBarHeight(date, maxHeight == 0 ? 0 : amount / maxHeight, amount)
    })
  }
  initBarChart() {
    this.$barChart.innerHTML = ''
    const { lines } = config
    const dayN = new Date(router.year, router.month, 0).getDate()

    this.insertBarChartTemplate(
      ...createGridLines(lines),
      ...createGridNumbers(lines),
      ...createConnectionLines(dayN),
      ...createDateCircles(dayN),
      ...createDateNumbers(dayN)
    )
  }
}
