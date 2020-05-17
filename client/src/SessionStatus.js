import React, { Fragment } from "react";

import "./SessionStatus.scss";



function SessionStatus(props) {

  let status = "";
  if (!props.sessionStart) {
    status = "Session not started"
  } else if (props.sessionStart && props.sessionStop) {
    status = "Session stopped"
  } else if (props.participants) {
    const participantKeys = Object.keys(props.participants);
    const currentParticipant = participantKeys[props.currentTurn];
    const nextTurn = props.currentTurn + 1;
    const nextParticipant = participantKeys[(nextTurn < participantKeys.length ? nextTurn : 0)];
    status =
      <Fragment>
        <span className="current-turn">{currentParticipant && props.participants[currentParticipant].name}</span>
        <span className="next-turn">{nextParticipant && ` -> ${props.participants[nextParticipant].name}`}</span>
      </Fragment>;
  }

  return (
    <div className="session-status">
      {status}
    </div>
  );

}

export default SessionStatus;
