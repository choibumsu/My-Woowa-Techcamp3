import store from '../../model/store'
import LoginView from '../Login/view'
import NavigatorView from '../Navigator/view'
import { View } from '../view'
import './style.scss'
import { template } from './template'

export default class HeaderView extends View {
  loginView: LoginView
  navigatorView: NavigatorView
  $buttonPaymentModal: HTMLButtonElement
  $login: HTMLAnchorElement
  $logout: HTMLAnchorElement

  constructor() {
    super(template)
    this.$logout.addEventListener('click', () => {
      store.logout()
    })
  }
  login() {
    this.$login.classList.add('hidden')
    this.$logout.classList.remove('hidden')
  }
  logout() {
    this.$logout.classList.add('hidden')
    this.$login.classList.remove('hidden')
  }
  mount(): void {
    this.loginView = new LoginView()
    this.navigatorView = new NavigatorView()

    this.$buttonPaymentModal = <HTMLButtonElement>(
      this.query('.button-payment-modal')
    )
    this.$login = <HTMLAnchorElement>this.query('.link-login')
    this.$logout = <HTMLAnchorElement>this.query('.link-logout')
  }

  bindModalShowHandler(handler) {
    this.$buttonPaymentModal.addEventListener('click', handler)
  }
}
