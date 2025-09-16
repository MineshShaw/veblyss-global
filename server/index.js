import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import connectDB from './config/mongodb.js'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import cookieParser from 'cookie-parser'
dotenv.config({path: './.env'})

//App Config
const app = express()
const port = process.env.PORT || 3000
connectDB()
//Middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(cookieParser());

//api endpoints
app.get('/', (req, res) => res.send('Hello World!'))
//Listener
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => console.log(`Server listening on port ${port}!`))
