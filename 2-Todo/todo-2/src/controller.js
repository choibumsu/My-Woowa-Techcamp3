const {
  getUser,
  createUser,
  fetchColumn,
  createColumn,
  deleteColumn,
  updatePrevColumnId,
  fetchCard,
  updateColumnTitle,
  updateCardTitle,
  createCard,
  deleteCard,
  moveCard,
  fetchActivity,
  updateNextCardId,
  createActivity,
} = require('./model')
const { json } = require('express')

exports.getUserController = async (req, res, next) => {
  try {
    const username = req.session.username
    if (!username) {
      res.status(404).json({
        result: false,
      })
      return
    }

    const user = await getUser(username)
    if (user.length === 0) {
      res.status(404).json({
        result: false,
      })
      return
    }

    res.status(200).json(user[0])
  } catch (err) {
    console.log(err)
    res.status(500).json()
  }
}

exports.loginContoller = async (req, res, next) => {
  try {
    const username = req.body.username

    const users = await getUser(username)
    if (!users.length) {
      await createUser(username)
    }

    req.session.username = username
    res.status(200).json({
      name: username,
    })
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}

exports.logoutContoller = async (req, res, next) => {
  try {
    req.session.destroy(function () {
      req.session
    })

    res.status(200).json()
  } catch (err) {
    console.log(err)
    res.status(401).json()
  }
}

exports.getAllColumnsController = async (req, res, next) => {
  try {
    const rows = await fetchColumn()
    res.status(200).json(rows)
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}

exports.createColumnController = async (req, res, next) => {
  // 유저 유효성 검사 : return 401

  try {
    const result = await createColumn(req.body)
    const newColumnId = result[0].insertId

    res.status(200).json({
      id: newColumnId,
    })
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}

exports.deleteColumnController = async (req, res, next) => {
  try {
    await deleteColumn(req.body)

    res.status(200).json()
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}

exports.updatePrevColumnIdController = async (req, res, next) => {
  try {
    await updatePrevColumnId(req.body)

    res.status(200).json()
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}

exports.getAllCardsController = async (req, res, next) => {
  try {
    const rows = await fetchCard()
    res.status(200).json(rows)
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}

exports.updateColumnNameController = async (req, res, next) => {
  try {
    const { title, id } = req.body
    const rows = await updateColumnTitle(title, id)
    res.status(200).json(rows)
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}

exports.updateCardNameController = async (req, res, next) => {
  try {
    const { title, id, username } = req.body
    const sessionUsername = req.session.username

    if (!sessionUsername || sessionUsername !== username) {
      res.status(401).json()
      return
    }

    const rows = await updateCardTitle(title, id, username)
    res.status(200).json(rows)
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}

exports.deleteCardController = async (req, res, next) => {
  try {
    const { id, username } = req.body
    const sessionUsername = req.session.username

    if (!sessionUsername || sessionUsername !== username) {
      res.status(401).json()
      return
    }

    const rows = await deleteCard(id)
    res.status(200).json(rows)
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}

exports.createCardController = async (req, res, next) => {
  // 유저 유효성 검사 : return 401

  try {
    const result = await createCard(req.body)
    const newCardId = result[0].insertId

    res.status(200).json({
      id: newCardId,
    })
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}

exports.moveCardController = async (req, res, next) => {
  try {
    await moveCard(req.body)

    res.status(200).json()
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}

exports.updateNextCardIdController = async (req, res, next) => {
  try {
    await updateNextCardId(req.body)

    res.status(200).json()
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}

exports.getAllActivityController = async (req, res, next) => {
  try {
    const rows = await fetchActivity()
    rows.forEach((row) => {
      let date = new Date(row.created_at)
      date.setHours(date.getHours() + 9)
      row.created_at = date
    })
    res.status(200).json(rows)
  } catch (err) {
    console.log(err)
  }
}

exports.createActivityController = async (req, res, next) => {
  try {
    await createActivity(req.body)

    res.status(200).json()
  } catch (err) {
    console.log(err)
    res.status(404).json()
  }
}
