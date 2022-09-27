import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../context/ChatProvider'

const Fullchat = ({messages}) => {
  
    const {user} = ChatState()
    return (
          <InfiniteScroll dataLength={messages.length} hasMore={true} >
            {messages&& messages.map((m,i)=>(
                <div className='flex items-center' key={m._id}>
                 {(isSameSender(messages,m,i,user._id) ||
                 isLastMessage(messages,i,user._id)) &&
                 (
                    <div>
                        <img className='w-[30px] rounded-full' src={m.sender.pic} alt="image" />
                    </div>

                 )}
                 <span className={`bg-${m.sender._id===user._id?'[#BEE3F8]':'[#B9F5D0]'} max-w-[75%] px-2 py-1 rounded-xl ml-${isSameSenderMargin(messages,m,i,user._id)} mt-${isSameUser(messages,m,i,user._id)?3:10} `}   >{m.content}</span>
                </div>
            ))}
          </InfiniteScroll>    
  )
}

export default Fullchat