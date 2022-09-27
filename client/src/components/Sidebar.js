import React from 'react'
import { useState } from 'react'
import Profilemodel from './Profilemodel'
import {  useNavigate } from 'react-router-dom'
import { ChatState } from '../context/ChatProvider'
import { getSender } from '../config/ChatLogics'
const Sidebar = ({showAlert}) => {
  const {user ,setSelectedChat , chats , setChats , notification, setNotification} = ChatState()
  const [search, setSearch] = useState('')
    const [searchresults, setSearchresults] = useState([])
   const [toogle, setToogle] = useState('hidden') 
   const navigate = useNavigate()
   const handleLogout = ()=>{
    localStorage.removeItem('user-info')
    localStorage.removeItem('token')
     navigate('/')
   }
   const toggle = ()=>{
    if(toogle===''){
        setToogle('hidden')
    }
    else{
        setToogle('')
    }
   }
   const handleSearch = async()=>{
      if(!search){
         showAlert('red' , 'No user with this Name')
      }
      else{
        try {
            const response = await fetch(`http://localhost:5000/api/auth/searchuser?search=${search}`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "auth-token": JSON.parse(localStorage.getItem("token"))
                }
            })
            const json = await response.json()
            if(json.length==0){
              showAlert('red' , 'No User With this UserName')
            } 
            setSearchresults(json)
        } catch (error) {
            console.log(error.message)
        }
      }
   }
   const accesschat = async(userId)=>{
    try {
        const response = await fetch('http://localhost:5000/api/chat/createchat',{
            method:"POST",
             headers:{
                "Content-Type":"application/json",
                "auth-token":JSON.parse(localStorage.getItem('token'))
            },
            body:JSON.stringify({userId})
            },
        )
        const json = await response.json()
        // console.log(json)
        if(!chats.find((c)=> c._id===json._id)) setChats([json,...chats])
         setSelectedChat(json)
         toggle()
        
    } catch (error) {
        console.log(error.message)
    }

   }
   console.log(notification)
    return (
        <>
    <div className='bg-white px-6 flex justify-between items-center text-white py-2 drop-shadow-lg' >
        <button onClick={toggle} type="button" className="
    px-2 rounded
    py-2.5
    text-black
    bg-white
    font-medium
    text-xs
    leading-tight
    uppercase
    hover:shadow-lg
    focus:shadow-lg focus:outline-none focus:ring-0
    active:shadow-lg
    transition
    flex
    items-center
    duration-150
    ease-in-out
  " data-bs-toggle="tooltip" data-bs-placement="top" title="Search User to Chat">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</svg>
   <p className='md:block hidden'>
    Search User to Chat</p>
  </button>
  <h1 className='text-black text-xl font-bold'>Talk-A-Tive</h1>
  <div className='flex items-center'>
  <div class="dropdown relative">
    <a class="
          text-gray-500
          hover:text-gray-700
          focus:text-gray-700
          mr-4
          dropdown-toggle
          hidden-arrow
          flex items-center
        " href="#" id="dropdownMenuButton1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bell"
        class="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="currentColor"
          d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z">
        </path>
      </svg>
      <span class="text-white bg-red-700 absolute rounded-full text-xs -mt-2.5 ml-2 py-0 px-1.5">{notification.length>0?notification.length:''}</span>
    </a>
    <ul class="
      dropdown-menu
      min-w-max
      absolute
      hidden
      bg-white
      text-base
      z-1
      float-left
      py-2
      list-none
      text-left
      rounded-lg
      shadow-lg
      mt-1
      hidden
      m-0
      bg-clip-padding
      border-none
      left-auto
      right-0
    " aria-labelledby="dropdownMenuButton1">
    <li>
        <a class="
          dropdown-item
          text-sm
          py-2
          px-4
          font-normal
          block
          w-full
          whitespace-nowrap
          bg-transparent
          text-gray-700
          hover:bg-gray-100
        " href="/">{!notification.length && "No New Messages"}
        {notification.map(notif=>(
          <div onClick={(e)=>{
            setSelectedChat(notif.chat);
            e.preventDefault()
            setNotification(notification.filter((n)=>n!==notif))
          }} key={notif._id}>
            {notif.chat.isGroupChat?`New message ${notif.chat.chatName}`:`New message from ${getSender(user,notif.chat.users)}`}
          </div>
        ))}</a>
      </li>
    </ul>
  </div>

  <div className="flex justify-center">
  <div>
    <div className="dropdown relative">
      <button
        className="
          dropdown-toggle
          bg-blue-600
          text-white
          font-medium
          text-xs
          leading-tight
          uppercase
          rounded
          shadow-md
          hover:bg-blue-700 hover:shadow-lg
          focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
          active:bg-blue-800 active:shadow-lg active:text-white
          transition
          duration-150
          ease-in-out
          flex
          rounded-full
          items-center
          whitespace-nowrap
        "
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
       <img className='w-[36px] rounded-full' src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt="" />
        </button>
      <ul
        className="
          dropdown-menu
          min-w-max
          absolute
          hidden
          bg-white
          text-base
          z-50
          float-left
          py-2
          list-none
          text-left
          rounded-lg
          shadow-lg
          mt-1
          hidden
          m-0
          bg-clip-padding
          border-none
        "
        aria-labelledby="dropdownMenuButton1"
      >
        <li>
          
        <button
            className="
              dropdown-item
              text-sm
              py-2
              px-4
              font-normal
              block
              w-full
              whitespace-nowrap
              bg-transparent
              text-gray-700
              hover:bg-gray-100
            "
            >
              My Profile
            </button>
          
    </li>
        <li>
          <a
          onClick={handleLogout}
            className="
              dropdown-item
              text-sm
              py-2
              px-4
              font-normal
              block
              w-full
              whitespace-nowrap
              bg-transparent
              text-gray-700
              hover:bg-gray-100
            "
            href="#"
            >LogOut</a
          >
        </li>
        
      </ul>
    </div>
  </div>
</div>
  </div>
  {/* //model */}
  
</div>
<div className='pb-4'>
<div className={`${toogle} w-60 h-[90%] shadow-md bg-white px-1 absolute`}>
  <ul className="relative">
    <li className="relative p-4 flex ">
      <input value={search} onChange={(e)=>setSearch(e.target.value)} className="drop-shadow flex items-center text-sm px-2 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 border border-black hover:bg-gray-100 transition duration-300 ease-in-out" href="#!" placeholder='Search here by name' data-mdb-ripple="true" data-mdb-ripple-color="dark"/>
      <button onClick={handleSearch} className='bg-gray-200 px-3 rounded drop-shadow ml-2'>Go</button>
    </li>
    <li>
        {searchresults.map((val,key)=>{
            return (<div onClick={()=>{accesschat(val._id)}} key={key} className='rounded py-1 hover:cursor-pointer hover:bg-[#0dd3ff] hover:drop-shadow-lg flex items-center bg-gray-300 my-3'>
                <div className='mx-2'><img className='w-[30px] rounded-full' src={val.pic} alt="" /></div>
                <div className='flex flex-col justify-center items-start'>
            <h1 className='font-bold' >{val.name}</h1>
            <h1 className='text-sm'>{val.email}</h1></div>
            </div>
            )
        })}
    </li>
    
  </ul>
</div>
</div>
</>
  )
}

export default Sidebar