import { App, AppView } from './components/app'
import store from './model/store'
import router from './router'
import './static/index.html'
import './static/styles/base.scss'
const body = document.body
const app = new App(new AppView())

app.mount(body)

const id = localStorage.getItem('id')
if (id) {
  const token = localStorage.getItem('token')
  store.login(id, token)
}
router.parseURL()
