import React from 'react'
import Login from './Login'
import Signup from './Signup'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const Home = ({showAlert}) => {
const navigate = useNavigate()

useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user-info'))
  if(user){
    navigate('/chat')
  }
}, [navigate])


  return (
    <div className=''>
      <div className='mx-auto mt-6 md:w-2/5 w-11/12 '>
        <div className='py-3 drop-shadow-lg text-center rounded bg-white'>

        <h1 className='text-2xl'>Talk-A-Tive</h1>
        </div>
        <div className='drop-shadow-lg mt-4 rounded bg-white'>
        <ul className="nav nav-tabs flex flex-row flex-wrap list-none border-b-0 pl-0 mb-4" id="tabs-tab"
  role="tablist">
  <li className="nav-item w-3/6 text-center" role="presentation">
    <a href="#tabs-home" className="
      nav-link
      block
      font-medium
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2 border-transparent
      px-6
      py-3
      my-2
      hover:border-transparent hover:bg-gray-100
      focus:border-transparent
      active
    " id="tabs-home-tab" data-bs-toggle="pill" data-bs-target="#tabs-home" role="tab" aria-controls="tabs-home"
      aria-selected="true">Login</a>
  </li>
  <li className="nav-item w-3/6 text-center" role="presentation">
    <a href="#tabs-profile" className="
      nav-link
      block
      font-medium
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2 border-transparent
      px-6
      py-3
      my-2
      hover:border-transparent hover:bg-gray-100
      focus:border-transparent
    " id="tabs-profile-tab" data-bs-toggle="pill" data-bs-target="#tabs-profile" role="tab"
      aria-controls="tabs-profile" aria-selected="false">Signup</a>
  </li>
</ul>
<div className="tab-content" id="tabs-tabContent">
  <div className="tab-pane fade show active" id="tabs-home" role="tabpanel" aria-labelledby="tabs-home-tab">
    <Login showAlert={showAlert} />
  </div>
  <div className="tab-pane fade" id="tabs-profile" role="tabpanel" aria-labelledby="tabs-profile-tab">
    <Signup showAlert={showAlert} />
  </div>
</div>          

        </div>
      </div>
    </div>
  )
}

export default Home