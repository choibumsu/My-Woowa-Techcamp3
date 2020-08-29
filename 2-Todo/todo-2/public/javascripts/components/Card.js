import { templateToElement } from '../utils/HtmlGenerator'
import emitter from '../utils/EventEmitter'
import {
  copyDragElement,
  dragElement,
  toggleMovingStyle,
  getContainerHalfGap,
  getCardHalfGap,
} from '../utils/DragDrop'
import { CARD_CLASS, CLASS_NAME, COLUMN_CLASS, EVENT } from '../utils/Constants'
import '../../stylesheets/components/card.scss'

import {
  updateCardTitle,
  deleteCard,
  moveCardApi,
  updateNextCardIdApi,
  createActivityAPI,
} from '../api/index'
import ActivityCard from './ActivityCard'

export default class Card {
  constructor({ id, title, username, nextCardId }) {
    this.$target = ''
    this.id = id
    this.title = title
    this.username = username
    this.nextCardId = nextCardId

    this.init()
  }

  init() {
    this.setElements()
  }

  setElements() {
    this.template = `
      <div class='card' data-id='${this.id}'>
        <div class='card-content'>
          <img class='document-icon' src='/static/images/document.svg') />
          <div class='content-container'>
            <div class='content-wrapper'>
              <div class='${CARD_CLASS.TITLE}'>${this.title}</div>
              <div class='added-by'>
                <span>Added by </span>
                <span class='strong'>${this.username}</span>
              </div>
            </div>
            <img class='${CARD_CLASS.REMOVE_BTN}' src='/static/images/remove-btn.svg' />
          </div>
        </div>
      </div>
    `

    this.$target = templateToElement(this.template)
    this.$title = this.$target.querySelector(`.${CARD_CLASS.TITLE}`)
  }

  // 드래그 시작시 실행 함수
  moveStart(e) {
    this.copyTarget(e)
    toggleMovingStyle(this.$target)
    this.setPointOffset()

    const $originColumn = this.$target.closest(`.${COLUMN_CLASS.COLUMN}`)
    this.originColumnId = $originColumn.dataset.id
    this.originColumnTitle = $originColumn.querySelector(
      `.${COLUMN_CLASS.TITLE}`
    ).innerText
    this.moveNodesFunc = this.moveNodes.bind(this)
    this.moveStopFunc = this.moveStop.bind(this)
    window.addEventListener('pointermove', this.moveNodesFunc)
    window.addEventListener('pointerup', this.moveStopFunc)
  }

  // 카드를 복사
  copyTarget(e) {
    const scrollLeft = document.querySelector(`.${COLUMN_CLASS.CONTAINER}`)
      .scrollLeft
    const scrollTop = this.$target.closest(`.${COLUMN_CLASS.CONTENT_CONTAINER}`)
      .scrollTop

    const scrollOffset = {
      left: scrollLeft,
      top: scrollTop,
    }

    ;[this.$copyTarget, this.offsetDiff] = copyDragElement(
      e,
      this.$target,
      scrollOffset,
      10
    )

    document.body.appendChild(this.$copyTarget)
  }

  // pointOffsetDiff : 카드 가운데를 기준으로 4개 점을 선택, 점 간 간격은 카드와 컨테이너 간격
  setPointOffset() {
    const targetHalfWidth = this.$target.offsetWidth / 2
    const targetHalfHeight = this.$target.offsetHeight / 2
    const containerHalfGap = getContainerHalfGap()
    const cardHalfGap = getCardHalfGap()

    this.pointOffsetDiffs = [
      {
        x: targetHalfWidth - containerHalfGap,
        y: targetHalfHeight - cardHalfGap,
      },
      {
        x: targetHalfWidth + containerHalfGap,
        y: targetHalfHeight - cardHalfGap,
      },
      {
        x: targetHalfWidth + containerHalfGap,
        y: targetHalfHeight + cardHalfGap,
      },
      {
        x: targetHalfWidth - containerHalfGap,
        y: targetHalfHeight + cardHalfGap,
      },
    ]
  }

  // pointermove 이벤트 발생시 실행 함수
  moveNodes(e) {
    const $points = this.setPoints() // 복제된 카드 중앙에 4개 점을 계산
    this.moveTarget($points) // 4개의 점을 기준으로 카드를 이동
    dragElement(e, this.$copyTarget, this.offsetDiff)
  }

  // 복제된 카드의 중앙 4개점에 해당하는 dom객체를 반환
  setPoints() {
    const $points = this.pointOffsetDiffs.map((pointOffsetDiff) => {
      return document.elementFromPoint(
        this.$copyTarget.offsetLeft + pointOffsetDiff.x,
        this.$copyTarget.offsetTop + pointOffsetDiff.y
      )
    })

    return $points
  }

  moveTarget($points) {
    if ($points.filter(($point) => !$point).length > 0) return

    // 포인트와 겹치는 DOM 객체 중 카드가 있는지 검사, 있으면 그 카드 기준으로 target을 넣고 함수 종료
    for (const $point of $points) {
      const $closestCard = $point.closest(`.${CARD_CLASS.CARD}`)
      if ($closestCard) {
        this.insertAtCard($closestCard)
        return
      }
    }

    // 포인트와 겹치는 컨테이너가 있는지 검사, 있으면 컨테이너에 append
    for (const $point of $points) {
      const $closestContainer = $point.closest(
        `.${COLUMN_CLASS.CONTENT_CONTAINER}`
      )
      if ($closestContainer) {
        $closestContainer.appendChild(this.$target)
        return
      }
    }
  }

  // 가장 가까운 카드와 높이 비교를 하여 앞이나 뒤로 target을 넣음
  insertAtCard($originCard) {
    // target 본인은 제외
    if (+$originCard.dataset.id === this.id) {
      return
    }

    // target이 더 밑에 있으면 insertAfter
    if ($originCard.offsetTop < this.$copyTarget.offsetTop) {
      $originCard.parentNode.insertBefore(
        this.$target,
        $originCard.nextElementSibling
      )
      return
    }
    // target이 더 위에 있으면 insetBefore
    $originCard.parentNode.insertBefore(this.$target, $originCard)
  }

  // pointerup 이벤트 발생시 실행되는 함수
  async moveStop() {
    const $targetColumn = this.$target.closest(`.${COLUMN_CLASS.COLUMN}`)
    const targetColumnTitle = $targetColumn.querySelector(
      `.${COLUMN_CLASS.TITLE}`
    ).innerText

    const columnId = $targetColumn.dataset.id

    const status = await moveCardApi({
      cardId: this.id,
      columnId,
      userId: 1,
    })

    const username = localStorage.getItem('username')
    const activityData = {
      content: {
        action: 'moved',
        from_column: this.originColumnTitle,
        to_column: targetColumnTitle,
        card_title: this.title,
      },
      user_name: username,
      category: 'card',
      created_at: new Date(),
    }

    createActivityAPI(activityData).then((result) => {
      new ActivityCard(activityData)
    })

    if (status === 200) {
      emitter.emit(`${EVENT.REMOVE_CARD}-${this.originColumnId}`, this)
      emitter.emit(`${EVENT.INSERT_CARD}-${columnId}`, this)

      this.$copyTarget.remove()
      toggleMovingStyle(this.$target)

      window.removeEventListener('pointermove', this.moveNodesFunc)
      window.removeEventListener('pointerup', this.moveStopFunc)

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

  getTarget() {
    return this.$target
  }

  getId() {
    return this.id
  }

  getUsername() {
    return this.username
  }

  getTitle() {
    return this.title
  }

  setTitle(editedTitle) {
    const username = localStorage.getItem('username')
    const activityData = {
      content: {
        action: 'updated',
        card_title: editedTitle,
      },
      user_name: username,
      category: 'card',
      created_at: new Date(),
    }

    createActivityAPI(activityData).then((result) => {
      new ActivityCard(activityData)
    })

    updateCardTitle({
      title: editedTitle,
      id: this.id,
      username: this.username,
    })
    this.title = editedTitle
    this.$title.innerText = this.title
  }

  async setNextCardId(nextCardId) {
    this.nextCardId = nextCardId

    const status = await updateNextCardIdApi({
      nextCardId: this.nextCardId,
      cardId: this.id,
      userId: 1,
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

  async removeTarget() {
    const username = localStorage.getItem('username')
    const activityData = {
      content: {
        action: 'removed',
        card_title: this.title,
      },
      user_name: username,
      category: 'card',
      created_at: new Date(),
    }

    createActivityAPI(activityData).then((result) => {
      new ActivityCard(activityData)
    })

    const [data, status] = await deleteCard({
      id: this.id,
      username: this.username,
    })

    if (status === 200) {
      this.$target.remove()
      return
    }

    alert('삭제 권한이 없습니다.')
  }
}
