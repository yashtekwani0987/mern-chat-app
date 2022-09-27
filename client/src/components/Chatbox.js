import React from 'react'
import { ChatState } from '../context/ChatProvider'
import SingleChat from './SingleChat'

const Chatbox = ({fetchChatagain , showAlert , setFetchChatagain}) => {
  const {selectedChat } = ChatState()
  return (
    <div className={`${selectedChat?'flex':'hidden'} md:flex w-[100%] md:w-[68%] items-center flex-col p-3 bg-white rounded`} >
      <SingleChat showAlert={showAlert} fetchChatagain={fetchChatagain} setFetchChatagain={setFetchChatagain} />
    </div>
  )
}

export default Chatbox