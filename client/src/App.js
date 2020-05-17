import React, { useState, useEffect, useCallback } from "react";
import io      from "socket.io-client";
import cookies from "js-cookie";

import * as c    from "./constants";
import * as util from "./lib/util";

import "./App.scss";

import AppHeader       from "./AppHeader";
import SessionStatus   from "./SessionStatus";
import SessionList     from "./sessions/SessionList";
import ParticipantList from "./participants/ParticipantList";
import ImportReader    from "./ImportReader";
import SizeCues        from "./SizeCues";
import SvgCanvas       from "./SvgCanvas";



let socket = null;



function App(props) {

  // session = {
  //   id:   <sessionkey>
  //   name: <name>
  //   cards: {
  //     <cardId>: {
  //       x: 0
  //       y: 0
  //       content: {
  //         ...
  //     }
  //   }
  //   participants: {
  //     <id>: {
  //       name:     <name>
  //       sequence: <index>
  //       host:     <boolean>
  //     }
  //     ...
  //   }
  //   start:       <timestamp>
  //   stop:        <timestamp>
  //   currentTurn: <index>
  // }

  // Set up stuff on page load:
  useEffect(() => {

    // Window event handlers

    window.addEventListener("popstate", (_event) => joinSession());

    // Socket event handlers

    // Connect to the server:
    socket = io(`ws://${new URL(window.location).hostname}:3001`);

    socket.on("connect", () => {
      console.log("socket.connect");
      updateAppState({ connected: true });
      socket.emit("client_init", props.clientId);
      joinSession();
      getSessions();
    });

    socket.on("disconnect", () => {
      console.log("socket.disconnect");
      updateAppState({ connected: false });
    });

    socket.on("server_message",      (message) => console.log("socket.server_message:", message));

    socket.on("update_card",         setCard);
    socket.on("update_cards",        setCards);

    socket.on("update_participant",  setParticipant);

    socket.on("start_session",       (timestamp) => updateSession({ start: timestamp }));
    socket.on("stop_session",        (timestamp) => updateSession({ stop: timestamp }));
    socket.on("update_current_turn", (currentTurn) => updateSession({ currentTurn }));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // State management

  const [ appState, setAppState ] = useState({
    connected:       false,
    participantName: cookies.get(c.COOKIE_USER_NAME),
    sessionList:     []
  });
  const [ session, setSession ] = useState({});

  const updateAppState = useCallback((data) => {
    setAppState((prevState) => ({
      ...prevState,
      ...(data.name && data.value ? { [data.name]: data.value } : data)
    }));
  }, [ setAppState ]);

  const updateSession = useCallback((object) => {
    setSession((prevState) => ({
      ...prevState,
      ...object
    }));
  }, [ setSession ]);

  // Session functions

  const getSessions = () => {
    socket.emit("get_sessions", (sessions) => {
      // console.log("socket.get_sessions:", sessions)
      updateAppState({ sessionList: sessions });
    });
  };

  const joinSession = (sessionKey) => {
    if (!sessionKey) {
      sessionKey = new URL(window.location).pathname.substring(1);
    }
    socket.emit("join_session", sessionKey, (status, session) => {
      // console.log("socket.join_session:", status, session)
      if (status === "session_joined") {
        document.title = `${c.APP_NAME} - ${session.name}`;
        const sessionUrl = `${new URL(window.location).origin}/${sessionKey}`;
        if (window.location.href !== sessionUrl) {
          window.history.pushState(null, "", sessionUrl)
        }
        setSession(session);
        // Set the participant name to what was used in the session,
        //    or keep the current name if new to the session:
        const currentSession = session.participants[props.clientId];
        const participantName = ((currentSession && currentSession.name) || cookies.get(c.COOKIE_USER_NAME));
        if (participantName === appState.participantName) {
          setParticipantNameNotify(participantName);
        } else {
          updateAppState({ participantName });
        }
      } else {
        joinSession("default");
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

  const hostLogin = (password, callback) => {
    socket.emit("host_login", password, (err, pwMatch) => {
      callback(err, pwMatch);
      if (pwMatch) {
        setParticipantNotify(props.clientId, { settings: { host: pwMatch } });
        socket.emit("update_participant_sequence", Object.keys(session.participants));
      }
    });
  };

  const hostLogout = () => {
    setParticipantNotify(props.clientId, { settings: {} });
  };

  const startSession = () => {
    socket.emit("start_session", (err, timestamp) => {
      if (!err) {
        updateSession({
          start:       timestamp,
          currentTurn: 0
        });
        socket.emit("update_current_turn", 0);
      } else {
        console.log("startSession: Error starting session:", err)
      }
    });
  };

  const stopSession = () => {
    socket.emit("stop_session", (err, timestamp) => {
      if (!err) {
        updateSession({
          stop: timestamp
        });
      } else {
        console.log("startSession: Error stopping session:", err)
      }
    });
  };

  const getCurrentTurn = () => (session.start && !session.stop ? session.currentTurn : -1);

  const setTurn = (increment) => {
    const turnMax = Object.keys(session.participants).length - 1;
    let currentTurn = session.currentTurn + increment;
    if (currentTurn < 0) {
      currentTurn = turnMax;
    } else if (currentTurn > turnMax) {
      currentTurn = 0;
    }
    socket.emit("update_current_turn", currentTurn);
    updateSession({ currentTurn });
  };

  // Card functions

  const setCard = useCallback((id, card) => {
    setSession((prevState) => {
      if (card) {
        prevState.cards[id] = util.mergeObjects(prevState.cards[id], card);
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
      prevState.cards = (cards
        ? util.mergeObjects(prevState.cards, cards)
        : {}
      );
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
        prevState.participants[id] =
          util.mergeObjects(prevState.participants[id], participant);
      } else {
        delete prevState.participants[id];
      }
      return { ...prevState };
    });
  }, [ setSession ]);

  const setParticipantNotify = (participant) => {
    setParticipant(props.clientId, participant);
    socket.emit("update_participant", participant);
  };

  const setParticipantNameNotify = (name) => {
    name = name.trim();
    updateAppState({ participantName: name });
    props.setCookie(c.COOKIE_USER_NAME, name);
    setParticipantNotify({ name: getParticipantName(name) });
  };

  const getParticipantName = (name) => {
    return name ||
      (`Anonymous${props.clientId
        ? ` ${props.clientId.toUpperCase().substring(0, 4)}`
        : ""
      }`);
  };

  // Temporary testing functions

  const addRandomCard = (category, title, content) => {
    setCardNotify(util.uuidv4_compact(), {
      x: Math.floor(Math.random() * 200) - 100,
      y: Math.floor(Math.random() * 200) - 100,
      content: {category, title, content }
    });
  };


  const showHostControls =
    (session.participants &&
     session.participants[props.clientId] &&
     session.participants[props.clientId].settings &&
     session.participants[props.clientId].settings.host);
  const cardMoveAllowed =
    !session.participants ||
    !session.participants[props.clientId] ||
    !session.participants[props.clientId].settings ||
    session.participants[props.clientId].settings.host ||
    props.clientId === Object.keys(session.participants)[session.currentTurn];

  return (
    <div className="App">

      <AppHeader
        sessionName={session.name}
        connected={appState.connected}

        currentParticipantName={appState.participantName}
        participantNamePlaceholder={getParticipantName(null)}
        setParticipantName={setParticipantNameNotify}

        showHostControls={showHostControls}
        hostLogin={hostLogin}
        hostLogout={hostLogout}
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
          </section>
          <section className="sessions">
            <hr/>
            <SessionList
              sessionList={appState.sessionList}
              joinSession={joinSession}
            />
            <input
              name={"session-name"}
              placeholder="Session name"
            />
            <input
              name={"session-host-password"}
              type="password"
              placeholder="Host password"
            />
            <button onClick={newSession}>Create session</button>
            <p onClick={(_event) => console.log(session)}>Dump session to console</p>
            <p onClick={(_event) => socket.emit("debug_sessions")}>Dump server sessions</p>
          </section>
        </div>

        <main>
          <SizeCues/>
          <SessionStatus
            participants={session.participants || {}}
            sessionStart={session.start}
            sessionStop={session.stop}
            currentTurn={getCurrentTurn()}
          />
          <SvgCanvas
            viewBoxSize={300}
            className={"whiteboard"}
            cards={session.cards || {}}
            cardMoveAllowed={cardMoveAllowed}
            setCardNotify={setCardNotify}
            saveCardNotify={saveCardNotify}
          />
        </main>

        <div className="sidebar">
          <section className="participants">
            <ParticipantList
              clientId={props.clientId}
              participants={session.participants || {}}
              currentTurn={getCurrentTurn()}
            />
          </section>
          <section className={`host${showHostControls ? "" : " hidden"}`}>
            <hr/>
            <button onClick={startSession}>Start session</button><br/>
            <button onClick={stopSession}>Stop session</button><br/>
            <button onClick={(_event) => setTurn(-1)}>Previous turn</button>
            <button onClick={(_event) => setTurn(1)}>Next turn</button>
          </section>
        </div>

      </div>

    </div>
  );
}

export default App;
