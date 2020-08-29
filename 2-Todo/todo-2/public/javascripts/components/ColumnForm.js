import { templateToElement } from '../utils/HtmlGenerator'
import { COLUMN_FORM_CLASS, CLASS_NAME } from '../utils/Constants'
import '../../stylesheets/components/columnForm.scss'

export default class ColumnForm {
  constructor() {
    this.$target = ''
    this.isActive = false

    this.init()
  }

  init() {
    this.setElements()
    this.bindEvent()
  }

  setElements() {
    this.template = `
      <div class='column-form'>
        <input type='text' class='${COLUMN_FORM_CLASS.TITLE_INPUT}' placeholder='Enter a column title'>
        <div class='${COLUMN_FORM_CLASS.SUBMIT_BTN} ${CLASS_NAME.UNACTIVE}'>Add Column</div>
      </div>
    `

    this.$target = templateToElement(this.template)
    this.$titleInput = this.$target.querySelector(
      `.${COLUMN_FORM_CLASS.TITLE_INPUT}`
    )
    this.$submitBtn = this.$target.querySelector(
      `.${COLUMN_FORM_CLASS.SUBMIT_BTN}`
    )
  }

  bindEvent() {
    this.$titleInput.addEventListener(
      'input',
      this.setSubmitBtnActiveHandler.bind(this)
    )
  }

  setSubmitBtnActiveHandler() {
    const isActive = this.$titleInput.value !== ''
    this.updateActive(isActive)
  }

  updateActive(isActive) {
    this.isActive = isActive

    if (this.isActive) {
      this.$submitBtn.classList.remove(CLASS_NAME.UNACTIVE)
      return
    }

    this.$submitBtn.classList.add(CLASS_NAME.UNACTIVE)
  }

  getTarget() {
    return this.$target
  }

  getTitleValue() {
    return this.$titleInput.value
  }

  getIsActive() {
    return this.isActive
  }

  setDefault() {
    this.$titleInput.value = ''
    this.updateActive(false)
  }
}
