import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import * as c from "./constants";
import MainMenu from "./MainMenu";
import ImportReader from "./ImportReader";



const useAppBarStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "rebeccapurple",
    textAlign: "center",
    cursor: "pointer",
  },
  title: {
    flexGrow: 1,
    fontSize: "150%",
    textShadow: "2px 2px 2px black, 2px 2px 2px black",
  },
  sessionName: {
    color: "lightgoldenrodyellow",
    fontWeight: "bold",
  },
  disconnected: {
    color: "lightcoral",
  },
}));



function AppHeader(props) {

  const appBarClasses = useAppBarStyles();

  const [ menuAnchorEl, setMenuAnchorEl ] = React.useState(null);
  const openMenu  = (event) => setMenuAnchorEl(event.currentTarget);
  const closeMenu = () => setMenuAnchorEl(null);
  const menuOpen  = Boolean(menuAnchorEl);
  const onMenuItemClick = (event) => {
    console.log(event.target);
  };

  return (
    <Fragment>

      <AppBar
        className={appBarClasses.appBar}
        position="static"
        aria-owns={menuOpen ? "app-toolbar" : undefined}
        aria-haspopup="true"
        onClick={openMenu}
        // onMouseEnter={openMenu}
        // onMouseLeave={closeMenu}
        aria-describedby={"app-toolbar"}
      >
        <Typography variant="h6" className={appBarClasses.title}>
          {c.APP_NAME}
          {props.sessionName
            ? <Fragment>&nbsp;&bull;&nbsp;<span className={appBarClasses.sessionName}>{props.sessionName}</span></Fragment>
            : ""}
          {props.connected
            ? ""
            : <Fragment>&nbsp;&bull;&nbsp;<span className={appBarClasses.disconnected}>Disconnected</span></Fragment>}
        </Typography>
      </AppBar>

      <MainMenu
        anchorEl={menuAnchorEl}
        close={closeMenu}
        open={menuOpen}
        onMenuItemClick={onMenuItemClick}

        currentParticipantName={props.currentParticipantName}
        participantNamePlaceholder={props.participantNamePlaceholder}
        setParticipantName={props.setParticipantName}

        showHostControls={props.showHostControls}
        hostLogin={props.hostLogin}
        hostLogout={props.hostLogout}

        sessionStarted={props.sessionStarted}
        startSession={props.startSession}
        stopSession={props.stopSession}
      />

      <ImportReader
        id="import-jira-csv"
        skipHeader={true}
        onFileLoaded={(_fileInfo, csvData) => props.addJiraCards(csvData)}
        onError={() => alert("Error")}
      />

    </Fragment>
  );

}

export default AppHeader;
