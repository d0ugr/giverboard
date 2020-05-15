import React from "react";

import "./ParticipantListItem.scss";



function ParticipantListItem(props) {

  return (
    <li className={props.className}>
      {props.currentTurn ? "> " : ""}{props.name}
    </li>
  );

}

export default ParticipantListItem;
