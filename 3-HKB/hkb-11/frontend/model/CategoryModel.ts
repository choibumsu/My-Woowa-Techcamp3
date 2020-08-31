import { Observable } from '.'
import { Category, Invoice } from '../../types'
import { EVENT } from '../utils/constants'

export class CategoryModel extends Observable {
  categories: Array<Category> = []

  fillInvoice(invoice: Invoice) {
    const category = this.findCategoryById(invoice.category.id)
    invoice.category.type = category.type
    invoice.category.title = category.title
  }
  setCategories(categories: Array<Category>) {
    this.clear()
    this.categories = categories
    this.emit(EVENT.SET_CATEGORIES, this.categories)
  }

  findCategoryById(id: number) {
    return this.categories.find((category) => category.id === id)
  }

  clear() {
    this.categories = new Array<Category>()
    this.emit(EVENT.CLEAR_CATEGORIES)
  }

  isEmpty() {
    return this.categories.length === 0
  }

  emitAll() {
    this.emit(EVENT.SET_CATEGORIES, this.categories)
  }
}
