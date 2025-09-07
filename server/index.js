import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import dotenv from 'dotenv'
dotenv.config({path: './.env'})

//App Config
const app = express()
const port = process.env.PORT || 3000
connectDB()
//Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//api endpoints
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Server listening on port ${port}!`))
