import React from "react";



function Header(props) {

  return (
    <header className="App-header">
      <strong>WB2020</strong>&nbsp;&bull;&nbsp;{props.sessionName}
    </header>
  );

}

export default Header;
