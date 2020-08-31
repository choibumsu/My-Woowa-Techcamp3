import { Component } from '..'
import store from '../../model/store'
import router from '../../router'
import { GLOBAL, ROUTER } from '../../utils/constants'
import { Navigator } from '../Navigator'
import HeaderView from './view'

export class Header extends Component<HeaderView> {
  navigator: Navigator

  constructor(parent, view) {
    super(parent, view)

    this.navigator = new Navigator(this, this.view.navigatorView)
    this.view.navigatorView.appendToView(this.view)

    store.on(GLOBAL.LOGIN, () => {
      this.view.login()
    })
    store.on(GLOBAL.LOGOUT, () => {
      this.view.logout()
    })
    router.on(ROUTER.CHANGE_DATE, ({ year, month }) => {
      this.view.navigatorView.setDate(year, month)
    })
  }
}
