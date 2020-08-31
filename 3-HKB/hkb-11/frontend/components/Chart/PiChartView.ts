import { formatAmount } from '../../utils'
import { templateToElement } from '../../utils/ElementGenerator'
import { setText, View } from '../view'
import config from './config'
import {
  noDataAlertTemplate,
  piChartTemplate,
  piItemTemplate,
} from './template'
function dx(r, ang) {
  return r * Math.cos(((ang - 90) / 180) * Math.PI)
}
function dy(r, ang) {
  return r * Math.sin(((ang - 90) / 180) * Math.PI)
}
function createPiTableItemElement({ title, ratio, amount, idx }) {
  const { circleColors, width } = config
  const $piTableItem = templateToElement(piItemTemplate)
  setText($piTableItem, '.item-title', title)
  const $itemColorBar = $piTableItem.querySelector('.item-color-bar')
  $itemColorBar.setAttribute(
    'style',
    `width: ${ratio * width * 0.8}px; background-color: ${circleColors[idx]}`
  )
  setText($piTableItem, '.item-amount', `${formatAmount(amount)}원`)
  return $piTableItem
}

function signed(ang) {
  return ang >= 180 ? -1 : 1
}
function createPiIndicatorLine({ ang, title }) {
  const { cx, cy, piLineRatio: ratio, radius: r } = config

  const ix = cx + dx(r * ratio, ang),
    iy = cy + dy(r * ratio, ang)
  const jx = ix + signed(ang) * (ratio - 1) * r
  return `<line x1="${cx}" y1="${cy}" x2="${ix}" y2="${iy}" stroke="black"></line>
  <line x1="${ix}" y1="${iy}" x2="${jx}" y2="${iy}" stroke="black"></line>
  <text x="${jx + signed(ang) * 6}" y="${iy + 4}" text-anchor="${
    signed(ang) == 1 ? 'start' : 'end'
  }">${title}</text>`
}
function createPiArc({ ang, theta, idx }) {
  const { cx, cy, circleColors, radius: r } = config
  return `<path d="M ${cx + dx(r, ang)} ${cy + dy(r, ang)} A ${r} ${r} 0 ${
    theta >= 180 ? 1 : 0
  } 1 ${cx + dx(r, ang + theta)} ${
    cy + dy(r, ang + theta)
  } L ${cx} ${cy} Z" stroke="2" fill="${circleColors[idx]}"></path>`
}

export class PiChartView extends View {
  $piTable: HTMLDivElement
  $piChart: SVGElement
  constructor() {
    super(piChartTemplate)
  }
  mount() {
    this.$piChart = <SVGElement>this.query('#pi-chart svg')
    this.$piTable = <HTMLDivElement>this.query('#pi-table')
  }
  insertPiChartTemplate(...templates: string[]) {
    templates.forEach((template) => {
      this.$piChart.insertAdjacentHTML('beforeend', template)
    })
  }

  renderPiChart(arr) {
    this.$piChart.innerHTML = ''
    this.$piTable.innerHTML = ''
    const totalAmount = arr.reduce((a, b) => a + b.amount, 0)
    const { circles } = config
    let ang = 0
    if (arr.length === 0) {
      this.insertPiChartTemplate(noDataAlertTemplate)
    }
    arr.slice(0, circles).forEach(({ title, ang: theta, amount }, idx) => {
      this.insertPiChartTemplate(
        createPiIndicatorLine({ ang: ang + theta / 2, title }),
        createPiArc({ ang, theta, idx })
      )
      ang += theta
      this.$piTable.appendChild(
        createPiTableItemElement({
          title,
          ratio: amount / totalAmount,
          idx,
          amount,
        })
      )
    })
  }
}
