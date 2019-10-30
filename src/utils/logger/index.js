const winston = require('winston')
const expressWinston = require('express-winston')
const { combine, timestamp, prettyPrint } = winston.format

const fileLogError = './logs/error.log'
const fileLogInfo = './logs/info.log'
const fileLogDebug = './logs/debug.log'

const fileLogRequestsInfo = './logs/requestsInfo.log'
const fileLogRequestError = './logs/requestsError.log'

const logger = winston.createLogger({
    format: combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => {
            delete info.level
            return info
        }),
        prettyPrint()
    ),
    transports: [
        new winston.transports.File({ filename: fileLogError, level: 'error' }),
        new winston.transports.File({ filename: fileLogInfo, level: 'info' }),
        new winston.transports.File({ filename: fileLogDebug, level: 'debug' }),
    ],
    exitOnError: false
})

const loggerRequestsInfo = () => {

    return expressWinston.logger({

        transports: [
            new winston.transports.File({ filename: fileLogRequestsInfo, level: 'info' })
        ],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json(),
            winston.format.timestamp()
        ),
        msg: `HTTP {{req.method}} {{req.url}} - Date Time: ${new Date()}`,
        requestWhitelist: [...expressWinston.requestWhitelist, 'body'],
        meta: true
    })
}

const loggerRequestsError = () => {

    return expressWinston.errorLogger({
        transports: [
            new winston.transports.File({ filename: fileLogRequestsError, level: 'error' })
        ],
        timestamp: true,
        format: winston.format.combine(
            winston.format.json()
        ),
        requestWhitelist: [...expressWinston.requestWhitelist, 'body'],
        msg: 'HTTP {{req.method}} {{req.url}} {{res.responseTime}}',
        meta: true
    })
}

module.exports = {
    logger,
    loggerRequestsInfo,
    loggerRequestsError
}