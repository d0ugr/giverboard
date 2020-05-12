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
    kitties:  { x: -100, y: -50, fields: { title: "kitties!",  content: "Kitties are the best." } },
    chickens: { x:    0, y:   0, fields: { title: "chickens!", content: "No, chickens are the best!" } },
    kitckens: { x:  150, y:  60, fields: { title: "kitckens!", content: "Let's breed them and make a half-kitty, half chicken!!!" } }
  });

  const setCard = useCallback((id, card) => {
    setCards((prevState) => {
      if (card) {
        prevState[id] = {
          ...prevState[id],
          ...card
        };
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

  const addRandomCard = () => {
    const title   = document.querySelector(".App-sidebar input[name='card-title']").value;
    const content = document.querySelector(".App-sidebar textarea").value;
    setCardNotify(`id_${newId++}`, {
      x: Math.floor(Math.random() * 200) - 100,
      y: Math.floor(Math.random() * 200) - 100,
      fields: {
        title:   title,
        content: content
      }
    });
  }

  const updateChickens = () => {
    setCardNotify("chickens", {
      x: 10, y: 10,
    });
  }



  // Set up stuff on page load:
  useEffect(() => {
    socket.on("update_cards", (id, card) => setCard(id, card));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <div className="App">

      <header className="App-header">
        WB2020 -&nbsp;<span style={{color: "darkgrey"}}>Hold Ctrl to pan the canvas</span>
      </header>

      <main>

        <div className="App-sidebar">
          <p style={{cursor: "pointer"}} onClick={(_event) => console.log(cards)}>Dump cards to console</p>
          <p style={{cursor: "pointer"}} onClick={(_event) => addRandomCard()}>Add card</p>
          <p style={{cursor: "pointer"}} onClick={(_event) => updateChickens()}>Move chickens</p>
          <p style={{cursor: "pointer"}} onClick={(_event) => setCardNotify("kitckens")}>Remove kitckens</p>
          {/* <p style={{cursor: "pointer"}} onClick={(_event) => }>Reset pan</p>
          <p style={{cursor: "pointer"}} onClick={(_event) => }>Reset zoom</p> */}
          <hr/>
          <div>
            <label>Title</label><br/><input name={"card-title"} /><br/>
            <label>Content</label><br/><textarea name={"card-content"} /><br/>
            <button onClick={addRandomCard}>Add card</button>
          </div>
          {/* <svg>
            <Card x={0} y={0} w={125} h={100} />
          </svg> */}
        </div>

        <div className="main-container">
          <div className="left size-cue">EASY</div>
          <div className="right size-cue">HARD</div>
          <SvgCanvas
            viewBoxSize={300}
            className={"whiteboard"}
            cards={cards}
            setCardNotify={setCardNotify}
          />
        </div>

      </main>

    </div>
  );
}

export default App;
