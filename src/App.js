import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import { RxStomp } from "@stomp/rx-stomp";

import Status from "./components/Status";
import Chatroom from "./components/Chatroom";

function App() {
  const rxStompRef = useRef(new RxStomp());
  const rxStomp = rxStompRef.current;

  const [joinedChatroom, setJoinedChatroom] = useState(false);

  useEffect(() => {
    const rxStompConfig = {
      brokerURL: "ws://localhost:15674/ws",
      connectHeaders: {
        login: "guest",
        passcode: "guest",
      },
      debug: (msg) => {
        console.log(new Date(), msg);
      },
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 200,
    };

    rxStomp.configure(rxStompConfig);
    rxStomp.activate();

    return () => {
      rxStomp.deactivate();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello RxStomp!</p>
        <Status rxStomp={rxStomp} />

        {!joinedChatroom && (
          <button onClick={() => setJoinedChatroom(true)}>
            Join chatroom!
          </button>
        )}
        {joinedChatroom && (
          <button onClick={() => setJoinedChatroom(false)}>
            Leave chatroom!
          </button>
        )}

        {joinedChatroom && <Chatroom rxStomp={rxStomp} />}
      </header>
    </div>
  );
}

export default App;
