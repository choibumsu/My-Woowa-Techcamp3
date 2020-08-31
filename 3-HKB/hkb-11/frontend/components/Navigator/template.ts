export const template: string = /*html*/ `
  <section id='navigator'>
    <div class="rows">
      <nav class="row month-picker">
        <a to="previous-month" class='month-link'>
          <i class='f7-icons'>arrowtriangle_left</i>
        </a>
        <div class="month">6월</div>
        <a to="next-month" class='month-link'>
          <i class='f7-icons'>arrowtriangle_right</i>
        </a>
      </nav>
      <nav class="row page-picker">
        <a to="list" class="active">내역</a>
        <a to="calendar">달력</a>
        <a to="chart">통계</a>
      </nav>
    </div>
  </section>
`
