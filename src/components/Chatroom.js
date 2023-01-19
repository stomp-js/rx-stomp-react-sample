import React, { useState, useEffect } from 'react';

export default function Chatroom (props) {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const [userName, setUserName] = useState(`user${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    console.log('rendering');
    const subscription = props.rxStomp.watch('/topic/test').subscribe((message) => {
      const messageBody = JSON.parse(message.body);
      setChatMessages(chatMessages => [...chatMessages, messageBody]);
    });

    return () => {
      console.log('tearing down');
      subscription.unsubscribe();
    };
  }, []);

  function sendMessage () {
    const body = JSON.stringify({ user: userName, message });
    props.rxStomp.publish({ destination: '/topic/test', body });
    setMessage('');
  }

  return (
        <>
            <h2>Chatroom</h2>

            <label htmlFor="username">Username: </label>
            <input type="text" name="username" value={userName} onChange={(e) => setUserName(e.target.value)} />

            <label htmlFor="message">Message: </label>

            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} name="message"/>
            <button onClick={() => sendMessage()}>Send Message</button>

            <p><strong>Chat Messages</strong></p>
            <ul>
            {chatMessages.map((chatMessage, index) => (
                <li key={index}>
                    <strong>{chatMessage.user}</strong>: {chatMessage.message}
                </li>
            ))}
            </ul>
        </>
  );
}
