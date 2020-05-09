import React from "react";
import { useState } from "react";

import "./App.scss";

function App() {

  // const { viewState, setViewState } = useState({ zoom: 1 });
  const [ mouseState, setMouseState ] = useState({ mouseDown: false, x: null, y: null });
  const [ viewbox, setViewbox ] = useState({ x: 0, y: 0, w: 100, h: 100, scale: 1 });

  function onMouseDown(event) {
    // Set the position of the mouse when clicking
    //    to calculate relative panning distance
    //    as the mouse moves:
    setMouseState({
      mouseDown: true,
      x: event.clientX,
      y: event.clientY
    });
    const svg = document.getElementById("svg");
    setViewbox({
      ...viewbox,
      x: svg.viewBox.baseVal.x,
      y: svg.viewBox.baseVal.y
    });
  }

  function onMouseUp(_event) {
    setMouseState({
      mouseDown: false,
      x: null,
      y: null
    });
  }

  function onMouseMove(event) {
    if (mouseState.mouseDown) {
      // Should be this:
      // setViewbox({
      //   ...viewbox,
      //   x: viewbox.x + (event.clientX - mouseState.x) / 10,
      //   y: viewbox.y + (event.clientY - mouseState.y) / 10
      // });
      // But doing this for now:
      //    Because setting viewBox on the svg element in JSX is being stupid.
      const svg = document.getElementById("svg");
      svg.viewBox.baseVal.x = viewbox.x + (event.clientX - mouseState.x) / 10;
      svg.viewBox.baseVal.y = viewbox.y + (event.clientY - mouseState.y) / 10;
    }
  }

  function onWheel(event) {
    // Scaling factor for the viewBox width/height:
    let scale = 1;
    // The scroll wheel delta is +/-3 so it's also scaled
    //    to make zooming not as drastic;
    const wheelDelta = Math.abs(event.deltaY) / 2.75;
    // Scrolling up (zooming in):
    if (event.deltaY < 0) {
      // setViewbox({
      //   ...viewbox,
      //   scale: viewbox.scale * event.deltaY
      // });
      scale *= wheelDelta;
    // Scrolling down (zooming out):
    } else {
      // setViewbox({
      //   ...viewbox,
      //   scale: viewbox.scale / event.deltaY
      // });
      scale /= wheelDelta;
    }
    // Scale the width/height of the viewBox:
    //    This currently doesn't account for the top-left
    //    position needing to be updated, so the objects don't remain centered.
    const svg = document.getElementById("svg");
    svg.viewBox.baseVal.width  *= scale;
    svg.viewBox.baseVal.height *= scale;
  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <svg
        id="svg"
        viewBox="0, 0, 100, 100"
        width={"100%"}
        height={"100%"}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onWheel={onWheel}
      >
        <ellipse cx={50} cy={50} rx={30} ry={20} fill="purple"></ellipse>
      </svg>
    </div>
  );
}

export default App;
