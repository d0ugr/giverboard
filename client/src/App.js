import React, { useState, useEffect, useCallback } from "react";
import io      from "socket.io-client";
import cookies from "js-cookie";

import * as c    from "./constants";
import * as util from "./lib/util";

import "./App.scss";

import AppHeader       from "./AppHeader";
import Sidebar         from "./Sidebar";
import SessionStatus   from "./SessionStatus";
import SessionList     from "./sessions/SessionList";
import ParticipantList from "./ParticipantList";
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
      updateAppState({ connected: true });
      socket.emit("client_init", props.clientId);
      joinSession();
      getSessions();
    });

    socket.on("disconnect", () => updateAppState({ connected: false }));

    socket.on("server_message",      (message) => console.log("socket.server_message:", message));

    socket.on("update_card",         setCard);
    socket.on("update_cards",        setCards);

    socket.on("update_participant",  setParticipant);

    socket.on("start_session",       (timestamp) => updateSession({ start: timestamp, stop: null }));
    socket.on("stop_session",        (timestamp) => updateSession({ stop: timestamp }));
    socket.on("update_current_turn", (currentTurn) => updateSession({ currentTurn }));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // State management

  const [ appState, setAppState ] = useState({
    connected:       false,
    participantName: cookies.get(c.COOKIE_USER_NAME),
    sessionList:     [],
    // Initialize the canvas SVG viewbox origin and dimensions:
    //    The origin refers to the center of the viewbox
    //    and is translated later when actually setting its position.
    viewBox: {
      x: 0,
      y: 0,
      w: c.VIEWBOX_SIZE,
      h: c.VIEWBOX_SIZE,
    }
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
      console.log("socket.join_session:", status, session)
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

  const newSession = (name, hostPassword) => {
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
        setParticipantNotify({ settings: { host: pwMatch } });
        socket.emit("update_participant_sequence", Object.keys(session.participants));
      }
    });
  };

  const hostLogout = () => {
    setParticipantNotify({ settings: {} });
  };

  const startSession = () => {
    socket.emit("start_session", (err, timestamp) => {
      if (!err) {
        updateSession({
          start:       timestamp,
          stop:        null,
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

  const setCard = useCallback((cardKey, card) => {
    setSession((prevState) => {
      if (card) {
        prevState.cards[cardKey] = util.mergeObjects(prevState.cards[cardKey], card);
      } else {
        delete prevState.cards[cardKey];
      }
      return { ...prevState };
    });
  }, [ setSession ]);

  const setCardNotify = (cardKey, card) => {
    setCard(cardKey, card);
    socket.emit("update_card", cardKey, card);
  };

  const saveCardNotify = (cardKey) => {
    socket.emit("save_card_position", cardKey);
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

  const addCardNotify = (content) => {
    setCardNotify(util.uuidv4_compact(), {
      content,
      position: {
        x: Math.floor(Math.random() * 200) - 100,
        y: Math.floor(Math.random() * 200) - 100,
      }
    });
  };

  const addJiraCardsNotify = (cardData) => {
    const minY = appState.viewBox.y - (appState.viewBox.h / 2 - 10);
    const maxY = minY + 200;
    let x = appState.viewBox.x - (appState.viewBox.w / 2 - 10);
    let y = minY;
    const cards = {};
    for (const row of cardData) {
      const cardId = util.uuidv4_compact();
      cards[cardId] = {
        id: cardId,
        content: {
          category: row["Issue Type"].toLowerCase(),
          title:    row["Issue key"],
          body:     row["Summary"]
        },
        position: { x, y }
      };
      y += 20;
      if (y >= maxY) {
        x += c.CARD_WIDTH + 10;
        y = minY;
      }
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
    name = (name ? name.trim() : "");
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

  const [ sidebarOpen, setSidebarOpen ] = React.useState(false);
  const openSidebar  = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="App">

      <AppHeader
        sessionName={session.name}
        connected={appState.connected}

        currentParticipantName={appState.participantName}
        participantNamePlaceholder={getParticipantName(null)}
        setParticipantName={setParticipantNameNotify}

        newSession={newSession}

        clearBoard={() => setCardsNotify(null)}

        showSidebar={openSidebar}
        addJiraCards={addJiraCardsNotify}

        showHostControls={showHostControls}
        sessionStarted={session.start && !session.stop}
        startSession={startSession}
        stopSession={stopSession}

        hostLogin={hostLogin}
        hostLogout={hostLogout}
      />

      <Sidebar
        sidebarOpen={sidebarOpen}
        openSidebar={openSidebar}
        closeSidebar={closeSidebar}
        addCard={addCardNotify}
      />

      <div className="main-container">

        <main>
          <div className="bg-image"></div>
          <SizeCues/>
          <SessionStatus
            participants={session.participants || {}}
            showHostControls={showHostControls}
            sessionStart={session.start}
            sessionStop={session.stop}
            currentTurn={getCurrentTurn()}
            setTurn={setTurn}
            stopSession={stopSession}
          />
          <SvgCanvas
            viewBoxSize={350}
            canvasState={appState.viewBox}
            updateCanvasState={updateAppState}
            className={"whiteboard"}
            cards={session.cards || {}}
            cardMoveAllowed={cardMoveAllowed}
            setCardNotify={setCardNotify}
            saveCardNotify={saveCardNotify}
          />
        </main>

        <div className="sidebar">
          {/* <p style={{cursor: "pointer"}} onClick={(_event) => }>Reset pan</p>
          <p style={{cursor: "pointer"}} onClick={(_event) => }>Reset zoom</p> */}
          <section className="sessions">
            <SessionList
              sessionList={appState.sessionList}
              joinSession={joinSession}
            />
            <p onClick={(_event) => console.log(session)}>Dump session to console</p>
            <p onClick={(_event) => socket.emit("debug_sessions")}>Dump server sessions</p>
          </section>
          <section className="participants">
            <ParticipantList
              clientId={props.clientId}
              participants={session.participants || {}}
              currentTurn={getCurrentTurn()}
            />
          </section>
        </div>

      </div>

    </div>
  );
}

export default App;
