export const CONSTANT = {
  SPENDING: '지출',
  EARNING: '수입',
  CELL_NUM: 42,
}

export const CLASS = {
  HIDDEN: 'hidden',
  ACTIVE: 'active',
  ITEM: 'item',
  CENTER: 'center',
  STOP_SCROLL: 'stop-scroll',
  DISABLED: 'disabled',
}
export const GLOBAL = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
}
export enum EVENT {
  ADD_INVOICE = 'ADD_INVOICE',
  CLEAR_INVOICES = 'CLEAR_INVOICES',
  REMOVE_INVOICE = 'REMOVE_INVOICE',
  UPDATE_INVOICE = 'UPDATE_INVOICE',
  HIGHLIGHT_INVOICE = 'HIGHLIGHT_INVOICE',
  SET_SUM_EARNING = 'SET_SUM_EARNING',
  SET_SUM_SPENDING = 'SET_SUM_SPENDING',
  EARNING_TOGGLE = 'EARNING_TOGGLE',
  SPENDING_TOGGLE = 'SPENDING_TOGGLE',
  SET_INVOICES = 'SET_INVOICES',
  SET_CATEGORIES = 'SET_CATEGORIES',
  CLEAR_CATEGORIES = 'CLEAR_CATEGORIES',
  ADD_PAYMENT = 'ADD_PAYMENT',
  REMOVE_PAYMENT = 'REMOVE_PAYMENT',
  SET_PAYMENTS = 'SET_PAYMENTS',
  CLEAR_PAYMENTS = 'CLEAR_PAYMENTS',
}

export const ROUTER = {
  MUTATE_VIEW: 'MUTATE_VIEW',
  CHANGE_DATE: 'CHANGE_DATE',
}

export const ROUTE = {
  LOGIN: 'login',
  LIST: 'list',
  CALENDAR: 'calendar',
  CHART: 'chart',
  PREVIOUS_MONTH: 'previous-month',
  NEXT_MONTH: 'next-month',
}
export const ROUTES = {
  CONTAINER: [ROUTE.LIST, ROUTE.CALENDAR, ROUTE.CHART],
  LOGIN: [ROUTE.LOGIN],
  ALL: [ROUTE.LIST, ROUTE.CALENDAR, ROUTE.CHART, ROUTE.LOGIN],
}

export enum LIST_CLASS {
  EARNING = 'earning',
  SPENDING = 'spending',
}

export enum FILTER_CLASS {
  CHECKED = 'checked',
  UNCHECKED = 'unchecked',
}

export const FORM_CLASS = {
  INPUT_AMOUNT: 'input-amount',
  INPUT_DATE: 'input-date',
  INPUT_ITEM: 'input-item',
  SELECT_CATEGORY: 'select-category',
  SELECT_PAYMENT: 'select-payment',
  CLEAR_BTN: 'button-clear-form',
  REMOVE_BTN: 'button-remove-invoice',
  EARNING_TOGGLE: 'earning-toggle',
  SPENDING_TOGGLE: 'spending-toggle',
  SUBMIT_BTN: 'button-submit',
}

export const CALENDAR_CLASS = {
  DAY: 'day',
  DATE: 'date',
  DATE_CELL: 'date-cell',
  TODAY: 'today',
  OTHER_MONTH: 'other-month',
  EARNING_SUM: 'earning-sum',
  SPENDING_SUM: 'spending-sum',
}

export enum MODAL_ID {
  PAYMENT_MODAL = 'payment-modal',
}

export enum MODAL_CLASS {
  PAYMENT_ROW = 'payment-row',
  CLOSE_BTN = 'close-btn',
  ADD_BTN = 'button-add-payment',
  REMOVE_BTN = 'remove-btn',
  INPUT_PAYMENT = 'input-payment',
}
