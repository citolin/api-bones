module.exports = {
    checkConstraint: require('./constraintsMiddleware'),
    errorMiddleware: require('./errorMiddleware'),
    databaseMiddleware: require('./databaseMiddleware'),
    checkSessionMiddleware: require('./checkSessionMiddleware'),
    pageNotFoundMiddleware: require('./pageNotFoundMiddleware')
}