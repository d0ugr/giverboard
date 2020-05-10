import React, { useState, useCallback, useEffect } from "react";

import * as ui from "./lib/ui";

import Card from "./Card";



const LEFT_BUTTON = 1;

const KEY_CTRL = 17;

const CARD_WIDTH  = 30;
const CARD_HEIGHT = 20;



// SvgCanvas creates an <svg> element that can be used as
//    an unbounded canvas that can be panned and zoomed.
//
// TODO: Add new child creation
// TODO: Add pan and zoom distance limiting

function SvgCanvas(props) {

  // Save a reference to the <svg> element for use later
  //    to map screen coordinates to SVG space coordinates:
  const [ svg, setSvg ] = useState(null);
  useEffect(() => {
    setSvg(document.querySelector("svg.whiteboard"));
  }, []);

  // Initialize the canvas SVG viewbox origin and dimensions:
  //    The origin refers to the center of the viewbox
  //    and is translated later when actually setting its position.
  const [ canvasState, setCanvasState ] = useState({
    x: 0, y: 0,
    w: 300, h: 300,
  });
  const updatecanvasState = useCallback((data) => {
    if (typeof data === "object") {
      setCanvasState({
        ...canvasState,
        ...data
      });
    }
  }, [ canvasState ]);

  // clickState saves information at the time of a mouse click
  //    to use while moving stuff:
  const [ clickState, setClickState ] = useState(null);

  // useEffect(() => {
  //   if (svg) {
  //     console.log(svg.getBBox());
  //   }
  // }, [ svg, children ]);

  // setOnMouseDown is called to save the mouse and an element's
  //    position at the time of a click.  Then when the mouse is moved,
  //    its position is updated with the mouse movement relative to
  //    the original click position.  This is called by the children too.

  function setOnMouseDown(svgCanvas, event, state, callback) {
    setClickState({
      mouse:  ui.elementPoint(svgCanvas, event),
      object: { ...state, updateState: callback },
    });
  }

  // Canvas mouse event handlers:

  function onMouseDown(event) {
    if (event.ctrlKey) {
      setOnMouseDown(svg, event, canvasState, updatecanvasState);
    }
  }

  function onMouseUp(_event) {
    setClickState(null);
  }

  function onMouseMove(event) {
    // console.log(event.target)
    // console.log(event.clientX, event.clientY)

    // Show the move cursor over the canvas if holding Ctrl:
    svg.style.cursor = (event.ctrlKey ? "move" : "default");

    // Only move stuff if the left mouse button is being held:
    if (event.buttons === LEFT_BUTTON && clickState) {
      const prevPos  = ui.screenToSvg(svg, clickState.mouse);
      const mousePos = ui.screenToSvg(svg, ui.elementPoint(svg, event));
      const mouseDelta = {
        x: mousePos.x - prevPos.x,
        y: mousePos.y - prevPos.y
      }
      // Moving an element in the canvas:
      if (!event.ctrlKey) {
        clickState.object.updateState({
          x: clickState.object.x + mouseDelta.x,
          y: clickState.object.y + mouseDelta.y
        });
      // Panning the canvas:
      } else {
        clickState.object.updateState({
          x: clickState.object.x - mouseDelta.x,
          y: clickState.object.y - mouseDelta.y
        });

        // Attempt to limit panning distance:

        // const bbox = svg.getBBox();
        // console.log(Math.max(clickState.vbx - (mousePos.x - prevPos.x), bbox.x - (canvasState.w * canvasState.scale / 2)))
        // const newPos = {
        //   x: Math.max(clickState.vbx - (mousePos.x - prevPos.x), bbox.x - ((canvasState.w / 2) * canvasState.scale)),
        //   y: Math.max(clickState.vby - (mousePos.y - prevPos.y), bbox.y - ((canvasState.h / 2) * canvasState.scale))
        // };
        // clickState.object.updateState({
        //   x: newPos.x,
        //   y: newPos.y
        // });
      }
    }
  }

  function onWheel(event) {
    const scaleFactor = (event.deltaY < 0 ? 0.9 : 1.1);
    updatecanvasState({
      w: canvasState.w * scaleFactor,
      h: canvasState.h * scaleFactor
    });
  }

  // Canvas keyboard event handlers:

  function onKeyDown(event) {
    svg.style.cursor = (event.keyCode === KEY_CTRL ? "move" : "default");
  }

  function onKeyUp(event) {
    svg.style.cursor = (event.keyCode === KEY_CTRL ? "default" : "move");
  }



  // Translate the canvas position to the upper left corner that's expected:
  const viewBox = { ...canvasState };
  viewBox.x = canvasState.x - canvasState.w / 2;
  viewBox.y = canvasState.y - canvasState.h / 2;

  // Return the <svg> element to render:
  return (
    <svg
      tabIndex="0"
      className={props.className}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    >
      <ellipse cx={0} cy={0} rx={30} ry={20}></ellipse>
      {props.cards.map((card, index) =>
        <Card
          key={index}
          x={card.x} y={card.y}
          w={CARD_WIDTH} h={CARD_HEIGHT}
          setOnMouseDown={setOnMouseDown}
        />
      )}
    </svg>
  );
}

export default SvgCanvas;
