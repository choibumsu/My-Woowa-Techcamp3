const express = require('express')
const router = express.Router()
const db = require('../config/db')

router.get('/join/:path/:id', async (req, res) => {
  const { path, id } = req.params
  if (path === 'success') {
    try {
      const user = await db.get(id)
      console.log(user)
      res.render('welcome-page', user)
    } catch (e) {
      console.error(e)
    }
    return
  }
  res.render('main-page')
})

router.get('/join', (req, res) => {
  res.render('join-page')
})

router.get('/', (req, res) => {
  res.render('main-page')
})

router.get('/login', (req, res) => {
  res.render('login-page')
})

module.exports = router
