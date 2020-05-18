import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import * as c from "./constants";
import MainMenu from "./MainMenu";
import ImportReader from "./ImportReader";



const useStyles = makeStyles((theme) => ({
  appBar: {
    // backgroundColor: "rebeccapurple",
    background: "radial-gradient(circle, rgba(102,51,153,1) 0%, rgba(102,51,153,1) 32%, rgba(68,34,102,1) 100%)",
    textAlign: "center",
    cursor: "pointer",
  },
  title: {
    padding: ".25em",
    flexGrow: 1,
    fontSize: "200%",
    textShadow: "2px 2px 2px black, 2px 2px 2px black",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
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

  const classes = useStyles();

  const [ menuAnchorEl, setMenuAnchorEl ] = React.useState(null);
  const openMenu  = (event) => setMenuAnchorEl(event.currentTarget);
  const closeMenu = () => setMenuAnchorEl(null);
  const menuOpen  = Boolean(menuAnchorEl);

  return (
    <Fragment>

      <AppBar
        className={classes.appBar}
        position="static"
        aria-owns={menuOpen ? "app-toolbar" : undefined}
        aria-haspopup="true"
        onClick={openMenu}
        // onMouseEnter={openMenu}
        // onMouseLeave={closeMenu}
        aria-describedby={"app-toolbar"}
      >
        <Typography variant="h6" className={classes.title}>
          {c.APP_NAME}&nbsp;&bull;&nbsp;
          <span className={classes.sessionName}>{props.participantName}{props.showHostControls && " (Host)"}</span>
          {props.sessionName
            ? <Fragment><span className={classes.sessionName}> @ {props.sessionName}</span></Fragment>
            : ""}
          {props.connected
            ? ""
            : <Fragment>&nbsp;&bull;&nbsp;<span className={classes.disconnected}>Disconnected</span></Fragment>}
        </Typography>
      </AppBar>

      <MainMenu
        anchorEl={menuAnchorEl}
        close={closeMenu}
        open={menuOpen}

        currentParticipantName={props.currentParticipantName}
        participantNamePlaceholder={props.participantNamePlaceholder}
        setParticipantName={props.setParticipantName}

        newSession={props.newSession}

        showSidebar={props.showSidebar}
        clearBoard={props.clearBoard}

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
