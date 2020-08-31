export const template: string = /*html*/ `
  <section id='invoice-chart'>
    <div id="chart-selector" class="row">
      <div class="item left">
        <label> 날짜별 분류 </label>
        <input type="radio" name="chart" id="bar" checked/>
      </div>
      <div class="item right">
        <label> 항목별 분류 </label>
        <input type="radio" name="chart" id="pi"/>
      </div>
    </div>
  </section>
`

export const barChartTemplate = /*html*/ `
  <div id="bar-chart">
    <svg viewBox="0 0 800 400"></svg>
  </div>
`
export const piChartTemplate = /*html*/ `
  <div id="pi-chart">
    <svg viewBox="0 0 800 400">
    </svg>
    <div class="header-3">
      항목별 합계
    </div>
    <div id="pi-table" class="rows">
    </div>
  </div>
`
export const noDataAlertTemplate = `
  <circle cx="400" cy="200" r="132" fill="lightgrey"></circle>
  <text id="no-data-alert" x="400" y="200" text-anchor="middle">표시할 정보가 없습니다.</text>

`
export const piItemTemplate = /*html*/ `
  <div class="row">
    <div class="item left item-title">
    </div>
    <div class="item right item-bar">
      <div class="row">
        <div class="item-color-bar">
        </div>
        <div class="item-amount">
        </div>
      </div>
    </div>
  </div>
`

export const barDisplayTemplate = `
  <div id="bar-display" class="transparent">
  </div>
`
