import Modal from './Modal'
import { MODAL_CLASS, MODAL_ID, CLASS_NAME } from '../../utils/Constants'

export default class EditColumnModal extends Modal {
  constructor(columnTitle, editCallback) {
    const $modal_box = document.querySelector(
      `#${MODAL_ID.EDIT_MODAL_BOX_COLUMN}`
    )
    super($modal_box)
    this.$editContent = $modal_box.querySelector(
      `.${MODAL_CLASS.MODAL_CONTENT} > input`
    )
    this.$editContent.value = columnTitle
    this.$editBtn = $modal_box.querySelector(`#${MODAL_ID.EDIT_COLUMN_BTN}`)
    this.bindEvent()
    this.editCallback = editCallback
    this.isActive = false
  }

  bindEvent() {
    this.bindEnterEvent = this.enterKeyDown.bind(this)
    this.$editContent.addEventListener('input', this.onInputHandler.bind(this))
    this.$editContent.addEventListener('keydown', this.bindEnterEvent)
    this.$editBtn.onclick = this.editColumn.bind(this)
  }

  onInputHandler(e) {
    const isActive = this.$editContent.value !== ''
    this.updateActive(isActive)
  }

  enterKeyDown(e) {
    if (e.keyCode == 13) {
      this.editColumn()
    }
  }

  updateActive(isActive) {
    this.isActive = isActive

    if (this.isActive) {
      this.$editBtn.classList.remove(CLASS_NAME.UNACTIVE)
      this.$editContent.removeEventListener('keydown', this.bindEnterEvent)
      return
    }

    this.$editBtn.classList.add(CLASS_NAME.UNACTIVE)
  }

  editColumn() {
    if (this.$editContent.value === '') {
      this.$editBtn.classList.add(CLASS_NAME.UNACTIVE)
      return
    }
    this.editCallback(this.$editContent.value)
    this.$editBtn.classList.remove(CLASS_NAME.UNACTIVE)
    this.closeModal()
  }
}
