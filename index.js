import express from 'express'
import dotenv from 'dotenv'
import connectMongo from './db.js'
import cors from 'cors'
import chatrouter from './routes/chat.js'
import authrouter from './routes/auth.js'
import messagerouter from './routes/message.js'
import { Server } from 'socket.io'
import path, { dirname } from 'path'

dotenv.config()
connectMongo()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth' , authrouter)
app.use('/api/chat' , chatrouter)
app.use('/api/message' , messagerouter)


// ----------------------Deployement----------------------
 const _dirname = path.resolve()
 if(process.env.NODE_ENV==='production'){
      app.use(express.static(path.join(_dirname,"/client/build")))

      app.get('*',(req,res)=>{
            res.sendFile(path.resolve(_dirname,"client","build","index.html"))
      })
 }
 else{
    app.get('/',(req,res)=>{
        res.send("API is Running Successfully")
    })
 }




// ----------------------Deployement----------------------



const PORT = process.env.PORT
const server = app.listen(PORT , ()=>{
    console.log(`APP Listening on ${PORT}` )
})
const io = new Server(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    },

})
io.on('connection',(socket)=>{
    // console.log('conneted to Socket')
    socket.on('setup',(userData)=>{
          socket.join(userData._id)
          socket.emit("connected")
    })
    socket.on("join chat",(room)=>{
        socket.join(room);
        // console.log("User Joined Room" + room)
    })
    socket.on('typing' , (room)=>socket.in(room).emit('typing'))
    socket.on('stop typing' , (room)=>socket.in(room).emit('stop typing'))

    socket.on('new message',(newMessageRecieved)=>{
           var chat = newMessageRecieved.chat
           if(!chat.users)return console.log('chat.users not defined')

           chat.users.forEach((user)=>{
            if(user==newMessageRecieved.sender._id) return;
            console.log(user , newMessageRecieved)
        socket.in(user).emit("message received" , newMessageRecieved )
           })
    })
})



