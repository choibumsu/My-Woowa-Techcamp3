import {
  CLASS_NAME,
  BOARD_CLASS,
  COLUMN_FORM_CLASS,
  COLUMN_CLASS,
  EVENT,
} from '../utils/Constants'
import { templateToElement } from '../utils/HtmlGenerator'
import emitter from '../utils/EventEmitter'
import '../../stylesheets/components/board.scss'
import Column from './Column'
import ColumnForm from './ColumnForm'
import {
  fetchColumn,
  fetchCard,
  createColumnApi,
  createActivityAPI,
} from '../api/index'
import ActivityCard from './ActivityCard'

export default class Board {
  constructor() {
    this.$target = ''
    this.columnList = []
    this.columnForm = new ColumnForm()

    this.init()
  }

  async init() {
    this.setElements()
    await this.setColumnList()
    this.setColumnForm()
    this.render()
    this.bindEvent()
  }

  setElements() {
    const template = `
      <div class='${BOARD_CLASS.BOARD}'>
      </div>
    `

    this.$target = templateToElement(template)
  }

  async setColumnList() {
    const formattedColumns = await this.formatColumns()
    await this.formatCards(formattedColumns)
  }

  async formatColumns() {
    let allColumns = await fetchColumn()

    const formattedColumns = allColumns.reduce((formattedColumns, column) => {
      if (column.prev_column_id === null) column.prev_column_id = 0
      formattedColumns[column.prev_column_id] = {
        id: column.id,
        title: column.title,
      }

      return formattedColumns
    }, {})

    return formattedColumns
  }

  async formatCards(formattedColumns) {
    let allCards = await fetchCard()
    let [columnData, prevColumnId] = [formattedColumns[0], 0]

    while (columnData !== undefined) {
      ;[columnData.cardDatas, allCards] = allCards.reduce(
        ([cardDatas, newAllCards], card) => {
          if (card.column_id === columnData.id) {
            cardDatas[card.next_card_id] = {
              id: card.id,
              title: card.title,
              username: card.name,
            }
          } else {
            newAllCards.push(card)
          }

          return [cardDatas, newAllCards]
        },
        [{}, []]
      )

      const column = new Column({ prevColumnId, ...columnData })
      this.columnList.push(column)
      this.$target.appendChild(column.getTarget())

      prevColumnId = columnData.id
      columnData = formattedColumns[prevColumnId]
    }
  }

  setColumnForm() {
    this.$target.appendChild(this.columnForm.getTarget())
  }

  render() {
    document.body.appendChild(this.$target)
  }

  bindEvent() {
    this.$target.addEventListener('click', this.onClickHandler.bind(this))

    emitter.on(`${EVENT.APPEAR_COLUMN}`, this.appearColumn.bind(this))
    emitter.on(`${EVENT.DISAPPEAR_COLUMN}`, this.disappearColumn.bind(this))
  }

  onClickHandler(e) {
    if (e.target.classList.contains(COLUMN_FORM_CLASS.SUBMIT_BTN)) {
      this.addColumn()
      return
    }

    if (e.target.classList.contains(COLUMN_CLASS.REMOVE_BTN)) {
      this.removeColumn(e)
    }
  }

  async addColumn() {
    const titleValue = this.columnForm.getTitleValue()
    const isActive = this.columnForm.getIsActive()
    const prevColumnId = this.getNewPrevColumnId()

    if (isActive && titleValue === '') {
      return
    }

    const username = localStorage.getItem('username')
    const activityData = {
      content: {
        action: 'added',
        column_title: titleValue,
      },
      created_at: new Date(),
      user_name: username,
      category: 'column',
    }

    createActivityAPI(activityData).then((result) => {
      new ActivityCard(activityData)
    })

    const [data, status] = await createColumnApi({
      title: titleValue,
      prevColumnId,
    })

    if (status === 200) {
      const newColumn = new Column({
        id: data.id,
        title: titleValue,
        prevColumnId,
        cardDatas: [],
      })

      this.$target.insertBefore(
        newColumn.getTarget(),
        this.columnForm.getTarget()
      )
      this.columnList.push(newColumn)

      this.columnForm.setDefault()

      return
    } else if (status === 401) {
      alert('컬럼 추가 권한이 없습니다.')
      return
    }

    // unexcepted error
    alert('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.')
  }

  getNewPrevColumnId() {
    const lastColumn = this.columnForm.getTarget().previousElementSibling
    if (lastColumn) return lastColumn.dataset.id

    return 0
  }

  removeColumn(e) {
    const removedColumnId = +e.target.closest(`.${COLUMN_CLASS.COLUMN}`).dataset
      .id
    const removedColumn = this.columnList.find(
      (column) => column.id === removedColumnId
    )

    this.removePrevColumnId(removedColumn)
    removedColumn.removeTarget()
  }

  removePrevColumnId(removedColumn) {
    const prevColumn = this.columnList.find(
      (column) => column.getPrevColumnId() === removedColumn.getId()
    )

    if (prevColumn) {
      prevColumn.setPrevColumnId(removedColumn.getPrevColumnId())
      return
    }
  }

  appearColumn(columnId) {
    const appearedColumn = this.columnList.find(
      (column) => column.getId() === columnId
    )

    const $nextColumn = appearedColumn.getTarget().nextElementSibling

    if ($nextColumn && $nextColumn.classList.contains(COLUMN_CLASS.COLUMN)) {
      const nextColumn = this.columnList.find(
        (column) => column.getId() === +$nextColumn.dataset.id
      )
      nextColumn.setPrevColumnId(appearedColumn.getId())
    }

    const $prevColumn = appearedColumn.getTarget().previousElementSibling

    if ($prevColumn) {
      appearedColumn.setPrevColumnId(+$prevColumn.dataset.id)
      return
    }
    appearedColumn.setPrevColumnId(0)
  }

  disappearColumn({ originColumnId, newPrevColumnId }) {
    const originColumn = this.columnList.find(
      (column) => column.getId() === originColumnId
    )

    originColumn.setPrevColumnId(newPrevColumnId)
  }
}
