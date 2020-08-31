export const template: string = /*html*/ `
  <section id='invoice-calendar'>
  </section>
`

export const headerCellTemplate: string = `
  <div class='cell header-cell'>
    <div class='day'></div>
  </div>
`

export const dateCellTemplate: string = `
  <div class='cell date-cell' data-date=''>
    <div class='date'></div>
    <div class='sum-wrapper'>
      <div class='sum earning-sum hidden'></div>
      <div class='sum spending-sum hidden'></div>
    </div>
  </div>
`
