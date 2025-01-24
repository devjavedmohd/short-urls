const express = require('express');
const app = express();
const connectToDb = require('./connect');
const urlRoute = require('./routes/url')

const PORT = 8001;

// Connect to mongoDB
connectToDb('mongodb://localhost:27017/short-urls');

app.use(express.json())
app.use('/url', urlRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})