import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import Status from './components/Status';

function App() {
  const [rxStomp, _setRxStomp] = useState(new RxStomp()); // useref?
  const [message, setMessage] = useState('');
  // const [connectionStatus, setConnectionStatus] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [channelSubscription, setChannelSubscription] = useState(null);

  const [userName, setUserName] = useState(`User ${Math.floor(Math.random() * 1000)}`);

  const isOnChatroom = channelSubscription !== null;

  useEffect(() => {
    const rxStompConfig = {
      brokerURL: 'ws://localhost:15674/ws',
      connectHeaders: {
        login: 'guest',
        passcode: 'guest',
      },
      debug: (msg) => {
        console.log(new Date(), msg);
      },
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 200
    }

    rxStomp.configure(rxStompConfig);
    rxStomp.activate();

    return () => {
      rxStomp.deactivate();
    }
  }, []);

  function sendMessage() {
    const body = `${userName}: ${message}`
    rxStomp.publish({destination: '/topic/test', body: body});
    setMessage('');
  }

  function subscribeToChatMessages() {
    const subscription = rxStomp.watch('/topic/test').subscribe((message) => {
      setChatMessages(chatMessages => [...chatMessages, message.body]);
    });
    setChannelSubscription(subscription);
  }

  function unsubscribeFromChatMessages() {
    channelSubscription.unsubscribe();
    setChannelSubscription(null);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello RxStomp!
        </p>
        <Status rxStomp={rxStomp} />

        {!isOnChatroom && <button onClick={() => subscribeToChatMessages()}>Join chatroom!</button>}
        {isOnChatroom && <>
          <button onClick={() => unsubscribeFromChatMessages()}>Leave chatroom</button>

          <label htmlFor="username">Username: </label>
          <input type="text" name="username" value={userName} onChange={(e) => setUserName(e.target.value)} />

          <label htmlFor="message">Message: </label>

          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} name="message"/>
          <button onClick={() => sendMessage()}>Send Message</button>

          <h2>Chat Messages</h2>
          <ul>
            {chatMessages.map((chatMessage, index) => (
              <li key={index}>{chatMessage}</li>
            ))}
          </ul>
          </>
        }
      </header>
    </div>
  );
}

export default App;
