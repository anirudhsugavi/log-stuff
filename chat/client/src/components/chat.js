import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
// import Bubble from './bubble'

function Chat() {

  useEffect(() => {
    connectToServer();
  });

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(e.target.to.value, e.target.message.value);
    displayMessage(e.target.message.value);
    e.target.message.value = '';
  };

  const displayMessage = (message) => {
    const container = document.querySelector('.message-container');
    const bubble = document.createElement('div');
    bubble.textContent = message;
    container.append(bubble);
    container.scrollTop = container.scrollHeight;
  };

  const connectToServer = () => {
    const socket = io('http://localhost:5000');
  };

  return (
    <div>
      <div className='message-container'></div>
      <form onSubmit={(e) => sendMessage(e)}>
        <label for="to">To:</label>
        <input id="to" type="text" />
        <label for="message">Message:</label>
        <input id="message" type="text" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
