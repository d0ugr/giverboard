import React, { useState, useCallback, useEffect } from "react";

import * as ui from "./lib/ui";

import Card from "./Card";

const CARD_WIDTH  = 30;
const CARD_HEIGHT = 20;



function SvgCanvas(props) {

  const [ svg, setSvg ] = useState(null);
  useEffect(() => {
    setSvg(document.querySelector("svg.whiteboard"));
  }, []);

  const [ viewBoxState, setViewboxState ] = useState({
    x:     0,
    y:     0,
    w:     100,
    h:     100,
  });
  const updateViewboxState = useCallback((data) => {
    if (typeof data === "object") {
      setViewboxState({
        ...viewBoxState,
        ...data
      });
    }
  }, [ viewBoxState ]);

  const [ clickState, setClickState ] = useState({
    x:   null,
    y:   null,
    vbx: null,
    vby: null
  });

  const [ children ] = useState(props.cards);

  // useEffect(() => {
  //   if (svg) {
  //     console.log(svg.getBBox());
  //   }
  // }, [ svg, children ]);

  function onMouseDown(event) {
    // Save the mouse and viewbox position when clicking
    //    to set the viewbox position based on
    //    relative panning distance as the mouse moves:
    // const pt = { x: event.clientX, y: event.clientY };
    const pt = ui.elementPoint(event);
    setClickState({
      x:         pt.x,
      y:         pt.y,
      vbx:       viewBoxState.x,
      vby:       viewBoxState.y
    });
  }

  function onMouseUp(_event) {
    setClickState({
      x:         null,
      y:         null,
      vbx:       null,
      yvb:       null
    });
  }

  function onMouseMove(event) {
    // event.target.style.cursor = (event.ctrlKey ? "move" : "default");
    if (event.ctrlKey && event.buttons === 1) {
      const prevPos  = ui.screenToSvg(svg, clickState);
      // const mousePos = ui.screenToSvg(svg, { x: event.clientX, y: event.clientY });
      const mousePos = ui.screenToSvg(svg, ui.elementPoint(event));
      // const bbox = svg.getBBox();
      // console.log(Math.max(clickState.vbx - (mousePos.x - prevPos.x), bbox.x - (viewBoxState.w * viewBoxState.scale / 2)))
      // const newPos = {
      //   x: Math.max(clickState.vbx - (mousePos.x - prevPos.x), bbox.x - ((viewBoxState.w / 2) * viewBoxState.scale)),
      //   y: Math.max(clickState.vby - (mousePos.y - prevPos.y), bbox.y - ((viewBoxState.h / 2) * viewBoxState.scale))
      // };
      updateViewboxState({
        x: clickState.vbx - (mousePos.x - prevPos.x),
        y: clickState.vby - (mousePos.y - prevPos.y)
        // x: newPos.x,
        // y: newPos.y
      });
    }
  }

  function onWheel(event) {
    const scaleFactor = (event.deltaY < 0 ? 0.9 : 1.1);
    updateViewboxState({
      w: viewBoxState.w * scaleFactor,
      h: viewBoxState.h * scaleFactor
    });
  }



  const viewBox = { ...viewBoxState };
  viewBox.x = viewBoxState.x - viewBoxState.w / 2;
  viewBox.y = viewBoxState.y - viewBoxState.h / 2;

  const cards =
    children.map((card, index) =>
      <Card key={index} x={card.x} y={card.y} w={CARD_WIDTH} h={CARD_HEIGHT} />
    );

  return (
    <svg
      className={props.className}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onWheel={onWheel}
    >
      <ellipse cx={0} cy={0} rx={30} ry={20}></ellipse>
      {cards}
    </svg>
  );
}

export default SvgCanvas;
