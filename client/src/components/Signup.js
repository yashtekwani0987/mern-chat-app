import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = ({showAlert}) => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    name:'',
    email:'',
    password:''
  })
  const onChange = (e)=>{
    setCredentials({...credentials ,[e.target.name]:e.target.value})
}

  const handleSubmit=async(e)=>{
    e.preventDefault()
    if(credentials.name && credentials.email && credentials.password){
      console.log(credentials)
      const response = await fetch('http://localhost:5000/api/auth/createuser',{
        method:'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({name:credentials.name,email:credentials.email,password:credentials.password})
      })
      const json = await response.json()
      console.log(json) 
      if(json.success===true){
        setCredentials({
          name:'',
          email:'',
          password:''
        })
        localStorage.setItem('user-info' ,JSON.stringify(json.user))
        localStorage.setItem('token' , JSON.stringify(json.authtoken))
         
        navigate('/chat')
      }
        else{
          setCredentials({
            name:'',
            email:'',
            password:''
          })
          
          showAlert('red', 'User Already Exists! Please Login')
        }
      }
    else{

      showAlert('red','Fill the Field Properly')
    }
    
  }
  return (
    <div className='w-full' >
        <div className="block p-6 rounded-lg -mt-8 shadow-lg bg-white w-full">
  <form className='' onSubmit={handleSubmit} >
    <div className="form-group mb-6">
      <label htmlFor="exampleInputname" className="form-label inline-block mb-2 text-gray-700">Name</label>
      <input name='name' type="text" value={credentials.name} onChange={(e)=>{onChange(e)}} className="form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputEmail1"
        aria-describedby="emailHelp" placeholder="Enter Name"/>
      
    </div>
    <div className="form-group mb-6">
      <label htmlFor="exampleInputEmail1" className="form-label inline-block mb-2 text-gray-700">Email address</label>
      <input name='email' type="email" value={credentials.email} onChange={(e)=>{onChange(e)}} className="form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputEmail12"
        aria-describedby="emailHelp" placeholder="Enter email"/>
      
    </div>
    <div className="form-group mb-6">
      <label htmlFor="exampleInputPassword1" className="form-label inline-block mb-2 text-gray-700">Password</label>
      <input name='password' type="password" value={credentials.password} onChange={(e)=>{onChange(e)}} className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputPassword1"
        placeholder="Password"/>
    </div>
    
   
    <button style={{backgroundColor:'#00bce4'}} type="submit" className="
      px-6
      w-full
      py-2.5
      text-black
      
      font-medium
      text-x
      leading-tight
      uppercase
      rounded
      shadow-md hover:shadow-lg
      focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out">SignUp</button>
  </form>
  
</div>

    </div>
  )
}

export default Signup