import React, { Fragment } from "react";

import * as c from "./constants";

import "./Header.scss";



function Header(props) {

  return (
    <header className="app-header">
      <strong>{c.APP_NAME}</strong>
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
