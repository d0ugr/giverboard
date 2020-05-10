import React, { useState, useCallback, useEffect } from "react";

import * as ui from "./lib/ui";



function Card(props) {

  const [ svg, setSvg ] = useState(null);
  useEffect(() => {
    setSvg(document.querySelector("svg"));
  }, []);

  const [ cardState, setCardState ] = useState({ ...props });
  const [ clickState, setClickState ] = useState({
    x:   null,
    y:   null,
    vbx: null,
    vby: null
  });

  const updatecardState = useCallback((data) => {
    if (typeof data === "object") {
      setCardState({
        ...cardState,
        ...data
      });
    }
  }, [ cardState ]);

  function onMouseDown(event) {
    console.log(event.target.getBBox())
    // event.preventDefault();
    // event.stopPropagation();
    // Save the mouse and viewbox position when clicking
    //    to set the viewbox position based on
    //    relative panning distance as the mouse moves:
    setClickState({
      x:         event.clientX,
      y:         event.clientY,
      vbx:       cardState.x,
      vby:       cardState.y
    });
  }

  function onMouseUp(event) {
    // event.preventDefault();
    // event.stopPropagation();
    setClickState({
      x:         null,
      y:         null,
      vbx:       null,
      yvb:       null
    });
  }

  function onMouseMove(event) {
    // console.log(screenToSvg(event.clientX, event.clientY));
    if (event.buttons === 1) {
      // event.preventDefault();
      // event.stopPropagation();
      const prevPos  = ui.screenToSvg(svg, clickState.x, clickState.y);
      const mousePos = ui.screenToSvg(svg, event.clientX, event.clientY);
      updatecardState({
        x: clickState.vbx + (mousePos.x - prevPos.x),
        y: clickState.vby + (mousePos.y - prevPos.y)
      });
    }
  }

  return (
    <rect
      x={cardState.x}
      y={cardState.y}
      width={cardState.w}
      height={cardState.h}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    ></rect>
  );

}

export default Card;
