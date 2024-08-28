import React from 'react'
import "./Chatbox.css"

const ChatBox = ({chatName, messageCount, handleClick,id}) => {
  return (
    <div className='chat-box' id={id} onClick={handleClick(id)}>
        <div className='msg-count-box'>{messageCount}</div>
        <div className='chat-name-box'>{chatName}</div>
    </div>
  )
}

export default ChatBox
