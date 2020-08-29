const level = require('level')

const db = level('./db', { valueEncoding: 'json' })

module.exports = db
