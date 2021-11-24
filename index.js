'use strict'

// ----------------- Import of External Packages -----------------
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')

// ----------------- Import of Routers -----------------

// ----------------- Import of Internal Modules -----------------
require('dotenv').config()

// ----------------- End of Import-----------------

const app = express()

// Middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

app.use(express.static(path.join(__dirname, 'public')))

app.use(helmet())
app.use(logger('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }))

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

//
app.get(`/api/${process.env.API_VERSION}/`, (req, res) => {
  res.status(200).json({data:'Hello World!'})
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
