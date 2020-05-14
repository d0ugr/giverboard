import React, { useState, useEffect, useCallback } from "react";
import io      from "socket.io-client";
import cookies from "js-cookie";

import * as c    from "./constants";
import * as util from "./lib/util";

import "./App.scss";

import Header          from "./Header";
import SessionList     from "./sessions/SessionList";
import ParticipantList from "./participants/ParticipantList";
import ImportReader    from "./ImportReader";
import SizeCues        from "./SizeCues";
import SvgCanvas       from "./SvgCanvas";



const windowLocation = new URL(window.location);
const socket = io(`ws://${windowLocation.hostname}:3001`);



function App(props) {

  // session = {
  //   id: <sessionkey>
  //   name: <name>,
  //   cards: {
  //     <cardId>: {
  //     x: 0,
  //     y: 0,
  //     content: {
  //       ...
  //     }
  //   },
  //   participants: {
  //     id: <id>
  //     name: <name>
  //   }
  // }

  const [ connected, setConnected ] = useState(false);
  const [ session, setSession ] = useState({});
  const [ sessionList, setSessionList ] = useState([]);

  // Session functions

  const getSessions = () => {
    socket.emit("get_sessions", (sessions) => {
      // console.log("socket.get_sessions:", sessions)
      setSessionList(sessions);
    });
  };

  const joinSession = (sessionKey) => {
    socket.emit("join_session", sessionKey, (status, session) => {
      // console.log("socket.join_session:", status, session)
      if (status !== "error") {
        props.setCookie(c.COOKIE_SESSION_ID, sessionKey, );
        setSession(session);
        updateNameNotify();
      } else {
        joinSession(cookies.get(c.COOKIE_SESSION_ID) || "default");
      }
    });
  };

  const newSession = () => {
    const name = document.querySelector("input[name='card-title']").value;
    socket.emit("new_session", name, (status, sessionKey) => {
      console.log("socket.new_session:", status, sessionKey)
      if (status === "session_created") {
        joinSession(sessionKey);
        getSessions();
      }
    });
  };

  // Card functions

  const setCard = useCallback((id, card) => {
    setSession((prevState) => {
      if (card) {
        prevState.cards[id] = {
          ...prevState.cards[id],
          ...card
        };
      } else {
        delete prevState.cards[id];
      }
      return { ...prevState };
    });
  }, [ setSession ]);

  const setCardNotify = (id, card) => {
    setCard(id, card);
    socket.emit("update_card", id, card);
  };

  const saveCardNotify = (id) => {
    socket.emit("save_card", id);
  };

  const setCards = useCallback((cards) => {
    setSession((prevState) => {
      if (cards) {
        prevState.cards = {
          ...prevState.cards,
          ...cards
        };
      } else {
        prevState.cards = {};
      }
      return { ...prevState };
    });
  }, [ setSession ]);

  const setCardsNotify = useCallback((cards) => {
    setCards(cards);
    socket.emit("update_cards", cards);
  }, [ setCards ]);

  const addCard = () => {
    const title   = document.querySelector(".sidebar input[name='card-title']").value;
    const content = document.querySelector(".sidebar textarea").value;
    addRandomCard("", title, content);
  };

  const addJiraCardsNotify = (cardData) => {
    let x = -200;
    let y = -200;
    const cards = {};
    for (const row of cardData) {
      cards[util.uuidv4_compact()] = {
        id: util.uuidv4_compact(),
        x, y,
        content: {
          category: row["Issue Type"].toLowerCase(),
          title:    row["Issue key"],
          content:  row["Summary"]
        }
      };
      y += 20;
    }
    setCardsNotify(cards);
  };

  // Participant functions

  const setParticipant = useCallback((id, participant) => {
    setSession((prevState) => {
      if (participant) {
        prevState.participants[id] = {
          ...prevState.participants[id],
          ...participant
        };
      } else {
        delete prevState.participants[id];
      }
      return { ...prevState };
    });
  }, [ setSession ]);

  const setParticipantNotify = (id, participant) => {
    setParticipant(id, participant);
    socket.emit("update_participant", participant);
  };

  const updateNameNotify = (event) => {
    const name = (event
      ? event.target
      : document.querySelector("input[name='participant-name']")
    ).value.trim();
    setParticipantNotify(props.clientId, {
      name: name || `Anonymous${(props.clientId ? ` ${props.clientId.substring(0, 4)}` : "")}`
    });
    if (name) {
      props.setCookie(c.COOKIE_USER_NAME, name);
    } else if (cookies.get(c.COOKIE_USER_NAME)) {
      cookies.remove(c.COOKIE_USER_NAME);
    }
  };



  // Temporary testing functions

  const addRandomCard = (category, title, content) => {
    setCardNotify(util.uuidv4_compact(), {
      x: Math.floor(Math.random() * 200) - 100,
      y: Math.floor(Math.random() * 200) - 100,
      content: {
        category: category,
        title:    title,
        content:  content
      }
    });
  };



  // Set up stuff on page load:
  useEffect(() => {

    socket.on("connect", () => {
      console.log("socket.connect");
      setConnected(true);
      socket.emit("client_init", props.clientId);
      joinSession(windowLocation.pathname.substring(1));
      getSessions();
    });

    socket.on("disconnect", () => {
      console.log("socket.disconnect");
      setConnected(false);
    });

    socket.on("server_message", (message) => console.log("socket.server_message:", message));

    socket.on("update_card", setCard);
    socket.on("update_cards", setCards);

    socket.on("update_participant", setParticipant);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <div className="App">

      <Header
        sessionName={session.name}
        connected={connected}
      />

      <main>

        <div className="sidebar">
          {/* <p style={{cursor: "pointer"}} onClick={(_event) => }>Reset pan</p>
          <p style={{cursor: "pointer"}} onClick={(_event) => }>Reset zoom</p> */}
          <input name={"participant-name"} placeholder="Enter your name" onChange={updateNameNotify}/>
          <hr/>
          <div>
            <input name={"card-title"} placeholder="Card title" />
            <textarea name={"card-content"} placeholder="Card content" />
            <button onClick={addCard}>Add card</button>&nbsp;
            <button onClick={(_event) => setCardsNotify(null)}>Clear board</button>
          </div>
          <p>
            <ImportReader
              prompt="Import Jira CSV file..."
              header={true}
              onFileLoaded={(_fileInfo, csvData) => addJiraCardsNotify(csvData)}
              onError={() => alert("Error")}
            />
          </p>
          <hr/>
          <SessionList
            sessionList={sessionList}
            joinSession={joinSession}
          />
          <p onClick={(_event) => newSession()}>New session</p>
          <p onClick={(_event) => console.log(session)}>Dump session to console</p>
          <p onClick={(_event) => socket.emit("debug_sessions")}>Dump server sessions</p>
          {/* <svg>
            <Card x={0} y={0} w={125} h={100} />
          </svg> */}
        </div>

        <div className="main-container">
          <SizeCues />
          <SvgCanvas
            viewBoxSize={300}
            className={"whiteboard"}
            cards={session.cards || {}}
            setCardNotify={setCardNotify}
            saveCardNotify={saveCardNotify}
          />
        </div>

        <div className="sidebar">
          <ParticipantList
            clientId={props.clientId}
            participants={session.participants || {}}
          />
        </div>

      </main>

    </div>
  );
}

export default App;
