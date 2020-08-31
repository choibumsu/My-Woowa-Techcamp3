import cookieParser from 'cookie-parser'
import express from 'express'
import bearerToken from 'express-bearer-token'
import logger from 'morgan'
import path from 'path'
import { checkAuth } from './middlewares'
import router from './routes/index'
const app = express()

declare global {
  namespace Express {
    export interface Request {
      auth?: {
        id: string
      }
    }
  }
}
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, '../frontend/dist')))
app.use(bearerToken())
app.use(checkAuth)
app.use('/api', router)
app.use('/', (req, res) => {
  res.sendFile(path.resolve('frontend/dist/index.html'))
})
module.exports = app
