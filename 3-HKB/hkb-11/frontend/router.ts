import { Observable } from './model'
import store from './model/store'
import { CLASS, GLOBAL, ROUTE, ROUTER, ROUTES } from './utils/constants'

class Router extends Observable {
  url: URL
  year: number = new Date().getFullYear()
  month: number = new Date().getMonth() + 1
  beforePath: string
  anchors: HTMLAnchorElement[] = []
  routes: Set<string> = new Set(ROUTES.ALL)
  constructor() {
    super()
    store.on(GLOBAL.LOGIN, () => {
      this.go(ROUTE.LIST)
    })
    store.on(GLOBAL.LOGOUT, () => {
      this.go(ROUTE.LOGIN)
    })

    document.body.addEventListener(
      'click',
      this.bindAnchorNavigateHandler.bind(this)
    )
    window.onpopstate = this.onPopState.bind(this)
    window.addEventListener(
      'DOMContentLoaded',
      this.loadAnchorElementFromDOM.bind(this)
    )
  }
  loadAnchorElementFromDOM() {
    this.anchors = Array.from(document.querySelectorAll('a')).filter(($node) =>
      ROUTES.CONTAINER.includes($node.getAttribute('to'))
    )
  }
  bindAnchorNavigateHandler({ target: $target }) {
    const $anchorElement = $target.closest('a')
    if (!$anchorElement) return
    const path = $anchorElement.getAttribute('to')
    if (path === ROUTE.PREVIOUS_MONTH) {
      this.movePreviousMonth()
      this.pushURL()
      return
    }
    if (path === ROUTE.NEXT_MONTH) {
      this.moveNextMonth()
      this.pushURL()
      return
    }
    this.go(path)
  }

  onPopState(event) {
    const { state } = event
    const { path, year, month } = state
    if (path !== ROUTE.LOGIN) {
      this.year = year
      this.month = month
      this.commitDateChange()
    }
    this.go(path, true)
  }
  getURL() {
    this.url = new URL(window.location.href)
  }
  parseURL() {
    this.getURL()
    const path = this.url.pathname.substr(1)
    const year = parseInt(this.url.searchParams.get('year'))
    const month = parseInt(this.url.searchParams.get('month'))

    if (!(this.year === year && this.month === month) && year && month) {
      this.year = year
      this.month = month
    }
    if (!store.token) {
      this.go(ROUTE.LOGIN)
      return
    }
    if (path === '') this.go(ROUTE.LIST)
    if (this.isInvalidPath(path)) return
    this.go(path)
  }
  commitDateChange() {
    this.emit(ROUTER.CHANGE_DATE, { year: this.year, month: this.month })
  }
  pushURL() {
    const { beforePath, year, month } = this
    if (beforePath === ROUTE.LOGIN) {
      history.pushState({ path: ROUTE.LOGIN }, '', ROUTE.LOGIN)
      return
    }
    const params = `year=${year}&month=${month}`
    history.pushState(
      { path: beforePath, year, month },
      '',
      `${beforePath}?${params}`
    )
    this.anchors.forEach(($node) => {
      const path = $node.getAttribute('to')
      if (path === this.beforePath) {
        $node.classList.add(CLASS.ACTIVE)
        return
      }
      $node.classList.remove(CLASS.ACTIVE)
    })
  }
  movePreviousMonth() {
    if (this.month == 1) {
      this.year -= 1
      this.month = 12
    } else this.month -= 1
    this.commitDateChange()
  }
  moveNextMonth() {
    if (this.month == 12) {
      this.year += 1
      this.month = 1
    } else this.month += 1
    this.commitDateChange()
  }
  isInvalidPath(path) {
    return !this.routes.has(path)
  }
  go(path, fromPopState = false) {
    const isFirstNavigation = this.beforePath === undefined
    const isFromLogin = this.beforePath === ROUTE.LOGIN
    if (path === null) return
    if (this.beforePath == path) return
    if (this.isInvalidPath(path)) return
    if (!isFirstNavigation) {
      this.emit(ROUTER.MUTATE_VIEW, {
        path: this.beforePath,
        flag: false,
      })
    }
    this.emit(ROUTER.MUTATE_VIEW, {
      path,
      flag: true,
    })
    this.beforePath = path

    if (!fromPopState) this.pushURL()
    if (path === ROUTE.LOGIN) {
      return
    }
    if (isFirstNavigation || isFromLogin) {
      this.commitDateChange()
    }
  }

  getYear() {
    return this.year
  }
  getMonth() {
    return this.month
  }
}

const router = new Router()

export default router
