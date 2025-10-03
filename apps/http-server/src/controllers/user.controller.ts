import { Request, Response } from "express"
import {UserSigninValidation, UserSignupValidation} from '@repo/common/common'
import {prisma} from '@repo/db/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const Signup = async(req:Request,res:Response)=>{
  //Validation
  const UserCheck = UserSignupValidation.safeParse(req.body)

  if (!UserCheck.success) {
    return res.status(400).json({
      message:`Invalid User Details`,
      error:UserCheck.error
    })
  }
  try {
    
    const {username,email,password} = req.body
    
    //Check the User Present or not
    const checking  = await prisma.user.findFirst({
      where:{
        username
      }
    })
    
    if (checking) {
      return res.status(403).json({
        message:'User Already Present'
      })
    }else{
      
      //Hash Password
      const salt = await bcrypt.genSalt()
      const hashpassword = await bcrypt.hash(password,salt)
      
      //Create User 
      const user = await prisma.user.create({
        data:{
          username:username,
          password:hashpassword,
          email:email
        }
      })
      
      return res.status(201).json({
        message:'User Signup Successfully',
        userId:user.id
      })
    }
    
  } catch (error) {
    return res.status(500).json({
      message:`Intenal Server Error`
    })
  }
}

export const Signin = async(req:Request,res:Response)=>{
  //Validation
  const check = UserSigninValidation.safeParse(req.body)
  if (!check.success) {
    return res.status(400).json({
      message:check.error
    })
  }
  const {username,password} = req.body 
  
  try {
    //Check if the user present or not
    const present = await prisma.user.findFirst({
      where:{
        username
      }
    })
    if (!present) {
      return res.status(404).json({
        message:`User not Present`
      })
    }else{
      //If present validate the password and then create a token
      const matchPassword = await bcrypt.compare(password,present.password)
      
      if (!matchPassword) {
        return res.status(401).json({
          message:`Password Not match`
        })
      }
      
      //Create a token
      const token = jwt.sign({
        id:present.id.toString() 
      },process.env.JWT_SECRET as string)
      
        res.cookie('token',token,{
          httpOnly:true,
          sameSite:'strict'
        })
      
        //Token created send it to the user
        return res.status(201).json({
          message:"User Login Succesfully",
          token:token,
          userId:present.id
        })
      }   
  } catch (error:any) {
    return res.status(500).json({
      message:`internal Server Error`,
      error:error
    })
  }
}