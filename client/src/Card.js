import React, { useState, useCallback, useEffect } from "react";



function Card(props) {

  const [ svg, setSvg ] = useState(null);
  useEffect(() => {
    setSvg(document.querySelector("svg.whiteboard"));
  }, []);

  const [ cardState, setCardState ] = useState({ ...props });
  const updateCardState = useCallback((data) => {
    if (typeof data === "object") {
      setCardState((prevState) => ({
        ...prevState,
        ...data
      }));
    }
  }, []);



  function onMouseDown(event) {
    // Set the mouse click state in the canvas
    //    so it can handle moving the card:
    if (cardState.setOnMouseDown) {
      cardState.setOnMouseDown(svg, event, cardState, updateCardState);
    }
  }



  return (
    <rect
      x={cardState.x}
      y={cardState.y}
      width={cardState.w}
      height={cardState.h}
      onMouseDown={onMouseDown}
    ></rect>

    // <foreignObject
    //   x={cardState.x}
    //   y={cardState.y}
    //   width={cardState.w}
    //   height={cardState.h}
    //   onMouseDown={onMouseDown}
    // >
    //   <div>yo yo yo</div>
    // </foreignObject>
  );

}

export default Card;
