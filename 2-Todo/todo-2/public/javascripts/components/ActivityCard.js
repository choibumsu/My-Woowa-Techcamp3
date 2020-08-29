import { templateToElement } from '../utils/HtmlGenerator'
import '../../stylesheets/components/activityCard.scss'
import {
  TIME,
  SIDEBAR_ID,
  CARD_ACTIVITY_TEMPLATE,
  COLUMN_ACTIVITY_TEMPLATE,
} from '../utils/Constants'

export default class ActivityCard {
  constructor(data) {
    this.$target = ''
    this.content = ''
    this.time = new Date(data.created_at)
    this.$activityColumn = ''
    this.data = data
    this.init()
  }

  init() {
    const template = this.getTemplate(
      this.data.category,
      this.data.content.action
    )
    this.content = this.transferHTML(this.data, template)
    this.setElements()
  }

  setElements() {
    const template = `
      <div id="activity__card">
        <div class="content">${this.content}</div>
        <div class="time">${this.timeForamt()}</div>
      </div>
    `
    this.$activityColumn = document.querySelector(
      `#${SIDEBAR_ID.ACTIVITY_COLUMN}`
    )
    this.$target = templateToElement(template)
    this.$activityColumn.prepend(this.$target)
  }

  timeForamt() {
    const oldSecond = this.time.getTime() / 1000
    const currentSecond = new Date().getTime() / 1000
    let timediff = parseInt((currentSecond - oldSecond).toFixed(0))
    var timeString = ''
    if (timediff < TIME.SECOND) {
      timeString = `${timediff} seconds ago`
    } else if (timediff < TIME.MINUTE_TO_SECOND) {
      timediff = (timediff / TIME.SECOND).toFixed(0)
      timeString = `${timediff} minutes ago`
    } else if (timediff < TIME.HOUR_TO_SECOND) {
      timediff = (timediff / TIME.MINUTE_TO_SECOND).toFixed(0)
      timeString = `${timediff} hours ago`
    } else {
      timediff = (timediff / TIME.HOUR_TO_SECOND).toFixed(0)
      if (timediff == '1') timeString = `${timediff} day ago`
      else timeString = `${timediff} days ago`
    }
    return timeString
  }

  getTemplate(category, action) {
    if (category === 'card') {
      switch (action) {
        case 'moved':
          return CARD_ACTIVITY_TEMPLATE.MOVED
        case 'added':
          return CARD_ACTIVITY_TEMPLATE.ADDED
        case 'updated':
          return CARD_ACTIVITY_TEMPLATE.UPDATED
        case 'removed':
          return CARD_ACTIVITY_TEMPLATE.REMOVED
      }
    } else if (category === 'column') {
      switch (action) {
        case 'moved':
          return COLUMN_ACTIVITY_TEMPLATE.MOVED
        case 'added':
          return COLUMN_ACTIVITY_TEMPLATE.ADDED
        case 'updated':
          return COLUMN_ACTIVITY_TEMPLATE.UPDATED
        case 'removed':
          return COLUMN_ACTIVITY_TEMPLATE.REMOVED
      }
    }
  }

  transferHTML(data, template) {
    template = template.replace('$username', data.user_name)
    for (let key in data.content) {
      const value = data.content[key]
      template = template.replace('$' + key, value)
    }

    return template
  }
}
