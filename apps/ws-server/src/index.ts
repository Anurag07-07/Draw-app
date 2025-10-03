import { WebSocketServer } from "ws";
const wss = new WebSocketServer({port:8080})
import jwt from 'jsonwebtoken'
import {JWT_SECRET } from '@repo/common/common'

interface JwtPayload {
  id: string;
}

wss.on('connection',(socket,request)=>{

  //Extract the token from the Link
  let url =  request.url
  if (!url) {
    socket.close(1008,"Missing URL")
    return
  }
  try {
    const urlSplit = new URLSearchParams(url?.split("?")[1])
    const tokenvalue = urlSplit.get('token') || ""
    
    const decoded = jwt.verify(
      tokenvalue,
      JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded || !decoded.id) {
      socket.close(1008, "Invalid token");
      return;
    }

    socket.on('message',(e)=>{
    socket.send("Hello")
  })


  } catch (error:any) {
    console.error("JWT Error:", error);
    socket.close(1008, "Unauthorized");
  }
})