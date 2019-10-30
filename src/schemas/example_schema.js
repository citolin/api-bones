const mongoose = require('mongoose')
const schema = mongoose.Schema
const bcrypt = require('bcrypt')

const beautifyUnique = require('mongoose-beautiful-unique-validation')

const minLengthUsername = 5
const maxLengthUsername = 50

const minLengthPassword = 5
const maxLengthPassword = 50

mongoose.set('useCreateIndex', true);

const UserSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true,
        unique: 'Já existe um usuário com o nome: '
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        unique: 'Já existe um usuário com este email: ',
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    permissions: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.plugin(beautifyUnique)

UserSchema.statics.query = async(QUERY) => {
    const query = { $text: { $search: QUERY } }
    return await Users.find(query)
}

UserSchema.statics.isLogged = function(userId, callback) {
    User.findById(userId)
        .exec((error, user) => {
            if (error)
                callback(null)
            else {
                if (user === null)
                    callback(null)
                else
                    callback(user)
            }
        })
}

UserSchema.statics.authenticate = async function(username, password) {
    const validUsername = validateUsername(username)

    if (!validUsername)
        throw new Error(`Username deve conter entre ${minLengthUsername} à ${maxLengthUsername} caracteres`)

    const validPassword = validatePassword(password);

    if (!validPassword)
        throw new Error(`Password deve conter entre ${minLengthPassword} à ${maxLengthPassword} caracteres`)

    const user = await Users.findOne({ username }).select('+password')

    if (!user)
        throw new Error('Usuário não encontrado')
    else if (!await bcrypt.compare(password, user.password))
        throw new Error('Senha inválida')
    else
        return user
}

UserSchema.pre('save', async function(next) {

    let { username, password, email } = this

    if (!validateUsername(username))
        throw new Error(`Username deve conter entre ${minLengthUsername} à ${maxLengthUsername} caracteres`)

    if (!validatePassword(password))
        throw new Error(`Password deve conter entre ${minLengthPassword} à ${maxLengthPassword} caracteres`)

    if (!validateEmail(email))
        throw new Error(`Formato do email é inválido`)

    this.password = await bcrypt.hash(password, 10)

    next()

})

UserSchema.pre('findOneAndUpdate', async function(next) {

    const {username, email, password} = this.getUpdate()

    if (username && !validateUsername(username))
        throw new Error(`Username deve conter entre ${minLengthUsername} à ${maxLengthUsername} caracteres`)

    if (email && !validateEmail(email))
        throw new Error(`Formato do email é inválido`)

    if (password)
    {
        if (!validatePassword(password))        
            throw new Error(`Password deve conter entre ${minLengthPassword} à ${maxLengthPassword} caracteres`)
        else 
            this.getUpdate().password = await bcrypt.hash(password, 10)
    }
 
    next()
})

const validateUsername = (username) => {
    try {
        return username.length >= minLengthUsername && username.length <= maxLengthUsername;
    } catch (err) { return false }
}

const validatePassword = (password) => {
    try {
        return password.length >= minLengthPassword && password.length <= maxLengthPassword;
    } catch (error) { return false }
}

const validateEmail = (email) => {
    try {
        return /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+/i.test(email)
    } catch (error) { return false }
}

const Example = mongoose.model('example', UserSchema)
module.exports = Example