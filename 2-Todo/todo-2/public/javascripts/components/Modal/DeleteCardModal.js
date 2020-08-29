import Modal from './Modal'
import { MODAL_ID, MODAL_CLASS,CLASS_NAME } from '../../utils/Constants'

export default class DeleteCardModal extends Modal {
  constructor(cardTitle, deleteCallback) {
    const $modal_box = document.querySelector(
      `#${MODAL_ID.DELETE_MODAL_BOX_CARD}`
    )
    super($modal_box)
    this.$deleteContent = $modal_box.querySelector(
      `.${MODAL_CLASS.MODAL_CONTENT} > textarea`
    )
    this.$deleteContent.value = cardTitle
    this.$deleteBtn = $modal_box.querySelector(`#${MODAL_ID.DELETE_CARD_BTN}`)
    this.bindEvent()
    this.deleteCallback = deleteCallback
  }

  bindEvent() {
    this.$deleteBtn.onclick = this.deleteCard.bind(this)
  }

  deleteCard() {
    this.deleteCallback()
    this.closeModal()
  }
}
