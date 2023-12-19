const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { verify } = require('jsonwebtoken')
const { hash, compare } = require('bcryptjs')
const PORT = process.env.PORT
const { fakeDB } = require('./fakeDB')
const { createRefreshToken, createAccessToken, sendAccessToken, sendRefreshToken } = require('./tokens')
const { isAuth } = require('./isAuth')

// 1. Register a user

//2. Login a user

//3. Logout a user

//4. Setup a protected route

//5. Get a new accesstoken with a refresh token

const app = express()
// use express middleware for easier cookie handling
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

// Needed to be able to read body data
app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })) // support URL encoded bodies

//1. Register a user

app.post('/register', async (req, res) => {
    const { email, password } = req.body
    try {
        // check user exist

        const user = await fakeDB.find(users => users.email === email)
        if (user) {
            return res.status(403).send({ message: 'user already exist' })
        }
        // if not user exit , hash the password
        const hashedpassword = await hash(password, 10)
        // insert the user in database
        const User = {
            id: fakeDB.length,
            email,
            password: hashedpassword
        }
        fakeDB.push(User)
        // create access token for the newly register user
        const accesstoken = createAccessToken(User.id)
        const refreshtoken = createRefreshToken(User.id)

        // send the accesstoken as a response
        sendAccessToken(req, res, accesstoken)

        console.log(hashedpassword);
        User.refreshtoken = refreshtoken
        console.log(fakeDB);

    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
})

// 2. Login a user

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        // 1. find user in database . if exist send error
        const user = fakeDB.find(user => user.email === email)
        if (!user) {
            return res.status(404).send({ message: 'User does not exist' })
        }
        // 2. compare crypted password and see if it checks out. send error if not  
        const valid = await compare(password, user.password)
        if (!valid) {
            return res.status(401).send({ message: 'password not correct' })
        }
        //3. Create Refresh and Accestoken
        const accesstoken = createAccessToken(user.id)
        const refreshtoken = createRefreshToken(user.id)
        // put the refreshtoken in the database
        user.refreshtoken = refreshtoken
        console.log(fakeDB);
        //5. send token. Refreshtoken as a cookie and accesstoken as a regular response
        sendRefreshToken(res, refreshtoken)
        sendAccessToken(req, res, accesstoken)

    } catch (error) {
        return res.status(500).send({ message: error.message })
    }

})

//3. Logout a user

app.post('/logout', (req, res) => {
    res.clearCookie('refreshtoken', { path: '/refresh_token' })
    return res.status(200).send({ message: 'Logged out' })
})

//4. Protected route

app.post('/protected', async (req, res) => {
    try {
        const userId = isAuth(req, res)
        if (userId !== null) {
            return res.status(403).send({ data: 'This is protected data' })
        }
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
})

// Get a new access token with a refresh token

app.post('/refresh_token', (req, res) => {
    const token = req.cookies.refreshtoken
    // if we dont have a token in our request
    if (!token) return res.send({ accesstoken: '' })
    // we have a token lets verify it
    let payload = null
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        return res.send({ accesstoken: '' })
    }
    // Token is valid, check if user exist
    const user = fakeDB.find(user => user.id === payload.userId)
    if (!user) return res.send({ accesstoken: '' })
    // user exist, check if refreshtoken exist on user
    if (user.refreshtoken !== token) {
        return res.send({ accesstoken: '' })
    }
    // Token exist, create new refresh and accesstoken
    const accesstoken = createAccessToken(user.id)
    const refreshtoken = createRefreshToken(user.id)
    user.refreshtoken = refreshtoken
    // All good to go send new refreshtoken and accesstoken
    sendRefreshToken(res, refreshtoken)
    return res.send({ accesstoken })
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})