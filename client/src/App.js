import React, { useState } from "react";

import "./App.scss";

import SvgCanvas from "./SvgCanvas";
import Card from "./Card";



function App() {

  // All the elements added to the canvas:
  const [ cards, setCards ] = useState([
    { x: 0, y: 0 },
    { x: -100, y: -50 },
    { x: 150, y: 60 }
  ]);

  function addCard(_event) {
    setCards([
      ...cards,
      {
        x: Math.floor(Math.random() * 200) - 100,
        y: Math.floor(Math.random() * 200) - 100,
      }
    ])
  }



  return (
    <div className="App">
      <header>
        WB2020 -&nbsp;<span style={{color: "darkgrey"}}>Hold Ctrl to pan the canvas, Kitties add cards</span>
      </header>
      <main>
        <div className="App-sidebar">
          <ul>
            <li onClick={addCard}>Kitties</li>
            <li>Chickens</li>
            <li>Kittes and chickens</li>
          </ul>
          <svg>
            <Card x={0} y={0} w={100} h={100} />
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
