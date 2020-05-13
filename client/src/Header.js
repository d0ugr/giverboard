import React, { Fragment } from "react";

import "./Header.scss";



function Header(props) {

  return (
    <header className="app-header">
      <strong>WB2020</strong>
      {props.sessionName
        ? <Fragment>&nbsp;&bull;&nbsp;{props.sessionName}</Fragment>
        : ""}
      {props.connected
        ? ""
        : <Fragment>&nbsp;&bull;&nbsp;<span className="connection-status">Disconnected</span></Fragment>}
    </header>
  );

}

export default Header;
