import React, { useState, useCallback, useEffect } from "react";

import * as ui from "./lib/ui";

import Card from "./Card";



const LEFT_BUTTON = 1;

const KEY_CTRL = 17;

const VIEWBOX_SIZE = 300;



// SvgCanvas creates an <svg> element that can be used as
//    an unbounded canvas that can be panned and zoomed.
//
// FIXME: Ctrl+Click on card moves it in reverse
//
// TODO: Add pan and zoom distance limiting
// TODO: Zoom to mouse cursor position
// TODO: Fit children to viewbox (svg.getBBox)

function SvgCanvas(props) {

  // Save a reference to the <svg> element for use later
  //    to map screen coordinates to SVG space coordinates:
  const [ svg, setSvg ] = useState(null);
  useEffect(() => {
    const svg = document.querySelector(`svg.${props.className}`);
    setSvg(svg);

    // document.addEventListener("mousemove", onMouseMove);

    document.addEventListener("keydown", (event) => {
      svg.style.cursor = (event.keyCode === KEY_CTRL ? "move" : "default");
    });

    document.addEventListener("keyup", (event) => {
      svg.style.cursor = (event.keyCode === KEY_CTRL ? "default" : "move");
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize the canvas SVG viewbox origin and dimensions:
  //    The origin refers to the center of the viewbox
  //    and is translated later when actually setting its position.
  const [ canvasState, setCanvasState ] = useState({
    x: props.x || 0,
    y: props.y || 0,
    w: props.viewBoxSize || VIEWBOX_SIZE,
    h: props.viewBoxSize || VIEWBOX_SIZE,
  });
  const updateCanvasState = useCallback((data) => {
    if (typeof data === "object") {
      setCanvasState((prevState) => ({
        ...prevState,
        ...data
      }));
    }
  }, []);

  // clickState saves information at the time of a mouse click
  //    to use while moving stuff:
  const [ clickState, setClickState ] = useState(null);

  // setOnMouseDown is called to save the mouse and an element's
  //    position at the time of a click.  Then when the mouse is moved,
  //    its position is updated with the mouse movement relative to
  //    the original click position.  This is called by the children too.

  function setOnMouseDown(event, object) {
    event.preventDefault();
    event.stopPropagation();
    setClickState({
      mouse:  ui.elementPoint(svg, event),
      object: (object.id ? { id: object.id, ...props.cards[object.id] } : object)
    });
  }

  // Canvas mouse event handlers

  function onMouseDown(event) {
    if (event.ctrlKey) {
      setOnMouseDown(event, canvasState);
    }
  }

  function onMouseUp(_event) {
    setClickState(null);
  }

  function onMouseMove(event) {
    // console.log(event.target)
    // console.log(event.clientX, event.clientY)

    // Only move stuff if the left mouse button is being held:
    if (event.buttons === LEFT_BUTTON && clickState) {
      const prevPos  = ui.screenToSvg(svg, clickState.mouse);
      const mousePos = ui.screenToSvg(svg, ui.elementPoint(svg, event));
      const mouseDelta = {
        x: mousePos.x - prevPos.x,
        y: mousePos.y - prevPos.y
      }
      // Moving an element on the canvas:
      if (!event.ctrlKey && clickState.object.id) {
        props.setCardNotify(clickState.object.id, {
          x:  clickState.object.x + mouseDelta.x,
          y:  clickState.object.y + mouseDelta.y
        });
      // Panning the canvas:
      } else if (event.ctrlKey) {
        updateCanvasState({
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
    updateCanvasState({
      w: canvasState.w * scaleFactor,
      h: canvasState.h * scaleFactor
    });
  }

  // Canvas keyboard event handlers

  // Showing the move cursor when Ctrl is held
  //    is handled by document mouse events.

  // function onKeyDown(event) {
  // }

  // function onKeyUp(event) {
  // }



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
      // onKeyDown={onKeyDown}
      // onKeyUp={onKeyUp}
    >
      <ellipse cx={0} cy={0} rx={30} ry={20}></ellipse>
      {Object.keys(props.cards).map((id, index) =>
        <Card
          key={index}
          card={props.cards[id]}
          setOnMouseDown={(event) => setOnMouseDown(event, { id })}
          title={props.cards[id].fields && props.cards[id].fields.title}
          content={props.cards[id].fields && props.cards[id].fields.content}
        />
      )}
    </svg>
  );
}

export default SvgCanvas;
