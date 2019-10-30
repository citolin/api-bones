const {logger} = require('../logger')

errorMiddleware = (err, req, res, next) => {

    console.log('[ERROR]')

    if (err.name === 'ValidationError') {
        var errors = []

        for (var key in err.errors)
            errors.push(err.errors[key].message) //+ ' -  ' + err.errors[key].value

        return res.status(500).json(errors)
    }

    logger.log({level: 'debug', message: err.message})

    console.log("[ERROR HANDLER]  -  " + err.message)

    res.status(500).json([err.message])
}


module.exports = errorMiddleware