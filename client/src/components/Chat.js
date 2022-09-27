import { useState } from 'react'
import Mychats from './Mychats'
import Sidebar from './Sidebar'
import Chatbox from './Chatbox'
import ChatProvider, { ChatState } from '../context/ChatProvider'
const Chat = ({showAlert}) => {
  const {user} = ChatState()
  const [fetchChatagain, setFetchChatagain] = useState(false)
  
  return (
<div>
  {user && <Sidebar showAlert={showAlert} />}
  <div className='flex p-3 h-[88vh] w-full justify-between'>
    {user && <Mychats showAlert={showAlert} fetchChatagain={fetchChatagain} />}
    {user && <Chatbox showAlert={showAlert} fetchChatagain={fetchChatagain} setFetchChatagain={setFetchChatagain}  />}
  </div>
</div>
  )
}

export default Chat