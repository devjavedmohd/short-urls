const {v4: uuidv4} = require('uuid')
const Users = require('../models/users')
const {setUser, getUser} = require('../services/auth')

const handleUserSignUp = async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.render('signup', { error: "All fields required." })
    try {
        const existingUser = await Users.findOne({ email })
        console.log(existingUser)
        if (existingUser) {
            console.log("User already registred." )
            return res.render('signup', { error: "User already registred." })
        }
        await Users.create({
            name,
            email,
            password
        })
        return res.redirect('/')

    } catch (error) {
        return res.render('signup', { error: "something went wrong" })
    }
}
const handleUserLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email, password })
    if (!user) return res.render('login', { error: "Invalid username or password" })

    const token = setUser(user)
    res.cookie('uid', token)
    return res.redirect('/')
}
module.exports = {
    handleUserSignUp,
    handleUserLogin
}