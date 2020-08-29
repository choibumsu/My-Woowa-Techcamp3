const express = require('express')
const createError = require('http-errors')
const path = require('path')
const logger = require('morgan')
const router = require('./src/router')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const { DB_CONFIG, SESSION_CONFIG } = require('./config/secrets')

const app = express()

var sessionStore = new MySQLStore({ port: 3306, ...DB_CONFIG })

app.use(
  session({
    key: 'user',
    secret: SESSION_CONFIG.KEY,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(router)
app.use('/static', express.static(__dirname + '/public'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

module.exports = app
