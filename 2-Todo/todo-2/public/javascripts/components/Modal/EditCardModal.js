import Modal from './Modal'
import { MODAL_ID, MODAL_CLASS, CLASS_NAME } from '../../utils/Constants'

export default class EditCardModal extends Modal {
  constructor(cardTitle, editCallback) {
    const $modal_box = document.querySelector(
      `#${MODAL_ID.EDIT_MODAL_BOX_CARD}`
    )
    super($modal_box)
    this.$editContent = $modal_box.querySelector(
      `.${MODAL_CLASS.MODAL_CONTENT} > textarea`
    )
    this.$editContent.value = cardTitle
    this.$editBtn = $modal_box.querySelector(`#${MODAL_ID.EDIT_CARD_BTN}`)
    this.bindEvent()
    this.editCallback = editCallback
    this.isActive = false
  }

  bindEvent() {
    this.$editContent.addEventListener('input', this.onInputHandler.bind(this))
    this.$editBtn.onclick = this.editCard.bind(this)
  }

  onInputHandler(e) {
    const isActive = this.$editContent.value !== ''
    this.updateActive(isActive)
  }

  updateActive(isActive) {
    this.isActive = isActive
    if (this.isActive) {
      this.$editBtn.classList.remove(CLASS_NAME.UNACTIVE)
      return
    }

    this.$editBtn.classList.add(CLASS_NAME.UNACTIVE)
  }

  editCard() {
    if (this.$editContent.value === '') {
      this.$editBtn.classList.add(CLASS_NAME.UNACTIVE)
      return
    }
    this.editCallback(this.$editContent.value)
    this.$editBtn.classList.remove(CLASS_NAME.UNACTIVE)
    this.closeModal()
  }
}
