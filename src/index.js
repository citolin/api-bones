const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const { loggerRequestsInfo } = require('./utils/logger')

const { pageNotFoundMiddleware, checkSessionMiddleware, errorMiddleware, databaseMiddleware } = require('./utils/middlewares')

const routes = require('./routes')

app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

if (process.env.DEBUG_MODE) {
    const logRequestsInfo = loggerRequestsInfo()
    app.use(logRequestsInfo)
}    

if (process.env.SESSION_MIDDLEWARE)
    app.use(checkSessionMiddleware)

app.use(databaseMiddleware)

app.use(routes)
  
app.use(errorMiddleware)

app.use(pageNotFoundMiddleware)

app.listen(process.env.PORT, () => {
    console.log(`Server running... Port: ${process.env.PORT}`)
})