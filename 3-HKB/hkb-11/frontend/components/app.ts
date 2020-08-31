import { Component } from '.'
import { PaymentModel } from '../model/PaymentModel'
import router from '../router'
import { ROUTE, ROUTER } from '../utils/constants'
import { Container } from './Container'
import ContainerView from './Container/view'
import { Header } from './Header'
import { default as HeaderView } from './Header/view'
import { Login } from './Login'
import LoginView from './Login/view'
import { Modal } from './Modal'
import ModalView from './Modal/view'
import { View } from './view'

const template: string = `<div id="app"></div>`

export class AppView extends View {
  modalView: ModalView = new ModalView()
  headerView: HeaderView = new HeaderView()
  containerView: ContainerView = new ContainerView()
  loginView: LoginView = new LoginView()

  constructor() {
    super(template)
    this.appendChildViews()
  }
  appendChildViews() {
    this.modalView.appendToView(this)
    this.loginView.appendToView(this)
    this.headerView.appendToView(this)
    this.containerView.appendToView(this)

    this.headerView.bindModalShowHandler(() => {
      this.modalView.showModal()
    })
  }
  mount(): void {}
}

export class App extends Component<AppView> {
  paymentModel: PaymentModel = new PaymentModel()
  header: Header
  modal: Modal
  container: Container
  login: Login

  constructor(view: AppView) {
    super(null, view)

    this.header = new Header(this, this.view.headerView)
    this.modal = new Modal(this, this.view.modalView)
    this.container = new Container(this, this.view.containerView)
    this.login = new Login(this, this.view.loginView)

    router.on(ROUTER.MUTATE_VIEW, ({ path, flag }) => {
      if (path === ROUTE.LOGIN && flag) {
        this.header.view.hide()
        this.login.view.show()
        return
      }
      this.login.view.hide()
      this.header.view.show()
    })
  }
}
