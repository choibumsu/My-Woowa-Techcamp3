import '../../stylesheets/components/header.scss'

import { CLASS_NAME, HEADER_CLASS, SIDEBAR_CLASS } from '../utils/Constants'
import { templateToElement } from '../utils/HtmlGenerator'
import { logoutApi } from '../api/index'

export default class Header {
  constructor({ name }) {
    this.$target = ''
    this.username = name

    this.init()
  }

  async init() {
    this.setElements()
    this.render()
    this.bindEvent()
  }

  setElements() {
    const template = `
      <header id='page-header'>
        <div class='left-side'>
          <div class='title'>TODO List</div>
          <div class='username-wrapper'>
            <div class='${HEADER_CLASS.USERNAME}'>${this.username}</div>
            <div>님</div>
          </div>
        </div>
        <div class='right-side'>
          <div class='${HEADER_CLASS.LOGOUT_BTN}'>LOGOUT</div>
          <div class='${HEADER_CLASS.MENU}'>MENU</div>
        </div>
      </header>
    `

    this.$target = templateToElement(template)
    this.$menuBtn = this.$target.querySelector(`.${HEADER_CLASS.MENU}`)
  }

  render() {
    document.body.appendChild(this.$target)
  }

  bindEvent() {
    this.$target.addEventListener('click', this.onClickHandler.bind(this))
  }

  onClickHandler(e) {
    if (e.target.classList.contains(HEADER_CLASS.LOGOUT_BTN)) {
      this.deleteAuth()
      return
    }

    if (e.target.classList.contains(HEADER_CLASS.MENU)) {
      this.toggleMenu()
      return
    }
  }

  async deleteAuth() {
    const status = await logoutApi()

    if (status === 200) {
      localStorage.removeItem('username')
      localStorage.removeItem('userId')
      window.location.reload()
      return
    } else if (status === 404) {
      alert('로그인 정보가 유효하지 않습니다.')
      return
    }

    // unexcepted error
    alert('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.')
  }

  toggleMenu() {
    const $sidebar = document.querySelector(`.${SIDEBAR_CLASS.SIDEBAR}`)

    if ($sidebar.classList.contains(CLASS_NAME.DP_NONE)) {
      $sidebar.classList.remove(CLASS_NAME.DP_NONE)
      return
    }
    $sidebar.classList.add(CLASS_NAME.DP_NONE)
  }
}
