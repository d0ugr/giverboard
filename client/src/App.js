import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

import "./App.scss";

import SvgCanvas from "./SvgCanvas";
import Card from "./Card";



const socket = io("http://localhost:3001");

// socket.on("connect", function() {
//   console.log("socket.connect");
// });

// socket.on("disconnect", function() {
//   console.log("socket.disconnect");
// });

socket.on("server_message", function(message) {
  console.log(`socket.server_message ${message}`);
});



function App(_props) {

  const [ cards, setCards ] = useState([
    { x:    0, y:   0 },
    { x: -100, y: -50 },
    { x:  150, y:  60 }
  ]);

  const addCard = useCallback((card) => {
    setCards((prevState) => [
      ...prevState,
      card
    ]);
  }, [ setCards ]);

  function addRandomCard(_event) {
    const newCard = {
      x: Math.floor(Math.random() * 200) - 100,
      y: Math.floor(Math.random() * 200) - 100,
    };
    addCard(newCard);
    socket.emit("add_card", newCard);
  }

  useEffect(() => {
    console.log("useEffect: page load")
    socket.on("add_card", function(card) {
      // console.log("socket.add_card", card);
      addCard(card);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <div className="App">
      <header>
        WB2020 -&nbsp;<span style={{color: "darkgrey"}}>Hold Ctrl to pan the canvas, Kitties add cards</span>
      </header>
      <main>
        <div className="App-sidebar">
          <ul>
            <li onClick={addRandomCard}>Kitties</li>
            <li>Chickens</li>
            <li>Kittes and chickens</li>
          </ul>
          <svg>
            <Card x={0} y={0} w={125} h={100} />
          </svg>
        </div>
        <SvgCanvas
          className={"whiteboard"}
          cards={cards}
        />
      </main>

    </div>
  );
}

export default App;
