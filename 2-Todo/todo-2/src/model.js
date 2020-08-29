const mysql = require('mysql2')
const { DB_CONFIG } = require('../config/secrets')

// mysql setup
const connection = mysql.createConnection(DB_CONFIG)

exports.getUser = async (username) => {
  try {
    const [rows, fields] = await connection
      .promise()
      .query(`SELECT * FROM user WHERE name='${username}'`)

    return rows
  } catch (err) {
    throw err
  }
}

exports.createUser = async (username) => {
  try {
    const query = `INSERT INTO user (name) VALUES ('${username}')`
    const result = await connection.promise().query(query)

    return result
  } catch (err) {
    throw err
  }
}

exports.fetchColumn = async () => {
  const [rows, fields] = await connection
    .promise()
    .query('SELECT * FROM columns')
  return rows
}

exports.createColumn = async ({ title, prevColumnId }) => {
  try {
    const query = `INSERT INTO columns (title, prev_column_id) VALUES ('${title}', ${prevColumnId})`
    const result = await connection.promise().query(query)

    return result
  } catch (err) {
    throw err
  }
}

exports.deleteColumn = async ({ id, userId }) => {
  try {
    const query = `DELETE FROM columns WHERE id=${id}`
    await connection.promise().query(query)
  } catch (err) {
    throw err
  }
}

exports.updatePrevColumnId = async ({ columnId, prevColumnId }) => {
  try {
    const query = `UPDATE columns SET prev_column_id=${prevColumnId} WHERE id=${+columnId}`
    await connection.promise().query(query)

    return
  } catch (err) {
    throw err
  }
}

exports.fetchCard = async () => {
  const [rows, fields] = await connection
    .promise()
    .query(
      'SELECT user.name, card.id, card.title, card.next_card_id, card.column_id FROM tododb.user LEFT JOIN tododb.card ON card.user_id=user.id;'
    )

  return rows
}

exports.updateColumnTitle = async (title, id) => {
  return await connection
    .promise()
    .query(`UPDATE columns SET title='${title}' WHERE id=${id}`)
}

exports.updateCardTitle = async (title, id) => {
  return await connection
    .promise()
    .query(`UPDATE card SET title='${title}' WHERE id=${id}`)
}

exports.deleteCard = async (id) => {
  return await connection.promise().query(`DELETE FROM card WHERE id=${id}`)
}

exports.createCard = async ({ cardTitle, columnId, userId, nextCardId }) => {
  try {
    const query = `INSERT INTO card (title, column_id, user_id, next_card_id) VALUES ('${cardTitle}', ${+columnId}, ${+userId}, ${+nextCardId})`
    const result = await connection.promise().query(query)

    return result
  } catch (err) {
    throw err
  }
}

exports.moveCard = async ({ cardId, columnId, userId }) => {
  try {
    const query = `UPDATE card SET column_id=${+columnId} WHERE id=${+cardId}`
    await connection.promise().query(query)

    return
  } catch (err) {
    throw err
  }
}

exports.fetchActivity = async () => {
  const [rows, fields] = await connection
    .promise()
    .query('SELECT * FROM activity')
  return rows
}

exports.updateNextCardId = async ({ cardId, nextCardId, userId }) => {
  try {
    const query = `UPDATE card SET next_card_id=${+nextCardId} WHERE id=${+cardId}`
    await connection.promise().query(query)

    return
  } catch (err) {
    throw err
  }
}

exports.createActivity = async ({ content, user_name, category }) => {
  try {
    const query = `INSERT INTO activity (content, user_name, category) VALUES ('${JSON.stringify(
      content
    )}',  '${user_name}', '${category}')`
    const result = await connection.promise().query(query)
    return result
  } catch (err) {
    throw err
  }
}
