import { NextFunction, Request, Response } from 'express'
import { OkPacket } from 'mysql2'
import passport from 'passport'
import categoryController from '../controller/category'
import invoiceController from '../controller/invoice'
import paymentMethodController from '../controller/payment-method'
import pool from '../pool'
import Strategy from '../strategy'

Strategy()
function login(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('local', function (err, user, info) {
    const error = err || info
    if (error) {
      return res.status(401).json({ error })
    }
    if (!user) {
      return res.status(404).json({
        message: 'Something went Wrong',
      })
    }
    // TODO: 토큰 들고기기
    const token = JSON.stringify({ id: user.id })
    res.status(200).json({
      token,
    })
  })(req, res, next)
}
async function signup(req: Request, res: Response, next: NextFunction) {
  const { id, password } = req.body
  const [row] = await pool.query<OkPacket>(
    'INSERT INTO Users (id, password) VALUES (?, ?)',
    [id, password]
  )
  // TODO: 토큰 만들기
  const token = JSON.stringify({ id })
  res.status(200).json({
    token,
  })
}
const Controller = {
  login,
  signup,
  ...categoryController,
  ...paymentMethodController,
  ...invoiceController,
}
export default Controller
