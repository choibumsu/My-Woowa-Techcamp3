const apiUrlBase = '/api'
const METHOD = {
  GET() {
    return {
      method: 'GET',
    }
  },
  POST(data) {
    return {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  },
  PUT(data) {
    return {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  },
  DELETE(data) {
    return {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  },
}

export const checkAuthApi = async () => {
  const response = await fetch(`${apiUrlBase}/auth`, METHOD.GET())

  if (response.ok) {
    const data = await response.json()
    return [data, response.status]
  } else {
    return [null, response.status]
  }
}

export const loginApi = async (username) => {
  const response = await fetch(`${apiUrlBase}/login`, METHOD.POST({ username }))

  if (response.ok) {
    const data = await response.json()
    return [data, response.status]
  } else {
    return [null, response.status]
  }
}

export const logoutApi = async () => {
  const response = await fetch(`${apiUrlBase}/logout`, METHOD.GET())

  return response.status
}

export const fetchColumn = async () => {
  const response = await fetch(`${apiUrlBase}/column`, METHOD.GET())
  if (response.status === 200) {
    const datas = await response.json()
    return datas
  }

  if (response.status === 404) {
    throw 'Column Not Found'
  }
  if (response.status >= 500) {
    throw 'Server Error'
  }
}

/** @type {(data: any) => Promise<[any, number]>} */
export const createColumnApi = async (newColumnData) => {
  const response = await fetch(
    `${apiUrlBase}/column`,
    METHOD.POST(newColumnData)
  )

  if (response.ok) {
    const data = await response.json()
    return [data, response.status]
  } else {
    return [null, response.status]
  }
}

/** @type {(data: any) => Promise<[any, number]>} */
export const deleteColumnApi = async (removedColumnData) => {
  const response = await fetch(
    `${apiUrlBase}/column`,
    METHOD.DELETE(removedColumnData)
  )

  return response.status
}

export const updatePrevColumnIdApi = async (updatedColumnData) => {
  const response = await fetch(
    `${apiUrlBase}/column/prev_column_id`,
    METHOD.PUT(updatedColumnData)
  )

  return response.status
}

export const fetchCard = async () => {
  const response = await fetch(`${apiUrlBase}/card`, METHOD.GET())
  if (response.status === 200) {
    const datas = await response.json()
    return datas
  }
  if (response.status === 404) {
    throw 'Card Not Found'
  }
  if (response.status >= 500) {
    throw 'Server Error'
  }
}

export const updateColumnTitle = async (data) => {
  const response = await fetch(`${apiUrlBase}/column`, METHOD.PUT(data))
  if (response.ok) {
    const data = await response.json()
    return [data, response.status]
  } else {
    return [null, response.status]
  }
}

export const updateCardTitle = async (data) => {
  const response = await fetch(`${apiUrlBase}/card`, METHOD.PUT(data))
  if (response.ok) {
    const data = await response.json()
    return [data, response.status]
  } else {
    return [null, response.status]
  }
}

export const deleteCard = async (data) => {
  const response = fetch(`${apiUrlBase}/card`, METHOD.DELETE(data))
  if (response.ok) {
    const data = await response.json()
    return [data, response.status]
  } else {
    return [null, response.status]
  }
}

/** @type {(data: any) => Promise<[any, number]>} */
export const createCardApi = async (newCardData) => {
  const response = await fetch(`${apiUrlBase}/card`, METHOD.POST(newCardData))

  if (response.ok) {
    const data = await response.json()
    return [data, response.status]
  } else {
    return [null, response.status]
  }
}

export const moveCardApi = async (movedCardData) => {
  const response = await fetch(
    `${apiUrlBase}/card/move`,
    METHOD.PUT(movedCardData)
  )

  return response.status
}

export const fetchActivityCard = async () => {
  const response = await fetch(`${apiUrlBase}/activity`, METHOD.GET())
  if (response.status === 200) {
    const datas = await response.json()
    return datas
  }

  if (response.status === 404) {
    throw 'Column Not Found'
  }
  if (response.status >= 500) {
    throw 'Server Error'
  }
}

export const updateNextCardIdApi = async (updatedCardData) => {
  const response = await fetch(
    `${apiUrlBase}/card/next_card_id`,
    METHOD.PUT(updatedCardData)
  )

  return response.status
}

export const createActivityAPI = async (createActivityData) => {
  const response = await fetch(
    `${apiUrlBase}/activity`,
    METHOD.POST(createActivityData)
  )

  return response.status
}
