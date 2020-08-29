var express = require('express')
var router = express.Router()
const {
  getUserController,
  getAllColumnsController,
  createColumnController,
  deleteColumnController,
  updatePrevColumnIdController,
  getAllCardsController,
  updateColumnNameController,
  updateCardNameController,
  createCardController,
  deleteCardController,
  moveCardController,
  getAllActivityController,
  updateNextCardIdController,
  createActivityController,
  loginContoller,
  logoutContoller,
} = require('./controller.js')

// render pug
router.get('/', (req, res, next) => {
  res.render('index')
})

// 로그인 여부 검사 api
router.get('/api/auth', getUserController)

// 로그인 api
router.post('/api/login', loginContoller)

// 로그아웃 api
router.get('/api/logout', logoutContoller)

// 컬럼 데이터 조회 api
router.get('/api/column', getAllColumnsController)

// 컬럼 데이터 추가 api
router.post('/api/column', createColumnController)

// 컬럼 데이터 수정 api
router.put('/api/column', updateColumnNameController)

// 컬럼 데이터 삭제 api
router.delete('/api/column', deleteColumnController)

// 컬럼 prev_column_id set api
router.put('/api/column/prev_column_id', updatePrevColumnIdController)

// 카드 데이터 조회 api
router.get('/api/card', getAllCardsController)

// 카드 데이터 수정 api
router.put('/api/card', updateCardNameController)

// 카드 데이터 삭제 api
router.delete('/api/card', deleteCardController)

// 카드 추가 api
router.post('/api/card', createCardController)

// 카드 이동 api
router.put('/api/card/move', moveCardController)

// 카드 next_card_id set api
router.put('/api/card/next_card_id', updateNextCardIdController)

//액티비티 테이블 조회 api
router.get('/api/activity', getAllActivityController)

//액티비티 추가 api
router.post('/api/activity', createActivityController)

module.exports = router
