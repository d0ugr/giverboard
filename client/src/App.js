import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

import * as util from "./lib/util";

import "./App.scss";

import Header       from "./Header";
import SessionList  from "./SessionList";
import ImportReader from "./ImportReader";
import SizeCues     from "./SizeCues";
import SvgCanvas    from "./SvgCanvas";



const url = new URL(window.location);
const socket = io(`ws://${url.hostname}:3001`);



const DEFAULT_SESSION = { cards: {} };



function App(_props) {

  // session = {
  //   id: <dbid>   <- Get rid of this
  //   name: <name>,
  //   cards: {
  //     <cardId>: {
  //     x: 0,
  //     y: 0,
  //     content: {
  //       ...
  //     }
  //   }
  // }

  const [ connected, setConnected ] = useState(false);

  const [ sessionList, setSessionList ] = useState([]);

  const [ session, setSession ] = useState(DEFAULT_SESSION);

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

  const deleteAllCards = useCallback(() => {
    setSession((prevState) => {
      return {
        ...prevState,
        cards: {}
      };
    });
  }, [ setSession ]);

  const deleteAllCardsNotify = useCallback(() => {
    deleteAllCards();
    socket.emit("delete_all_cards");
  }, [ deleteAllCards ]);



  const getSessions = () => {
    socket.emit("get_sessions", (sessions) => {
      console.log("socket.get_sessions:", sessions)
      setSessionList(sessions);
    });
  };

  const joinSession = (sessionId) => {
    socket.emit("join_session", sessionId, (status, session) => {
      console.log("socket.join_session:", status, session)
      setSession(session);
    });
  };

  const newSession = () => {
    const title = document.querySelector(".App-sidebar input[name='card-title']").value;
    socket.emit("new_session", title, (status, sessionId) => {
      console.log("socket.new_session:", status, sessionId)
      if (status === "session_created") {
        joinSession(sessionId);
        getSessions();
      }
    });
  };

  const addCard = () => {
    const title   = document.querySelector(".App-sidebar input[name='card-title']").value;
    const content = document.querySelector(".App-sidebar textarea").value;
    addRandomCard("", title, content);
  };

  const addJiraCards = (cardData) => {
    let x = -200;
    let y = -200;
    for (const row of cardData) {
      if (row["Issue Type"] && row["Issue key"] && row["Summary"]) {
        setCardNotify(util.uuidv4_compact(), {
          x, y,
          content: {
            category: row["Issue Type"].toLowerCase(),
            title:    row["Issue key"],
            content:  row["Summary"]
          }
        });
        y += 20;
      }
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
      joinSession("default");
      getSessions()
    });

    socket.on("disconnect", () => {
      console.log("socket.disconnect");
      setConnected(false);
    });

    socket.on("server_message", (message) => console.log("socket.server_message:", message));

    socket.on("update_card", (id, card) => setCard(id, card));
    socket.on("delete_all_cards", () => deleteAllCards());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <div className="App">

      <Header
        sessionName={session.name}
        connected={connected}
      />

      <main>

        <div className="App-sidebar">
          {/* <p style={{cursor: "pointer"}} onClick={(_event) => }>Reset pan</p>
          <p style={{cursor: "pointer"}} onClick={(_event) => }>Reset zoom</p> */}
          <div>
            <label>Title</label><br/><input name={"card-title"} /><br/>
            <label>Content</label><br/><textarea name={"card-content"} /><br/>
            <button onClick={addCard}>Add card</button>&nbsp;
            <button onClick={deleteAllCardsNotify}>Clear board</button>
          </div>
          <p style={{cursor: "pointer"}}>
            <ImportReader
              prompt="Open Jira CSV file..."
              header={true}
              onFileLoaded={(_fileInfo, csvData) => addJiraCards(csvData)}
              onError={() => alert("Error")}
            />
          </p>
          <hr/>
          <SessionList
            sessionList={sessionList}
            joinSession={joinSession}
          />
          <p style={{cursor: "pointer"}} onClick={(_event) => newSession()}>New session</p>
          <p style={{cursor: "pointer"}} onClick={(_event) => console.log(session)}>Dump session to console</p>
          {/* <svg>
            <Card x={0} y={0} w={125} h={100} />
          </svg> */}
        </div>

        <div className="main-container">
          <SizeCues />
          <SvgCanvas
            viewBoxSize={300}
            className={"whiteboard"}
            cards={session.cards}
            setCardNotify={setCardNotify}
          />
        </div>

      </main>

    </div>
  );
}

export default App;
