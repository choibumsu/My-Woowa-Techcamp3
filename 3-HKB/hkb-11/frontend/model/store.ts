import { Observable } from '.'
import { GLOBAL } from '../utils/constants'

class GlobalModel extends Observable {
  id: string
  token: string
  login(id, token) {
    this.id = id
    this.token = token
    localStorage.setItem('id', id)
    localStorage.setItem('token', token)
    this.emit(GLOBAL.LOGIN, { id, token })
  }
  logout() {
    localStorage.removeItem('id')
    localStorage.removeItem('token')
    this.id = this.token = null
    this.emit(GLOBAL.LOGOUT)
  }
}

const store = new GlobalModel()

export default store
