const express = require('express')
const cors = require('cors')
const  connectDB= require('./config/mongodb.js')
require('dotenv').config()

//App Config
const app = express()
const port = process.env.PORT || 3000
connectDB()
//Middlewares
app.use(express.json())
app.use(cors())

//api endpoints
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


