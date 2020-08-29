const {
  postUserAuthController,
  postRegisterController,
  getUserOneController,
  postUserDuplicationController,
} = require('./user-ctrl')
const express = require('express')
const router = express.Router()

router.post('/', postRegisterController)
router.get('/:id', getUserOneController)
router.post('/auth', postUserAuthController)
router.post('/duplicatuon', postUserDuplicationController)

module.exports = router
