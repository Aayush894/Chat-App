import React from 'react'

function ConversationItem({ props}) {
  return (
    <div className='conversation-container'>
      <p className="con-icon">{props.name[0]}</p>
      <p className='con-name'>{props.name}</p>
      <p className='con-message'>{props.lastMessage}</p>
      <p className='con-time'>{props.timeStamp}</p>
    </div>
  )
}

export default ConversationItem