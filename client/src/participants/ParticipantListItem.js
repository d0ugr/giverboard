import React from "react";

import "./ParticipantListItem.scss";



function ParticipantListItem(props) {

  return (
    <li className={props.className}>
      {props.name}
    </li>
  );

}

export default ParticipantListItem;
