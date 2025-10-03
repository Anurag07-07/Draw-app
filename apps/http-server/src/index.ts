import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
import cors from 'cors'
import user from './routes/user.route.js'

//Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors())

//Routes
app.use('/api/v1/',user)


//Server Intialization
app.listen(process.env.PORT,()=>{
  console.log(`Server started at PORT ${process.env.PORT}`);
})
