require('dotenv').config() // .env

// NPM Modules
const express = require('express')
const app = express()

// Custom Modules
const logger = require('./modules/logger') // pretty log
const mongoDB = require('./modules/mongo-connect') // db connect
const passportJwtAuth = require('./modules/passport-jwt-auth')() // passport
const sendRule = require('./modules/send-rule') // send promise

// Routers
const authRouter = require('./routers/auth') // /auth router

// Listen port
app.listen(process.env.PORT || 80, () => {
    logger.logc("SERVER OPEN")
})

// Middleware
app.use(express.static('public')) // Static File
app.use(express.urlencoded());
app.use(express.json()) // Body Parser
app.use(passportJwtAuth.initialize()) // Auth

app.use('/auth', authRouter)

// Error handling
app.use(sendRule.errorHendling()) // 400~500
app.use((req, res, next) => {
    sendRule.sendNotFound(res, null)
}) // Page Not Found