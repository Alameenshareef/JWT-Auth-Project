const { verify } = require('jsonwebtoken')

const isAuth = (req, res) => {
    const authorization = req.headers['authorization']
    if (!authorization) {
        return res.status(401).send({ message: 'You need to login' })
    }
    // Bearer 'sdfghjkldcvgbhnjkmlcvbnm'
    const token = authorization.split(' ')[1]
    const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET)
    return userId
}
module.exports = {
    isAuth
}