const {db} = require('../../config')

// Database middleware
databaseMiddleware = (req, res, next) => {
    
    if (!db || db.readyState != 1) {
        console.log("[DATABASE] Not connected.")
        next(new Error('Banco de dados não está conectado. Por favor contate a administração.'))
    } else
        next();
}

module.exports = databaseMiddleware