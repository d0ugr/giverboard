import React from "react";

import "./Card.scss";

// const CARD_WIDTH  = 75;
// const CARD_HEIGHT = 50;



function Card(props) {

  return (
    // foreignObject can't be styled much,
    //    so a container div is necessary:
    <foreignObject
      x={props.card.x || 0}
      y={props.card.y || 0}
      // width={props.card.w || CARD_WIDTH}
      // height={props.card.h || CARD_HEIGHT}
      onMouseDown={props.setClickObject}
    >
      <div className={props.card.content.category}>
        <header>
          <strong>{props.card.content.title}</strong>
        </header>
        <article>
          <span>{props.card.content.body}</span>
        </article>
      </div>
    </foreignObject>
  );

}

export default Card;
