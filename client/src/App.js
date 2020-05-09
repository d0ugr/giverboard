import React, { useState } from "react";

import "./App.scss";

function App() {

  const [ viewBoxState, setViewboxState ] = useState({
    x:     0,
    y:     0,
    w:     100,
    h:     100,
    scale: 1
  });
  const [ clickState, setClickState ] = useState({
    mouseDown: false,
    x:         null,
    y:         null,
    vbx:       null,
    vby:       null
  });

  function onMouseDown(event) {
    // Save the position of the mouse when clicking
    //    to calculate relative panning distance
    //    as the mouse moves:
    setClickState({
      mouseDown: true,
      x:         event.clientX,
      y:         event.clientY,
      vbx:       viewBoxState.x,
      vby:       viewBoxState.y
    });
  }

  function onMouseUp(_event) {
    setClickState({
      mouseDown: false,
      x:         null,
      y:         null,
      vbx:       null,
      yvb:       null
    });
  }

  function onMouseMove(event) {
    if (clickState.mouseDown) {
      setViewboxState({
        ...viewBoxState,
        x: clickState.vbx - (event.clientX - clickState.x) / 10,
        y: clickState.vby - (event.clientY - clickState.y) / 10
      });
    }
  }

  function onWheel(event) {
    // Scaling factor for the viewBox width/height:
    let scale = 1;
    // Scale the scroll wheel delta to something not so drastic:
    //    It's typically +/-3 which makes for large zoom steps.
    const wheelDelta = Math.abs(event.deltaY) / 2.75;
    // Scrolling up (zooming in):
    if (event.deltaY < 0) {
      scale = viewBoxState.scale / wheelDelta;
    // Scrolling down (zooming out):
    } else {
      scale = viewBoxState.scale * wheelDelta;
    }
    setViewboxState({
      ...viewBoxState,
      scale
    });
  }

  // Prepare viewBox attribute values:
  const viewBox = {};
  viewBox.w = viewBoxState.w * viewBoxState.scale;
  viewBox.h = viewBoxState.h * viewBoxState.scale;
  viewBox.x = viewBoxState.x - viewBox.w / 2;
  viewBox.y = viewBoxState.y - viewBox.h / 2;

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <svg
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        width={"100%"}
        height={"100%"}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onWheel={onWheel}
      >
        <ellipse cx={0} cy={0} rx={30} ry={20}></ellipse>
      </svg>
    </div>
  );
}

export default App;
