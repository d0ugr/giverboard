import React from "react";

import "./Header.scss";



function Header(props) {

  return (
    <header className="app-header">
      <strong>WB2020</strong>&nbsp;&bull;&nbsp;{props.sessionName}
    </header>
  );

}

export default Header;
