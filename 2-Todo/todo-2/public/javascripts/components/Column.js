import { templateToElement } from '../utils/HtmlGenerator'
import {
  COLUMN_CLASS,
  CARD_CLASS,
  CARD_FORM_CLASS,
  CLASS_NAME,
  EVENT,
} from '../utils/Constants'
import emitter from '../utils/EventEmitter'
import {
  copyDragElement,
  dragElement,
  toggleMovingStyle,
} from '../utils/DragDrop'
import '../../stylesheets/components/column.scss'

import CardForm from './CardForm'
import Card from './Card'
import EditColumnModal from './Modal/EditColumnModal'
import EditCardModal from './Modal/EditCardModal'
import DeleteCardModal from './Modal/DeleteCardModal'
import {
  updateColumnTitle,
  createCardApi,
  deleteColumnApi,
  updatePrevColumnIdApi,
  createActivityAPI,
} from '../api/index'
import ActivityCard from './ActivityCard'

export default class Column {
  constructor({ id, title, cardDatas, prevColumnId }) {
    this.$target = ''
    this.id = id
    this.title = title
    this.prevColumnId = +prevColumnId
    this.cardList = Array(Object.keys(cardDatas).length)
    this.cardForm = new CardForm()

    this.init(cardDatas)
  }

  init(cardDatas) {
    this.setElements()
    this.setCardList(cardDatas)
    this.setCardForm()
    this.bindEvent()
  }

  setElements() {
    const template = `
      <section class='${COLUMN_CLASS.COLUMN}' data-id='${this.id}'>
        <div class='${COLUMN_CLASS.TITLE_BAR}'>
          <div class='title-wrapper'>
            <div class='${COLUMN_CLASS.CARD_COUNT}'>
              ${this.cardList.length}
            </div>
            <div class='${COLUMN_CLASS.TITLE}'>${this.title}</div> 
          </div>
          <div class='btn-wrapper'>
            <img class='${COLUMN_CLASS.ADD_BTN}' src='/static/images/plus-btn.svg' alt='add-btn' />
            <img class='${COLUMN_CLASS.REMOVE_BTN}' src='/static/images/remove-btn.svg' alt='remove-btn' />
          </div>
        </div>
        <div class='${COLUMN_CLASS.CARD_FORM_SLOT}'></div>
        <div class='${COLUMN_CLASS.CONTENT_CONTAINER}'></div>
      </section>
    `

    this.$target = templateToElement(template)
    this.$title = this.$target.querySelector(`.${COLUMN_CLASS.TITLE}`)
    this.$cardCount = this.$target.querySelector(`.${COLUMN_CLASS.CARD_COUNT}`)
    this.$contentContainer = this.$target.querySelector(
      `.${COLUMN_CLASS.CONTENT_CONTAINER}`
    )
  }

  setCardList(cardDatas) {
    this.cardList = []

    let [cardData, nextCardId] = [cardDatas[0], 0]
    while (cardData !== undefined) {
      const card = new Card({ nextCardId, ...cardData })

      this.cardList.push(card)
      this.$contentContainer.prepend(card.getTarget())
      nextCardId = cardData.id
      cardData = cardDatas[cardData.id]
    }
  }

  setCardForm() {
    const $cardFormSlot = this.$target.querySelector(
      `.${COLUMN_CLASS.CARD_FORM_SLOT}`
    )
    $cardFormSlot.appendChild(this.cardForm.getTarget())
  }

  bindEvent() {
    this.$target.addEventListener(
      'pointerdown',
      this.onPointerDownHandler.bind(this)
    )
    this.$target.addEventListener('click', this.onClickHandler.bind(this))
    this.$target.addEventListener(
      'dblclick',
      this.onDoubleClickHandler.bind(this)
    )

    emitter.on(`${EVENT.INSERT_CARD}-${this.id}`, this.insertCard.bind(this))
    emitter.on(`${EVENT.REMOVE_CARD}-${this.id}`, this.removeCard.bind(this))
  }

  onPointerDownHandler(e) {
    const targetTitleBar = e.target.closest(`.${COLUMN_CLASS.TITLE_BAR}`)

    if (targetTitleBar) return

    const targetCardFormSlot = e.target.closest(
      `.${COLUMN_CLASS.CARD_FORM_SLOT}`
    )
    if (targetCardFormSlot) return

    if (e.target.classList.contains(CARD_CLASS.REMOVE_BTN)) return

    const targetCard = e.target.closest(`.${CARD_CLASS.CARD}`)
    if (targetCard) {
      this.dragCardStart(e, targetCard)
      return
    }

    const targetColumnId = +e.target.closest(`.${COLUMN_CLASS.COLUMN}`).dataset
      .id
    if (targetColumnId === this.id) {
      this.dragColumnStart(e)
      return
    }
  }

  onClickHandler(e) {
    if (e.target.classList.contains(COLUMN_CLASS.ADD_BTN)) {
      this.cardForm.toggleCardForm()
      return
    }

    if (e.target.classList.contains(CARD_CLASS.REMOVE_BTN)) {
      this.showCardDeleteModal(e)
      return
    }

    if (e.target.classList.contains(CARD_FORM_CLASS.ADD_BTN)) {
      this.addCard()
      return
    }

    if (e.target.classList.contains(CARD_FORM_CLASS.CANCEL_BTN)) {
      this.cardForm.toggleCardForm()
      return
    }
  }

  onDoubleClickHandler(e) {
    if (e.target.classList.contains(COLUMN_CLASS.TITLE)) {
      this.showColumnEditModal(this.originColumnTitle)
      return
    }

    const targetCard = e.target.closest(`.${CARD_CLASS.CARD}`)

    if (targetCard) {
      this.showCardEditModal(targetCard)
      return
    }
  }

  async addCard() {
    const cardTitle = this.cardForm.getCardTitle()
    if (cardTitle === '') return
    const nextCardId = this.getNewNextCardId()
    const userId = localStorage.getItem('userId')

    const [data, status] = await createCardApi({
      cardTitle,
      nextCardId,
      columnId: this.id,
      userId,
    })

    if (status === 200) {
      const username = localStorage.getItem('username')
      const cardData = {
        id: data.id,
        title: cardTitle,
        username,
        nextCardId,
      }

      const activityData = {
        content: {
          action: 'added',
          to_column: this.title,
          card_title: cardTitle,
        },
        created_at: new Date(),
        user_name: cardData.username,
        category: 'card',
      }

      createActivityAPI(activityData).then((result) => {
        new ActivityCard(activityData)
      })

      const newCard = new Card(cardData)
      this.cardList.push(newCard)
      this.$contentContainer.prepend(newCard.getTarget())

      this.setCardCount()
      return
    } else if (status === 401) {
      alert('카드 추가 권한이 없습니다.')
      return
    } else if (status === 404) {
      alert('컬럼이 존재하지 않습니다.')
      return
    }

    // unexcepted error
    alert('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.')
  }

  getNewNextCardId() {
    if (this.cardList.length === 0) {
      return 0
    }

    return this.cardList[this.cardList.length - 1].getId()
  }

  showCardDeleteModal(e) {
    const removedCardId = parseInt(
      e.target.closest(`.${CARD_CLASS.CARD}`).dataset.id
    )
    const removedCard = this.cardList.find(
      (card) => card.getId() === removedCardId
    )

    const username = localStorage.getItem('username')
    if (username !== removedCard.getUsername()) return

    const modal = new DeleteCardModal(removedCard.getTitle(), () => {
      this.removeCard(removedCard)
      removedCard.removeTarget()
    })
    modal.showModal()
  }

  removeCard(removedCard) {
    const removedCardId = removedCard.getId()

    this.removeNextCardId(removedCardId)

    this.cardList = this.cardList.filter(
      (card) => card.getId() !== removedCardId
    )
    this.setCardCount()
  }

  removeNextCardId(removedCardId) {
    const removedIndex = this.cardList.findIndex(
      (card) => card.getId() === removedCardId
    )

    if (removedIndex === this.cardList.length - 1) return

    const prevCard = this.cardList[removedIndex + 1]

    if (removedIndex === 0) {
      prevCard.setNextCardId(0)
      return
    }

    const nextCard = this.cardList[removedIndex - 1]
    prevCard.setNextCardId(nextCard.getId())
  }

  setCardCount() {
    this.$cardCount.innerHTML = this.cardList.length
  }

  showColumnEditModal() {
    this.$title.classList.add(CLASS_NAME.US_NONE)

    const modal = new EditColumnModal(this.title, (editedTitle) => {
      this.setTitle(editedTitle)
    })
    modal.showModal()
    this.$title.classList.remove(CLASS_NAME.US_NONE)
  }

  setTitle(editedTitle) {
    const username = localStorage.getItem('username')
    const activityData = {
      content: {
        action: 'updated',
        from_column_title: this.title,
        to_column_title: editedTitle,
      },
      user_name: username,
      category: 'column',
      created_at: new Date(),
    }
    createActivityAPI(activityData).then((result) => {
      new ActivityCard(activityData)
    })

    updateColumnTitle({
      title: editedTitle,
      id: this.id,
    })
    this.title = editedTitle
    this.$title.innerText = this.title
  }

  showCardEditModal(targetCard) {
    const editedCard = this.cardList.find(
      (card) => card.getId() === +targetCard.dataset.id
    )

    const username = localStorage.getItem('username')
    if (editedCard.getUsername() !== username) return

    const modal = new EditCardModal(editedCard.getTitle(), (editedTitle) => {
      editedCard.setTitle(editedTitle)
    })
    modal.showModal()
  }

  dragCardStart(e, targetCard) {
    const movedCard = this.cardList.find(
      (card) => card.getId() === +targetCard.dataset.id
    )
    movedCard.moveStart(e)
  }

  insertCard(insertedCard) {
    const $insertedCard = insertedCard.getTarget()
    const $nextCard = $insertedCard.nextElementSibling
    const $prevCard = $insertedCard.previousElementSibling

    this.updateNextCard(insertedCard, $nextCard)
    this.updatePrevCard(insertedCard, $prevCard)

    if ($nextCard) {
      const nextCardIndex = this.cardList.findIndex(
        (card) => card.getId() === +$nextCard.dataset.id
      )
      this.cardList.splice(nextCardIndex + 1, 0, insertedCard)
    } else if ($prevCard) {
      const prevCardIndex = this.cardList.findIndex(
        (card) => card.getId() === +$prevCard.dataset.id
      )
      this.cardList.splice(prevCardIndex, 0, insertedCard)
    } else {
      this.cardList.push(insertedCard)
    }

    this.setCardCount()
  }

  updateNextCard(insertedCard, $nextCard) {
    if ($nextCard) {
      insertedCard.setNextCardId(+$nextCard.dataset.id)
      return
    }
    insertedCard.setNextCardId(0)
  }

  updatePrevCard(insertedCard, $prevCard) {
    if ($prevCard) {
      const prevCard = this.cardList.find(
        (card) => card.getId() === +$prevCard.dataset.id
      )
      prevCard.setNextCardId(insertedCard.getId())
    }
  }

  dragColumnStart(e) {
    this.copyTarget(e)
    toggleMovingStyle(this.$target)

    const $nextColumn = this.$target.nextElementSibling
    if ($nextColumn) {
      this.originNextColumnId = +$nextColumn.dataset.id
    }

    this.moveNodesFunc = this.moveNodes.bind(this)
    this.moveStopFunc = this.moveStop.bind(this)
    window.addEventListener('pointermove', this.moveNodesFunc)
    window.addEventListener('pointerup', this.moveStopFunc)
  }

  copyTarget(e) {
    const scrollLeft = document.querySelector(`.${COLUMN_CLASS.CONTAINER}`)
      .scrollLeft

    const scrollOffset = {
      left: scrollLeft,
      top: 0,
    }

    ;[this.$copyTarget, this.offsetDiff] = copyDragElement(
      e,
      this.$target,
      scrollOffset,
      10
    )

    document.body.appendChild(this.$copyTarget)
  }

  moveNodes(e) {
    this.moveTarget()
    dragElement(e, this.$copyTarget, this.offsetDiff)
  }

  moveTarget() {
    const centerOffsetLeft =
      this.$copyTarget.offsetLeft + this.$copyTarget.offsetWidth / 2

    const $nextColumn = this.$target.nextElementSibling
    if ($nextColumn && centerOffsetLeft > $nextColumn.offsetLeft) {
      this.$target.parentNode.insertBefore(
        this.$target,
        $nextColumn.nextElementSibling
      )
      return
    }

    const $prevColumn = this.$target.previousElementSibling
    if (
      $prevColumn &&
      centerOffsetLeft < $prevColumn.offsetLeft + $prevColumn.offsetWidth
    ) {
      this.$target.parentNode.insertBefore(this.$target, $prevColumn)
      return
    }
  }

  async moveStop() {
    const username = localStorage.getItem('username')
    const activityData = {
      content: {
        action: 'moved',
        column_title: this.title,
      },
      user_name: username,
      category: 'column',
      created_at: new Date(),
    }

    createActivityAPI(activityData).then((result) => {
      new ActivityCard(activityData)
    })

    this.$copyTarget.remove()
    toggleMovingStyle(this.$target)
    if (this.originNextColumnId) {
      emitter.emit(`${EVENT.DISAPPEAR_COLUMN}`, {
        originColumnId: this.originNextColumnId,
        newPrevColumnId: this.prevColumnId,
      })
    }
    emitter.emit(`${EVENT.APPEAR_COLUMN}`, this.id)

    window.removeEventListener('pointermove', this.moveNodesFunc)
    window.removeEventListener('pointerup', this.moveStopFunc)
  }

  getTarget() {
    return this.$target
  }

  async removeTarget() {
    const username = localStorage.getItem('username')
    const activityData = {
      content: {
        action: 'removed',
        column_title: this.title,
      },
      user_name: username,
      category: 'column',
      created_at: new Date(),
    }

    createActivityAPI(activityData).then((result) => {
      new ActivityCard(activityData)
    })

    const status = await deleteColumnApi({
      id: this.id,
      userId: 1,
    })

    if (status === 200) {
      this.$target.remove()
      return
    } else if (status === 401) {
      alert('컬럼 삭제 권한이 없습니다.')
      return
    } else if (status === 404) {
      alert('컬럼이 존재하지 않습니다.')
      return
    }

    // unexcepted error
    alert('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.')
  }

  getId() {
    return this.id
  }

  getPrevColumnId() {
    return this.prevColumnId
  }

  async setPrevColumnId(prevColumnId) {
    this.prevColumnId = prevColumnId

    const status = await updatePrevColumnIdApi({
      prevColumnId: this.prevColumnId,
      columnId: this.id,
    })

    if (status === 200) {
      return
    } else if (status === 401) {
      alert('카드 추가 권한이 없습니다.')
      return
    } else if (status === 404) {
      alert('카드가 존재하지 않습니다.')
      return
    }

    // unexcepted error
    alert('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.')
  }
}
