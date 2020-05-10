import React, { useState, useCallback, useEffect } from "react";



function Card(props) {

  const [ svg, setSvg ] = useState(null);
  useEffect(() => {
    setSvg(document.querySelector("svg.whiteboard"));
  }, []);

  const [ cardState, setCardState ] = useState({ ...props });

  const updateCardState = useCallback((data) => {
    if (typeof data === "object") {
      setCardState({
        ...cardState,
        ...data
      });
    }
  }, [ cardState ]);



  function onMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    cardState.setOnMouseDown(svg, event, cardState, updateCardState);
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
    //   onMouseUp={onMouseUp}
    //   onMouseMove={onMouseMove}
    // >
    //   <div>yo yo yo</div>
    // </foreignObject>
  );

}

export default Card;
