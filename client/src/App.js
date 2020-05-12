import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

import "./App.scss";

import SvgCanvas from "./SvgCanvas";
// import Card from "./Card";



const socket = io("http://localhost:3001");

// socket.on("connect", function() {
//   console.log("socket.connect");
// });

// socket.on("disconnect", function() {
//   console.log("socket.disconnect");
// });

socket.on("server_message", (message) => {
  console.log(`socket.server_message ${message}`);
});

let newId = 1;


// cardId: {
//   x: 0,
//   y: 0,
//   fields: {
//     ...
//   }
// }



function App(_props) {

  const [ cards, setCards ] = useState({
    kitties:  { x:    0, y:   0},
    chickens: { x: -100, y: -50},
    kitckens: { x:  150, y:  60}
  });

  const findCard = (id) => cards[id];

  const setCard = useCallback((id, card) => {
    setCards((prevState) => {
      if (card) {
        prevState[id] = card;
      } else {
        delete prevState[id];
      }
      return { ...prevState };
    });
  }, [ setCards ]);

  const setCardNotify = (id, card) => {
    setCard(id, card);
    socket.emit("update_cards", id, card);
  }



  // Temporary testing functions

  const addRandomCard = (_event) => {
    const newCardId = `id_${newId++}`;
    const newCard = {
      x:  Math.floor(Math.random() * 200) - 100,
      y:  Math.floor(Math.random() * 200) - 100,
    };
    setCardNotify(newCardId, newCard);
  }

  const updateChickens = () => {
    setCardNotify("chickens", {
      x: 10, y: 10,
    });
  }



  // Set up stuff on page load:
  useEffect(() => {
    socket.on("update_cards", (id, card) => {
      console.log("socket.update_cards", id, card);
      setCard(id, card);
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
            <li onClick={(_event) => console.log(cards)}>Dump cards</li>
            <li onClick={addRandomCard}>Kitties</li>
            <li onClick={(_event) => updateChickens()}>Chickens</li>
            <li onClick={(_event) => setCardNotify("kitckens")}>Kittes and chickens</li>
          </ul>
          {/* <svg>
            <Card x={0} y={0} w={125} h={100} />
          </svg> */}
        </div>
        <SvgCanvas
          viewBoxSize={300}
          className={"whiteboard"}
          cards={cards}
          findCard={findCard}
          setCardNotify={setCardNotify}
        />
      </main>

    </div>
  );
}

export default App;
