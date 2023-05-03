import React, { useState } from 'react'
// import Bubble from './bubble'

function Chat() {
    let idConst = 1

    const [messages, setMessages] = useState([])
    const [text, setText] = useState('');
    const sendMessage = (e) => {
        e.preventDefault()
        setMessages([...messages, { id: idConst++, texts: text }]);
    }

  return (
    <div>
    <div className='message-container'>
        <ul className='message-list'>
        {messages.map(msg => (
          <li key={msg.id}>{msg.texts}</li>
        ))}
        </ul>
    </div>
        <form
         onSubmit={(e) => sendMessage(e)}
         >
        To: <input
         id="to"></input>
          Message: <input id="message" name="message"
          onChange={(e) => setText(e.target.value)}></input>
          <button type='submit'
        >Send</button>
        </form>
    </div>
  )
}

export default Chat