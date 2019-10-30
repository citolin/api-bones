const axios = require('axios')
const { allowedRoutes } = require('../../config')

checkSessionMiddleware = (req, res, next) => {

    if (allowedRoutes[req.url]){
        return next()
    }
       
    const { headers } = req

    axios.post(`${process.env.AUTH_CHECK_SESSION}/checkSession`, {}, { headers })
        .then(response => {

            if (response) {
                if (response.data && response.data.success)
                    next()
                else
                    res.status(403).send(['Acesso não permitido! Faça a autenticação novamente'])
            } else
                res.status(403).send(['Não foi possível verificar a sua permissão'])
        })
        .catch(error => {
            if (error.response && error.response.status)
                res.status(403).send([`Ocorreu um error ao solicitar permissão | Status code: ${error.response.status}`])
            else
                res.status(403).send([`Ocorreu um error ao solicitar permissão | Error: ${error}`])
        })
}

module.exports = checkSessionMiddleware