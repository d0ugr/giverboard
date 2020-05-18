import React, { useState, useEffect } from "react";

import * as c from "./constants";
import * as ui from "./lib/ui";

import SizingCard from "./SizingCard";



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

    // // Show the move mouse cursor while holding Ctrl:
    // document.addEventListener("keydown", (event) => {
    //   svg.style.cursor = (event.keyCode === c.KEY_CTRL ? "move" : "default");
    // });
    // document.addEventListener("keyup", (event) => {
    //   svg.style.cursor = (event.keyCode === c.KEY_CTRL ? "default" : "move");
    // });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canvasState = props.canvasState;
  const updateCanvasState = (data) => {
    if (typeof data === "object") {
      props.updateCanvasState({
        viewBox: {
          ...canvasState,
          ...data
        }
      });
    }
  };

  // clickState saves information at the time of a mouse click
  //    to use while moving stuff:
  const [ clickState, setClickState ] = useState(null);

  // setClickObject is called to save the mouse and an element's
  //    position at the time of a click.  Then when the mouse is moved,
  //    its position is updated with the mouse movement relative to
  //    the original click position.  This is called by the children too.

  function setClickObject(event, object) {
    event.preventDefault();
    event.stopPropagation();
    if (!object.cardKey || props.cardMoveAllowed) {
      setClickState({
        mouse: ui.elementPoint(svg, event),
        object
        // // Ctrl overrides any object that was clicked and pans the canvas:
        // object: (event.ctrlKey ? canvasState : object)
      });
    }
  }

  // Canvas mouse event handlers

  function onMouseDown(event) {
    // if (event.ctrlKey) {
      setClickObject(event, canvasState);
    // }
  }

  function onMouseUp(_event) {
    if (clickState && clickState.object.cardKey) {
      props.saveCardNotify(clickState.object.cardKey);
    }
    setClickState(null);
  }

  function onMouseMove(event) {
    // console.log(event.target)
    // console.log(event.clientX, event.clientY)
    // const mousePos = ui.screenToSvg(svg, ui.elementPoint(svg, event));
    // const mousePos = ui.screenToSvg(svg, { x: event.clientX, y: event.clientY });
    // console.log(mousePos)

    // Only move stuff if the left mouse button is being held
    //    and something that can be moved was clicked:
    if (event.buttons === c.LEFT_BUTTON && clickState) {
      const prevPos  = ui.screenToSvg(svg, clickState.mouse);
      const mousePos = ui.screenToSvg(svg, ui.elementPoint(svg, event));
      const mouseDelta = {
        x: mousePos.x - prevPos.x,
        y: mousePos.y - prevPos.y
      }
      // Moving an element on the canvas:
      // if (!event.ctrlKey && clickState.object.id) {
      if (clickState.object.cardKey) {
        props.setCardNotify(clickState.object.cardKey, {
          position: {
            x: clickState.object.position.x + mouseDelta.x,
            y: clickState.object.position.y + mouseDelta.y
          }
        });
      // Panning the canvas:
      } else {
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
    // const mousePos = ui.screenToSvg(svg, { x: event.clientX, y: event.clientY });
    // mousePos.x -= canvasState.x;
    // mousePos.y -= canvasState.y;
    // canvasState.x += mousePos.x * scaleFactor;
    // canvasState.y += mousePos.y * scaleFactor;
    // console.log(mousePos)
    updateCanvasState({
      // x: canvasState.x,
      // y: canvasState.y,
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
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
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
      {/* <image
        xlinkHref="./assets/images/rooster.png"
        x="-50" y="-50"
        width="100" height="100"
      /> */}

      {/* <ellipse cx={0} cy={0} rx={30} ry={20}></ellipse> */}

      {Object.keys(props.cards).map((cardKey, index) =>
        <SizingCard
          key={index}
          card={props.cards[cardKey]}
          setClickObject={(event) => setClickObject(event, props.cards[cardKey])}
          removeCardNotify={(_event) => props.removeCardNotify(cardKey)}
        />
      )}
    </svg>
  );
}

export default SvgCanvas;
