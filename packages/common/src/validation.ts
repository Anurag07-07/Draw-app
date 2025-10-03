import {email, z} from 'zod'

export const UserSignupValidation = z.object({
  email:z.string().min(5).email(),
  username:z.string().min(4).regex(/[A-Z]/),
  password:z.string()
})

export const UserSigninValidation = z.object({
  username:z.string().min(4).regex(/[A-Z]/),
  password:z.string()
})

export const RoomValidation = z.object({
  roomdId:z.number()
})

export const JWT_SECRET = "Excildraw"