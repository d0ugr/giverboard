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



const socket = io(`ws://${new URL(window.location).hostname}:3001`);



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
  //   },
  //   start: <timestamp>,
  //   stop: <timestamp>,
  //   currentParticipant: <id>
  // }

  const [ connected, setConnected ]     = useState(false);
  const [ sessionList, setSessionList ] = useState([]);
  const [ session, setSession ]         = useState({});

  // Set up stuff on page load:
  useEffect(() => {

    // Window event handlers

    window.addEventListener("popstate", (_event) => {
      joinSession(new URL(window.location).pathname.substring(1));
    });

    // Socket event handlers

    socket.on("connect", () => {
      console.log("socket.connect");
      setConnected(true);
      socket.emit("client_init", props.clientId);
      joinSession(new URL(window.location).pathname.substring(1));
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
        document.title = `${c.APP_NAME} - ${session.name}`;
        const sessionUrl = `${new URL(window.location).origin}/${sessionKey}`;
        if (window.location.href !== sessionUrl) {
          window.history.pushState(null, "", sessionUrl)
        }
        props.setCookie(c.COOKIE_SESSION_ID, sessionKey);
        setSession(session);
        updateNameNotify();
      } else {
        joinSession(cookies.get(c.COOKIE_SESSION_ID) || "default");
      }
    });
  };

  const newSession = () => {
    const name         = document.querySelector("input[name='session-name']").value;
    const hostPassword = document.querySelector("input[name='session-host-password']").value;
    socket.emit("new_session", name, hostPassword, (status, sessionKey) => {
      console.log("socket.new_session:", status, sessionKey)
      if (status === "session_created") {
        joinSession(sessionKey);
        getSessions();
      }
    });
  };

  const startSession = () => {
    socket.emit("start_session");
  };

  const stopSession = () => {
    socket.emit("stop_session");
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
      const cardId = util.uuidv4_compact();
      cards[cardId] = {
        id: cardId,
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
      name: name || `Anonymous${(props.clientId
        ? ` ${props.clientId.toUpperCase().substring(0, 4)}`
        : "")}`
    });
    if (name) {
      props.setCookie(c.COOKIE_USER_NAME, name);
    // Removing a cookie that isn't there causes
    //    Firefox to complain about SameSite:
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



  return (
    <div className="App">

      <Header
        sessionName={session.name}
        connected={connected}
      />

      <div className="main-container">

        <div className="sidebar">
          {/* <p style={{cursor: "pointer"}} onClick={(_event) => }>Reset pan</p>
          <p style={{cursor: "pointer"}} onClick={(_event) => }>Reset zoom</p> */}
          <section className="cards">
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
            {/* <svg>
              <Card x={0} y={0} w={125} h={100} />
            </svg> */}
          </section>
          <section className="sessions">
            <hr/>
            <SessionList
              sessionList={sessionList}
              joinSession={joinSession}
            />
            <input name={"session-name"} placeholder="Session name" />
            <input name={"session-host-password"} type="password" placeholder="Host password" />
            <button onClick={newSession}>Create session</button>
            <p onClick={(_event) => console.log(session)}>Dump session to console</p>
            <p onClick={(_event) => socket.emit("debug_sessions")}>Dump server sessions</p>
          </section>
        </div>

        <main>
          <SizeCues/>
          <SvgCanvas
            viewBoxSize={300}
            className={"whiteboard"}
            cards={session.cards || {}}
            setCardNotify={setCardNotify}
            saveCardNotify={saveCardNotify}
          />
        </main>

        <div className="sidebar">
          <section className="participants">
            <input
              name={"participant-name"}
              placeholder="Enter your name"
              // value={session[].participants[].name}
              onChange={updateNameNotify}
            />
            <ParticipantList
              clientId={props.clientId}
              participants={session.participants || {}}
            />
          </section>
          <section className="host">
            <hr/>
            <button onClick={startSession}>Start session</button><br/>
            <button onClick={stopSession}>Stop session</button><br/>
          </section>
        </div>

      </div>

    </div>
  );
}

export default App;
