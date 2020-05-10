import React from "react";

import "./App.scss";

import SvgCanvas from "./SvgCanvas";
import Card from "./Card";



function App() {

  const cards = [
    { x: 0, y: 0 },
    { x: -100, y: -50 },
    { x: 150, y: 60 }
  ];

  return (
    <div className="App">
      <header>
        WB2020 - Hold Ctrl to pan the canvas
      </header>
      <main>
        <div className="App-sidebar">
          <ul>
            <li>Kitties</li>
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
