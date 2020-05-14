import React from "react";

import "./ParticipantList.scss";

import ParticipantListItem from "./ParticipantListItem";



function ParticipantList(props) {

  return (
    <ul className="participant-list">
      {Object.keys(props.participants).map((key, index) =>
        <ParticipantListItem
          key={index}
          className={key === props.clientId ? "highlight" : null}
          name={props.participants[key].name}
          // name={`${props.participants[key].name}${key === props.clientId ? " (You)" : ""}`}
        />
      )}
    </ul>
  );

}

export default ParticipantList;
