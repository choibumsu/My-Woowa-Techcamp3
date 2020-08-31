export const template: string = /*html*/ `
  <section id='invoice-filter'>
    <div class='row earning'>
      <div class='item left'>
        <label for='earning-check' class='check-label'>
          <i class='f7-icons checked'>checkmark_alt_circle_fill</i>
          <i class='f7-icons unchecked hidden'>checkmark_alt_circle</i>
        </label>
        <input type="checkbox" id='earning-check' class="earning-checkbox hidden" />
        <label>수입</label>
      </div>
      <div class='item right'>
        <label class="earning-total">3,234,123원</label>
      </div>
    </div>
    <div class='row spending'>
      <div class='item left'>
        <label for='spending-check' class='check-label'>
          <i class='f7-icons checked'>checkmark_alt_circle_fill</i>
          <i class='f7-icons unchecked hidden'>checkmark_alt_circle</i>
        </label>
        <input type="checkbox" id='spending-check' class="spending-checkbox hidden" />
        <label>지출</label>
      </div>
      <div class='item right'>
        <label class="spending-total">134,123원</label>
      </div>
    </div>
  </section>
`
