const db = require('../config/db')
const crypto = require('crypto')

function generateRandomHash(length) {
  return crypto
    .randomBytes(length)
    .toString('base64')
    .replace(/[^A-Za-z0-9]/g, '')
}

function createPasswordHash(password) {
  return new Promise((resolve, reject) => {
    try {
      const salt = generateRandomHash(64)
      crypto.pbkdf2(password, salt, 104236, 64, 'sha512', (err, key) => {
        if (err) reject(err)
        resolve({
          password: key.toString('base64'),
          salt
        })
      })
    } catch (err) {
      reject(err)
    }
  })
}

exports.postRegister = async (option) => {
  try {
    const {
      id,
      password
    } = option
    const passwordHash = await createPasswordHash(password)
    const result = await db.put(id, {
      ...option,
      password: passwordHash.password,
      salt: passwordHash.salt,
    })
    return result
  } catch (e) {
    throw e
  }
}

exports.verifyPassword = async (password, passwordHash, salt) => {
  return new Promise((resolve, reject) => {
    try {
      crypto.pbkdf2(password, salt, 104236, 64, 'sha512', (err, key) => {
        if (err) {
          reject(err)
        }
        if (key.toString('base64') !== passwordHash) {
          resolve(false)
        }
        resolve(true)
      })
    } catch (e) {
      reject(e)
    }
  })
}

exports.getUserOne = async (id) => {
  try {
    return await db.get(id)
  } catch (e) {
    return null
  }
}