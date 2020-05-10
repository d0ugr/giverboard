import React, { useState, useCallback, useEffect } from "react";

import Card from "./Card";



function elementCoords(event) {
  const rect = event.target.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function screenToSvg(svg, point) {
  const pt  = svg.createSVGPoint();
  pt.x = point.x;
  pt.y = point.y;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}



function SvgCanvas(props) {

  const [ svg, setSvg ] = useState(null);
  useEffect(() => {
    setSvg(document.querySelector("svg"));
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
    const pt = elementCoords(event);
    setClickState({
      mouseDown: true,
      x:         pt.x,
      y:         pt.y,
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
    // event.target.style.cursor = (event.ctrlKey ? "move" : "default");
    if (event.ctrlKey && event.buttons === 1) {
      const prevPos  = screenToSvg(svg, clickState);
      const mousePos = screenToSvg(svg, elementCoords(event));
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
    // Scale the scroll wheel delta to something not so drastic:
    //    It's typically +/-3 which makes for large zoom steps.
    const wheelDelta = Math.abs(event.deltaY) / 2.75;
    const scaleFactor = (event.deltaY < 0 ? 1 / wheelDelta : wheelDelta);
    const viewBox = {};
    viewBox.w = viewBoxState.w * scaleFactor;
    viewBox.h = viewBoxState.h * scaleFactor;
    updateViewboxState(viewBox);
  }

  const cards =
    children.map((card, index) =>
      <Card key={index} x={card.x} y={card.y} w={card.w} h={card.h} />
    );

  const viewBox = { ...viewBoxState };
  viewBox.x = viewBoxState.x - viewBoxState.w / 2;
  viewBox.y = viewBoxState.y - viewBoxState.h / 2;

  return (
    <svg
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
