import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ({showAlert}) => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    email:'',
    password:''
  })
  const onChange = (e)=>{
        setCredentials({...credentials , [e.target.name]:e.target.value})
  }
  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(credentials.email&&credentials.password){
      const response = await fetch('http://localhost:5000/api/auth/loginuser',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email:credentials.email,password:credentials.password})
      })
      const json = await response.json()
      if(json.success===true){
        const {authtoken} = json
        localStorage.setItem('user-info',JSON.stringify(json.userexist , authtoken))
        localStorage.setItem('token',JSON.stringify(authtoken))
        setCredentials({email:'',password:''})

      navigate('/chat')
      }
      else{
        setCredentials({email:'',password:''})
        showAlert('red' , 'Invalid Credentials')
      }
    }
    else{
      setCredentials({email:'',password:''})
      showAlert('red','Failed! Fill the Details Properly')
    }
  }
  return (
    <div >
      <div className="block p-6 rounded-lg shadow-lg bg-white">
  <form onSubmit={handleSubmit}>
    <div className="form-group mb-6">
      <label for="exampleInputEmail1" className="form-label inline-block mb-2 text-gray-700">Email address</label>
      <input name='email' value={credentials.email} onChange={(e)=>{onChange(e)}} type="email" className="form-control
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
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputEmail188"
        aria-describedby="emailHelp" placeholder="Enter email"/>
    </div>
    <div className="form-group mb-6">
      <label for="exampleInputPassword1" className="form-label inline-block mb-2 text-gray-700">Password</label>
      <input name='password' value={credentials.password} onChange={(e)=>{onChange(e)}} type="password" className="form-control block
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
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputPassword15"
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
      shadow-md
       hover:shadow-lg
       focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out">Login</button>
  </form>
</div>
    </div>
  )
}

export default Login