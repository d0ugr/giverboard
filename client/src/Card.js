import React from "react";

const CARD_WIDTH  = 75;
const CARD_HEIGHT = 50;



function Card(props) {

  return (
    // <rect
    //   x={props.card.x || 0}
    //   y={props.card.y || 0}
    //   width={props.card.w || CARD_WIDTH}
    //   height={props.card.h || CARD_HEIGHT}
    //   onMouseDown={props.setOnMouseDown}
    // ></rect>

    // foreignObject can't be styled, so container div is necessary:
    <foreignObject
      x={props.card.x || 0}
      y={props.card.y || 0}
      width={props.card.w || CARD_WIDTH}
      height={props.card.h || CARD_HEIGHT}
      onMouseDown={props.setOnMouseDown}
    >
      <div style={{maxHeight: `${props.card.h || CARD_HEIGHT}px`}}>
        <header>
          <strong>{props.title}</strong>
        </header>
        <article>
          {props.content}
          <p style={{textAlign: "left"}}><strong>MEOW</strong></p>
          <p style={{textAlign: "center"}}><strong>CLUCK</strong></p>
          <p style={{textAlign: "right"}}><strong>MEUCK</strong></p>
        </article>
      </div>
    </foreignObject>
  );

}

export default Card;
