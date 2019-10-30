// Error wrapper to use in Express
const { checkConstraint } = require('../middlewares')

wrapAsync = (fn, constraint) => {
    return (req, res, next) => {
        if (constraint) {
            var err = checkConstraint(constraint, req.body)
            if (err)
                return res.status(500).send(err)
        }
        fn(req, res, next).catch(next)
    }
}

module.exports = {
    wrapAsync
}