import { Category, Invoice, PaymentMethod } from '../../../types'
import { formatAmount } from '../../utils'
import { CLASS, CONSTANT, FORM_CLASS } from '../../utils/constants'
import { templateToElement } from '../../utils/ElementGenerator'
import { View } from '../view'
import './style.scss'
import { optionTemplate, template } from './template'

function formatInputAmount($target: HTMLInputElement) {
  $target.value = formatAmount($target.value)
}

function getNumberByAmount(amount: string): number {
  return parseInt(amount.replace(',', ''))
}

function formatDate(date: Date) {
  // return datetime format = yyyy-MM-ddThh:mm
  const timezoneOffset = date.getTimezoneOffset() * 60000
  const timezoneDate = new Date(+date - timezoneOffset)
  return timezoneDate.toISOString().slice(0, 16)
}

export default class FormView extends View {
  $earning: HTMLButtonElement
  $spending: HTMLButtonElement
  $amount: HTMLInputElement
  $date: HTMLInputElement
  $item: HTMLInputElement
  $category: HTMLSelectElement
  $payment: HTMLSelectElement
  $remove: HTMLButtonElement
  $clear: HTMLButtonElement
  $submit: HTMLButtonElement
  invoiceId: number = 0
  categoryType: string = CONSTANT.SPENDING
  invoiceAddHandler: Function
  invoiceRemoveHandler: Function
  invoiceUpdateHandler: Function

  constructor() {
    super(template)

    this.$element.addEventListener('click', this.onClickHandler.bind(this))
    this.$element.addEventListener('input', this.onInputHandler.bind(this))
    this.$element.addEventListener('keydown', this.onKeydownHandler.bind(this))
  }

  mount(): void {
    this.$earning = <HTMLButtonElement>(
      this.query(`.${FORM_CLASS.EARNING_TOGGLE}`)
    )
    this.$spending = <HTMLButtonElement>(
      this.query(`.${FORM_CLASS.SPENDING_TOGGLE}`)
    )

    this.$amount = <HTMLInputElement>this.query(`.${FORM_CLASS.INPUT_AMOUNT}`)
    this.$date = <HTMLInputElement>this.query(`.${FORM_CLASS.INPUT_DATE}`)
    this.$item = <HTMLInputElement>this.query(`.${FORM_CLASS.INPUT_ITEM}`)
    this.$category = <HTMLSelectElement>(
      this.query(`.${FORM_CLASS.SELECT_CATEGORY}`)
    )
    this.$payment = <HTMLSelectElement>(
      this.query(`.${FORM_CLASS.SELECT_PAYMENT}`)
    )
    this.$remove = <HTMLButtonElement>this.query(`.${FORM_CLASS.REMOVE_BTN}`)
    this.$clear = <HTMLButtonElement>this.query(`.${FORM_CLASS.CLEAR_BTN}`)
    this.$submit = <HTMLButtonElement>this.query(`.${FORM_CLASS.SUBMIT_BTN}`)
    this.setCategoryType(CONSTANT.SPENDING)
    this.clear()
  }

  bindInvoiceAddHandler(handler) {
    this.invoiceAddHandler = handler
  }

  bindInvoiceRemoveHandler(handler) {
    this.invoiceRemoveHandler = handler
  }

  bindInvoiceUpdateHandler(handler) {
    this.invoiceUpdateHandler = handler
  }
  onClickHandler(e) {
    if (!(e.target instanceof HTMLElement)) return

    const $clearBtn = e.target.closest(`.${FORM_CLASS.CLEAR_BTN}`)
    if ($clearBtn) {
      this.clear()
      return
    }

    const $removeBtn = e.target.closest(`.${FORM_CLASS.REMOVE_BTN}`)
    if ($removeBtn) {
      const isRemoveConfirm = confirm('정말 삭제하시겠습니까?')
      if (!isRemoveConfirm) return

      this.invoiceRemoveHandler(this.invoiceId)
      return
    }

    const $earningToggle = e.target.closest(`.${FORM_CLASS.EARNING_TOGGLE}`)
    if ($earningToggle) {
      this.setCategoryType(CONSTANT.EARNING)
      return
    }

    const $spendingToggle = e.target.closest(`.${FORM_CLASS.SPENDING_TOGGLE}`)
    if ($spendingToggle) {
      this.setCategoryType(CONSTANT.SPENDING)
      return
    }

    const $submitBtn = e.target.closest(`.${FORM_CLASS.SUBMIT_BTN}`)
    if ($submitBtn) {
      if (!this.$submit.classList.contains(CLASS.ACTIVE)) return

      if (this.invoiceId > 0) {
        this.invoiceUpdateHandler(this.getInvoiceData())
        return
      }

      this.invoiceAddHandler(this.getInvoiceData())
      return
    }
  }

  onKeydownHandler(e) {
    if (!(e.target instanceof HTMLElement)) return

    if (e.target.classList.contains(FORM_CLASS.INPUT_AMOUNT)) {
      if (e.target.value === '' && e.keyCode === 48) {
        e.preventDefault()
        return
      }
      return
    }
  }

  onInputHandler(e) {
    if (!(e.target instanceof HTMLElement)) return

    this.checkInvoiceValidation()

    if (e.target.classList.contains(FORM_CLASS.INPUT_AMOUNT)) {
      formatInputAmount(e.target)
      return
    }

    if (e.target.tagName === 'SELECT') {
      this.setSelectDisabled(<HTMLSelectElement>e.target)
      return
    }
  }

  setInvoiceData(invoice: Invoice) {
    this.invoiceId = invoice.id
    this.$date.value = formatDate(invoice.date)
    this.$item.value = invoice.item
    this.$category.value = invoice.category.id.toString()
    this.setCategoryType(invoice.category.type)
    this.setSelectDisabled(this.$category)
    this.$payment.value = invoice.paymentMethod.id.toString()
    this.setSelectDisabled(this.$payment)
    this.$amount.value = invoice.amount.toString()
    formatInputAmount(this.$amount)

    this.changeFloatBtn(FORM_CLASS.REMOVE_BTN)
    this.checkInvoiceValidation()
  }

  checkInvoiceValidation(): Boolean {
    const checkList = [
      this.$date,
      this.$category,
      this.$payment,
      this.$amount,
      this.$item,
    ]
    for (let checkItem of checkList) {
      if (checkItem.value === '') {
        this.$submit.classList.remove(CLASS.ACTIVE)
        return false
      }
    }

    this.$submit.classList.add(CLASS.ACTIVE)
    return true
  }

  getInvoiceData(): Invoice {
    const $selectedCategoryOption = <HTMLOptionElement>(
      this.$category.querySelector(`option[value='${this.$category.value}']`)
    )
    const $selectedPaymentOption = <HTMLOptionElement>(
      this.$payment.querySelector(`option[value='${this.$payment.value}']`)
    )

    const invoice: Invoice = {
      id: this.invoiceId,
      date: new Date(this.$date.value),
      category: {
        id: +this.$category.value,
        type: this.categoryType,
        title: $selectedCategoryOption.innerText,
      },
      paymentMethod: {
        id: +this.$payment.value,
        title: $selectedPaymentOption.innerText,
      },
      amount: getNumberByAmount(this.$amount.value),
      item: this.$item.value,
    }

    return invoice
  }

  setSelectDisabled($select: HTMLSelectElement) {
    if ($select.value === '') {
      $select.classList.add(CLASS.DISABLED)
      return
    }
    $select.classList.remove(CLASS.DISABLED)
  }

  addCategory(category: Category) {
    const $option = <HTMLOptionElement>templateToElement(optionTemplate)
    $option.value = category.id.toString()
    $option.innerText = category.title
    $option.dataset.type = category.type

    if (this.categoryType !== category.type) {
      $option.classList.add(CLASS.HIDDEN)
    }

    this.$category.appendChild($option)
  }

  setCategories(categories: Category[]) {
    this.removeCategoryOptions()

    categories.forEach((category) => {
      this.addCategory(category)
    })
  }

  removeCategoryOptions() {
    const $categoryOptions = Array.from(
      this.$category.querySelectorAll(`option:not([disabled])`)
    )

    $categoryOptions.forEach(($categoryOption) => {
      this.$category.removeChild($categoryOption)
    })
  }

  setCategoryType(categoryType) {
    if (categoryType === CONSTANT.SPENDING) {
      this.$spending.classList.add(CLASS.ACTIVE)
      this.$earning.classList.remove(CLASS.ACTIVE)
    } else if (categoryType === CONSTANT.EARNING) {
      this.$spending.classList.remove(CLASS.ACTIVE)
      this.$earning.classList.add(CLASS.ACTIVE)
    } else {
      return
    }
    this.categoryType = categoryType

    this.setCategorySelect()
    this.setCategoryOptions()
  }

  setCategorySelect() {
    const $selectedOption = <HTMLOptionElement>(
      this.$category.querySelector(`option[value='${this.$category.value}']`)
    )
    if ($selectedOption.dataset.type !== this.categoryType) {
      this.$category.value = ''
    }
  }

  setCategoryOptions() {
    const $options = <HTMLOptionElement[]>(
      Array.from(this.$category.querySelectorAll(`option:not([disabled])`))
    )
    $options.forEach(($option) => {
      if ($option.dataset.type !== this.categoryType) {
        $option.classList.add(CLASS.HIDDEN)
        return
      }
      $option.classList.remove(CLASS.HIDDEN)
    })
  }

  addPayment(payment: PaymentMethod) {
    const $option = <HTMLOptionElement>templateToElement(optionTemplate)
    $option.value = payment.id.toString()
    $option.innerText = payment.title

    this.$payment.appendChild($option)
  }

  setPayments(payments: PaymentMethod[]) {
    this.removePaymentOptions()

    payments.forEach((payment) => {
      this.addPayment(payment)
    })
  }

  removePayment(paymentId: number) {
    const $paymentOption = this.$payment.querySelector(
      `option[value='${paymentId}']`
    )

    this.$payment.removeChild($paymentOption)
  }

  removePaymentOptions() {
    const $paymentOptions = Array.from(
      this.$payment.querySelectorAll(`option:not([disabled])`)
    )

    $paymentOptions.forEach(($paymentOption) => {
      this.$payment.removeChild($paymentOption)
    })
  }

  changeFloatBtn(showClass: string): void {
    if (showClass === FORM_CLASS.REMOVE_BTN) {
      this.$remove.classList.remove(CLASS.HIDDEN)
      this.$clear.classList.add(CLASS.HIDDEN)
    } else if (showClass === FORM_CLASS.CLEAR_BTN) {
      this.$remove.classList.add(CLASS.HIDDEN)
      this.$clear.classList.remove(CLASS.HIDDEN)
    }
  }

  clear() {
    this.$amount.value = ''
    this.$date.value = formatDate(new Date())
    this.$item.value = ''
    this.$category.value = ''
    this.$payment.value = ''
    this.invoiceId = 0
    this.setSelectDisabled(this.$category)
    this.setSelectDisabled(this.$payment)
    this.setCategoryType(CONSTANT.SPENDING)
    this.changeFloatBtn(FORM_CLASS.CLEAR_BTN)
    this.checkInvoiceValidation()
  }
}
