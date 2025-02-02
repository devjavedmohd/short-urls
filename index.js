const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser')

// Custom modules
const URL = require('./models/url');
const connectToDb = require('./connect');
const { restrictToLoggedinUserOnly, checkAuth } = require('./middleware/auth')
// Routes
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter')
const usersRoute = require('./routes/users')

// App and Port registred
const app = express();
const PORT = 8001;

// Connect to mongoDB
connectToDb('mongodb://localhost:27017/short-urls');

// View engine set to 'ejs'
app.set('view engine', 'ejs');

// views folder path set to './views'
app.set('views', path.resolve('./views'))

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Dynamic route for backend
app.use('/url', restrictToLoggedinUserOnly, urlRoute)
// Static route for front end
app.use('/user', usersRoute)
app.use('/', checkAuth, staticRoute)


// Test get for all urls
app.get('/test', async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls
    })
})

// app listen started
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})