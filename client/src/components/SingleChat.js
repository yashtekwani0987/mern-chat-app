import {useState , useEffect} from 'react'
import { json } from 'react-router-dom'
import { getSender, getSenderFull } from '../config/ChatLogics'
import { ChatState } from '../context/ChatProvider'
import Fullchat from './Fullchat'
import Profilemodel from './Profilemodel'
import UpdateGroupChatModel from './UpdateGroupChatModel'
import io from 'socket.io-client'
import './Style.css'
import Typinggif from './Typinggif'

const ENDPOINT = "https://mern-messenger-2.herokuapp.com/"
var socket , selectedChatCompare;

const SingleChat = ({fetchChatagain , setFetchChatagain , showAlert}) => {
    const [messages, setMessages] = useState([])
    const [newmessages, setNewmessages] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const {selectedChat , setSelectedChat , user , notification, setNotification}  = ChatState()
   const fetchMessages = async()=>{
    if(!selectedChat){
        return
    }
    try {
        const response = await fetch(`http://localhost:5000/api/message/${selectedChat._id}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "auth-token":JSON.parse(localStorage.getItem('token'))
            }
            
        })
        const json = await response.json()
        setMessages(json)
        socket.emit('join chat', selectedChat._id )
    } catch (error) {
        showAlert('red', `${error.message}`)
    }

   }
   useEffect(()=>{
    socket = io(ENDPOINT)
    socket.emit("setup",user)
    socket.on("connected" , ()=>setSocketConnected(true));
    socket.on("typing", ()=>setIsTyping(true));
    socket.on('stop typing',()=>setIsTyping(false))
},[])
   const sendMessage =async(e)=>{
    if(e.key==='Enter' && newmessages){
        try {
            const response = await fetch('http://localhost:5000/api/message',{
                method:'POST',
                headers:{
                    "Content-Type":"application/json",
                    "auth-token":JSON.parse(localStorage.getItem('token'))
                },
                body:JSON.stringify({content:newmessages,chatId:selectedChat._id})
                        })
                        setNewmessages('')
            const json = await response.json()
            socket.emit('new message' , json)
            setMessages([...messages ,json ])

        } catch (error) {
            showAlert('red', `${error.message}`)
        }
    }
   }
   const typingHandler =(e)=>{
    setNewmessages(e.target.value)
    if(!socketConnected) return;

   if(!typing){
    setTyping(true)
    socket.emit('typing',selectedChat._id)}

    let lastTypingTime = new Date().getTime()
    var timerLength = 3000;
    setTimeout(() => {
        var timeNow = new Date().getTime()
        var timeDiff = timeNow - lastTypingTime

        if(timeDiff >= timerLength && typing ){
            socket.emit('stop typing' , selectedChat._id)
            setTyping(false)
        }
    }, timerLength);
   }
   useEffect(() => {
    if(selectedChat){
    document.querySelector('.fullchat').scrollTop = document.querySelector('.fullchat').scrollHeight
}}, [messages])
   

   useEffect(() => {
       fetchMessages()
       selectedChatCompare=selectedChat;
   }, [selectedChat])
   useEffect(()=>{
    socket.on('message received' , (newMessageRecieved)=>{
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
           if(!notification.includes(newMessageRecieved)){
            setNotification([newMessageRecieved , ...notification])
            setFetchChatagain(!fetchChatagain)
           }
        }else{
            setMessages([...messages,newMessageRecieved])
        }
    })
   }) 
   
   return (
    <div className='md:h-[100%] h-[100%] w-[100%]'>{selectedChat?(<>
          <h1 className='pb-3 px-2 w-[100%] flex justify-between items-center' >
          <svg onClick={()=>setSelectedChat('')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="cursor-pointer md:hidden block w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
</svg>

        {!selectedChat.isGroupChat?(<>
         {getSender(user,selectedChat.users)}
         <Profilemodel user={getSenderFull(user , selectedChat.users)} >
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>

         </Profilemodel>
        </>):(
            <>{selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModel showAlert={showAlert} fetchChatagain={fetchChatagain} setFetchChatagain={setFetchChatagain}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>
            </UpdateGroupChatModel>
            </>
        )}
          </h1>
          <div className='flex bg-gray-200 flex-col justify-end p-3 w-[100%] h-[90%] overflow-y-hidden rounded'>
            <div className='flex flex-col-reverse fullchat'  >  
                    <Fullchat messages={messages}/>
            </div>
           {isTyping?<div><Typinggif/></div>:<></>}
            <input type="text" className='rounded px-1 py-1' value={newmessages} onChange={typingHandler} onKeyDown={sendMessage} placeholder='Enter a Message' />
          </div>
    </>):(
        <div className='flex items-center justify-center h-[100%]'>
          <p className='text-2xl pb-3' >Click on user to Start Chatting</p>
        </div>
    )
        }

    </div>
  )
}

export default SingleChat