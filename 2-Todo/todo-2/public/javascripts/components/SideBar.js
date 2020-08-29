import { CLASS_NAME, SIDEBAR_CLASS } from '../utils/Constants'
import { templateToElement } from '../utils/HtmlGenerator'
import '../../stylesheets/components/sidebar.scss'

import ActivityCard from './ActivityCard'
import { fetchActivityCard } from '../api'

export default class SideBar {
  constructor() {
    this.$target = ''

    this.init()
  }

  async init() {
    this.setElements()
    this.getActivityCard()
    this.render()
  }

  setElements() {
    const template = `
      <div class='${SIDEBAR_CLASS.SIDEBAR} ${CLASS_NAME.DP_NONE}'>
        <div class='menu'>
          <img src='/static/images/menu.png' />
          <div>Menu</div>
        </div>
        <div class='activity'>
          <img src='/static/images/notification.png' />
          <div>Activity</div>
        </div>
        <div id='activity__column'></div>
      </div>
    `

    this.$target = templateToElement(template)
  }

  render() {
    document.body.appendChild(this.$target)
  }

  async getActivityCard() {
    try {
      const allCardActivitys = await fetchActivityCard()

      allCardActivitys.forEach((cardActivity) => {
        new ActivityCard(cardActivity)
      })
    } catch (e) {
      console.log(e)
    }
  }
}
