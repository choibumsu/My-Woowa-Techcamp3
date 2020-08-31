import { Invoice } from '../../../types'
import { formatAmount } from '../../utils'
import { CONSTANT, LIST_CLASS } from '../../utils/constants'
import { templateToElement } from '../../utils/ElementGenerator'
import { getSibling, getText, removeElement, setText, View } from '../view'
import './style.scss'
import { invoiceRowTemplate, template, wrapperRowTemplate } from './template'

const days = ['일', '월', '화', '수', '목', '금', '토']
function getPrettyDate(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}
function getPrettyDay(date: Date) {
  return days[date.getDay()]
}

function removeComma(str: string) {
  return str.replace(/,/g, '')
}
function addAmountInWrapperRowSum(
  invoice: Invoice,
  $wrapperRow: HTMLDivElement
) {
  const { category, amount } = invoice
  if (category.type === CONSTANT.EARNING) {
    const earningSum = <HTMLInputElement>(
      $wrapperRow.querySelector('.earning-sum')
    )
    const sum = parseInt(removeComma(earningSum.innerText))
    earningSum.innerText = formatAmount(sum + amount)
  } else {
    const spendingSum = <HTMLInputElement>(
      $wrapperRow.querySelector('.spending-sum')
    )
    const sum = parseInt(removeComma(spendingSum.innerText))
    spendingSum.innerText = formatAmount(sum + amount)
  }
}
function appendRowInWrapperRow(invoice, $wrapperRow) {
  const { date } = invoice
  const $rows = <HTMLInputElement>$wrapperRow.querySelector('.rows')
  if ($rows === null) return
  const $invoiceRow = createInvoiceRow(invoice)
  if (invoice.category.type === CONSTANT.EARNING) {
    $invoiceRow.classList.add(LIST_CLASS.EARNING)
  } else {
    $invoiceRow.classList.add(LIST_CLASS.SPENDING)
  }

  const targetRow = Array.from($rows.children).find(($row: HTMLDivElement) => {
    if (parseInt(getText($row, '.hidden-date')) > +date) {
      return true
    }
  })
  $rows.insertBefore($invoiceRow, targetRow)
  return $invoiceRow
}

function createWrapperRow(date: Date) {
  const $wrapperRow = templateToElement(wrapperRowTemplate) as HTMLDivElement
  setText($wrapperRow, '.date', getPrettyDate(date))
  setText($wrapperRow, '.day', getPrettyDay(date))
  setText($wrapperRow, '.hidden-date', +date)

  return $wrapperRow
}
function createInvoiceRow(invoice: Invoice) {
  const { id, date, category, item, paymentMethod, amount } = invoice

  const $invoiceRow = templateToElement(invoiceRowTemplate) as HTMLDivElement
  const type = category.type === CONSTANT.EARNING ? 'earning' : 'spending'
  $invoiceRow.classList.add('invoice', type)
  setText($invoiceRow, '.hidden-id', id)
  setText($invoiceRow, '.hidden-date', +date)
  setText($invoiceRow, '.date', `${date.getHours()}시 ${date.getMinutes()}분`)
  setText($invoiceRow, '.category', category.title)
  setText($invoiceRow, '.type', category.type)
  setText($invoiceRow, '.content', item)
  setText($invoiceRow, '.payment', paymentMethod.title)
  setText($invoiceRow, '.amount', formatAmount(amount))
  setText(
    $invoiceRow,
    '.amount-pre',
    category.type === CONSTANT.EARNING ? '+' : '–'
  )
  return $invoiceRow
}

export default class ListView extends View {
  constructor() {
    super(template)
  }
  clear() {
    const $wrapperRows = this.queryAll('.invoice-wrapper')
    $wrapperRows.forEach(($wrapperRow) => {
      removeElement($wrapperRow)
    })
  }
  findWrapperRow(date: Date): HTMLDivElement {
    const wrapperRows = this.queryAll('.invoice-wrapper')
    if (wrapperRows === null) return null
    return <HTMLDivElement>(
      Array.from(wrapperRows).find(
        ($wrapperRow: HTMLDivElement) =>
          getText($wrapperRow, '.date') === getPrettyDate(date)
      )
    )
  }
  addWrapperRow(date: Date) {
    const $wrapperRow = createWrapperRow(date)
    const $targetRow = Array.from(this.$element.children).find(
      ($row: HTMLDivElement) => {
        if (parseInt(getText($row, '.hidden-date')) > +date) {
          return true
        }
      }
    )
    this.$element.insertBefore($wrapperRow, $targetRow)
    return $wrapperRow
  }
  addInvoiceRow(invoice: Invoice, hidden = false) {
    const { date } = invoice
    const $wrapperRow = this.findWrapperRow(date) || this.addWrapperRow(date)
    addAmountInWrapperRowSum(invoice, $wrapperRow)
    const $row = appendRowInWrapperRow(invoice, $wrapperRow)
    if (hidden) {
      $row.classList.add('hidden')
    }
  }
  getWrapperRows() {
    return Array.from(this.queryAll('.invoice-wrapper'))
  }
  getInvoiceRows() {
    return Array.from(this.queryAll('.invoice'))
  }
  getInvoiceRowsByType(type) {
    return this.getInvoiceRows().filter(
      (x) => getText(<HTMLDivElement>x, '.type') === type
    )
  }
  findInvoiceRow(id: Number): HTMLDivElement {
    return <HTMLDivElement>(
      this.getInvoiceRows().find(
        ($row) => getText(<HTMLDivElement>$row, '.hidden-id') === String(id)
      )
    )
  }
  removeInvoice(id: number): void {
    const $invoiceRow = this.findInvoiceRow(id)
    if (!$invoiceRow) return
    if (getSibling($invoiceRow).length === 1) {
      const $dateRow = $invoiceRow.closest('.invoice-wrapper')
      removeElement($dateRow)
      return
    }
    removeElement($invoiceRow)
  }
  bindInvoiceEditHandler(handler: Function) {
    this.$element.addEventListener('click', ({ target }) => {
      if (target instanceof HTMLElement) {
        const $edit = target.closest('.button-edit')
        if (!$edit) return
        const $invoiceRow = <HTMLDivElement>$edit.closest('.invoice')
        handler(parseInt(getText($invoiceRow, '.hidden-id')))
      }
    })
  }
  highlightInvoice(id: number, flag: boolean): void {
    const $invoiceRow = this.findInvoiceRow(id)
    if (!$invoiceRow) return
    if (flag) $invoiceRow.classList.add('highlight')
    else $invoiceRow.classList.remove('highlight')
  }
  setVisibilityCheck() {
    this.getWrapperRows().forEach(($wrapperRow) => {
      const isVisible = Array.from(
        $wrapperRow.querySelector('.rows').children
      ).some(($row) => !$row.classList.contains('hidden'))
      if (isVisible) {
        $wrapperRow.classList.remove('hidden')
        return
      }
      $wrapperRow.classList.add('hidden')
    })
  }
  setVisibleByType(type, className, flag) {
    this.getInvoiceRowsByType(type).forEach(($row) => {
      if (flag) $row.classList.remove('hidden')
      else $row.classList.add('hidden')
    })
    this.getWrapperRows().forEach(($wrapperRow) => {
      const $earningSumBox = $wrapperRow.querySelector(className)
      if (flag) {
        $earningSumBox.classList.remove('hidden')
        return
      }
      $earningSumBox.classList.add('hidden')
    })
    this.setVisibilityCheck()
  }
  setEarningVisible(flag: boolean) {
    this.setVisibleByType(CONSTANT.EARNING, '.earning-sum-box', flag)
  }
  setSpendingVisible(flag: boolean) {
    this.setVisibleByType(CONSTANT.SPENDING, '.spending-sum-box', flag)
  }
  mount(): void {}
}
