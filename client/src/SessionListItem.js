import React from "react";

import "./SessionListItem.scss";



function SessionListItem(props) {

  return (
    <li
      className="session-list-item"
      onClick={props.onClick}
    >
      {props.sessionName}
    </li>
  );

}

export default SessionListItem;
