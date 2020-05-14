import React from "react";

import "./SessionList.scss";

import SessionListItem from "./SessionListItem";



function SessionList(props) {

  return (
    <ul className="session-list">
      {props.sessionList.map((session, index) =>
        <SessionListItem
          key={index}
          sessionName={session.name}
          onClick={(_event) => props.joinSession(session.id)}
        />
      )}
    </ul>
  );

}

export default SessionList;
