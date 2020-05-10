import React from "react";
// import React, { useState } from "react";

import "./App.scss";
import SvgCanvas from "./SvgCanvas";
import Card from "./Card";

// import {INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE} from "react-svg-pan-zoom";

function App() {

  // const [ state, setState ] = useState({tool: TOOL_NONE, value: INITIAL_VALUE});
  // let Viewer = null;

  // function changeTool(tool) {
  //   setState({
  //     ...state,
  //     tool
  //   });
  // }

  // function changeValue(value) {
  //   setState({
  //     ...state,
  //     value
  //   });
  // }

  // function fitToViewer() {
  //   Viewer.fitToViewer();
  // }

  // function fitSelection() {
  //   Viewer.fitSelection(40, 40, 200, 200);
  // }

  // function zoomOnViewerCenter() {
  //   Viewer.zoomOnViewerCenter(1.1);
  // }

  const cards = [
    { x: 0, y: 0 },
    { x: -100, y: -50 },
    { x: 150, y: 60 }
  ];

  return (
    <div className="App">
      <header>
        WB2020
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

      {/* <div>
        <button className="btn" onClick={() => zoomOnViewerCenter()}>Zoom in</button>
        <button className="btn" onClick={() => fitSelection()}>Zoom area 200x200</button>
        <button className="btn" onClick={() => fitToViewer()}>Fit</button>
        <hr/>

        <ReactSVGPanZoom
          width={1000}
          height={700}
          ref={Vwr => Viewer = Vwr}
          tool={state.tool}
          onChangeTool={tool => changeTool(tool)}
          value={state.value}
          onChangeValue={value => changeValue(value)}

          onZoom={_e => console.log("zoom")}
          onPan={_e => console.log("pan")}

          onClick={event => console.log("click", event.x, event.y, event.originalEvent)}
        >
          <svg width={617} height={316}>
            <g fillOpacity=".5" strokeWidth="4">
              <rect x="400" y="40" width="100" height="200" fill="#4286f4" stroke="#f4f142"/>
              <circle cx="108" cy="108.5" r="100" fill="#0ff" stroke="#0ff"/>
              <circle cx="180" cy="209.5" r="100" fill="#ff0" stroke="#ff0"/>
              <circle cx="220" cy="109.5" r="100" fill="#f0f" stroke="#f0f"/>
            </g>
          </svg>
        </ReactSVGPanZoom>
      </div> */}

    </div>
  );
}

export default App;
