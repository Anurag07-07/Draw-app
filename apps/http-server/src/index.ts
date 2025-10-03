import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()

//Server Intialization
app.listen(process.env.PORT,()=>{
  console.log(`Server started at PORT ${process.env.PORT}`);
})
