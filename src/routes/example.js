const express = require('express')
const router = express.Router()
const { logger } = require('../utils/logger')
const { Example } = require('../schemas')
const { wrapAsync } = require('../utils/wrappers')
const { EXAMPLE } = require('./constraints')

let array = [
    { name: 'Lucas', age: 23 },
    { name: 'Danilo', age: 19 },
    { name: 'Diogo', age: 40 }
]

// With constraints
router.post('/a', wrapAsync(async(req, res, next) => {
    res.status(200).send({ success: true })
}, EXAMPLE.a))

// Without constraints
router.post('/', wrapAsync(async(req, res, next) => {

    logger.log({level: 'debug', message: 'teste debug!', headers: req.headers})

    res.status(200).send({ success: true })
}))

// Without constraints and checksession | See more at config/allowed-routes.js
router.post('/xpto', wrapAsync(async(req, res, next) => {

    logger.log({level: 'info', message: 'teste info!', headers: req.headers})

    res.status(200).send({ success: true })
}))

router.post('/getUsers', wrapAsync(async(req, res, next) => {
    res.status(200).send(array)
}))

router.post('/addUser', wrapAsync(async(req, res, next) => {
    array.push(req.body)

    res.status(200).send(array)
}))
module.exports = router