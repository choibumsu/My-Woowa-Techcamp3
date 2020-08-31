import { Invoice, PaymentMethod } from '../../types'
import store from '../model/store'

const APIUrlBase = '/api'

function addToken() {
  if (store.id) {
    return {
      Authorization: `Bearer ${store.token}`,
    }
  }
  return {}
}

function setContentType() {
  return {
    'content-type': 'application/json',
  }
}

const METHOD = {
  GET() {
    return {
      method: 'GET',
      headers: {
        ...addToken(),
      },
    }
  },
  POST(data) {
    return {
      method: 'POST',
      headers: {
        ...setContentType(),
        ...addToken(),
      },
      body: JSON.stringify(data),
    }
  },
  PUT(data) {
    return {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        ...setContentType(),
        ...addToken(),
      },
    }
  },
  DELETE(data) {
    return {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        ...setContentType(),
        ...addToken(),
      },
    }
  },
}

const API = {
  requestForStatus: async (url, config) => {
    const response = await fetch(url, config)
    return response.status
  },
  requestForData: async (url, config) => {
    const response = await fetch(url, config)
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      return response.status
    }
  },
  requestForToken: async (url, config) => {
    const response = await fetch(url, config)
    if (response.ok) {
      const data = await response.json()
      if (data.token) {
        const { id } = JSON.parse(data.token)
        store.login(id, data.token)
      }
      return data
    } else {
      return response.status
    }
  },
}

export async function signup({ id, password }) {
  return await API.requestForToken(
    `${APIUrlBase}/signup`,
    METHOD.POST({ id, password })
  )
}

export async function login({ id, password }) {
  return await API.requestForToken(
    `${APIUrlBase}/login`,
    METHOD.POST({ id, password })
  )
}

export async function fetchInvoices(year, month) {
  return await API.requestForData(
    `${APIUrlBase}/invoice?year=${year}&month=${month}`,
    METHOD.GET()
  )
}

export async function postInvoice(invoice: Invoice) {
  return await API.requestForData(
    `${APIUrlBase}/invoice`,
    METHOD.POST({ invoice })
  )
}
export async function fetchCategories() {
  return await API.requestForData(`${APIUrlBase}/category`, METHOD.GET())
}

export async function fetchPayments() {
  return await API.requestForData(`${APIUrlBase}/payment_method`, METHOD.GET())
}

export async function postPayment(payment: PaymentMethod) {
  return await API.requestForData(
    `${APIUrlBase}/payment_method`,
    METHOD.POST(payment)
  )
}

export async function updateInvoice(invoice: Invoice) {
  return await API.requestForStatus(
    `${APIUrlBase}/invoice`,
    METHOD.PUT({ invoice })
  )
}

export async function deleteInvoice(id: number) {
  return await API.requestForStatus(
    `${APIUrlBase}/invoice`,
    METHOD.DELETE({ id })
  )
}
export async function deletePayment(id: number) {
  return await API.requestForStatus(
    `${APIUrlBase}/payment_method`,
    METHOD.DELETE({ id })
  )
}
