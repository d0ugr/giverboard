import React, { useState, Fragment } from "react";
import Popover from "@material-ui/core/Popover";
// Icons
import PersonIcon from "@material-ui/icons/Person";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import LockOpenIcon from "@material-ui/icons/LockOpen";
// Host icons
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/Delete";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
// import NotesIcon from "@material-ui/icons/Notes";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
// List
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import EditName from "./EditName";
import NewSession from "./NewSession";
import HostLogin from "./HostLogin";



function MainMenu(props) {

  const [ editNameOpen, setEditNameOpen ] = useState(false);
  const openEditName  = () => setEditNameOpen(true);
  const closeEditName = () => setEditNameOpen(false);

  const [ newSessionOpen, setNewSessionOpen ] = useState(false);
  const openNewSession  = () => setNewSessionOpen(true);
  const closeNewSession = () => setNewSessionOpen(false);

  const importJiraCsv = (_event) => {
    document.querySelector("#import-jira-csv").click();
  };

  const [ hostLoginOpen, setHostLoginOpen ] = useState(false);
  const openHostLogin  = () => setHostLoginOpen(true);
  const closeHostLogin = () => setHostLoginOpen(false);

  return (
    <Fragment>

      <Popover
        id="app-main-menu"
        anchorEl={props.anchorEl}
        open={props.open}
        onClose={props.close}
        onClick={props.close}
        anchorOrigin={{
          vertical:   "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical:   "top",
          horizontal: "center",
        }}
      >
        <List aria-label="main menu">
          <ListItem button onClick={openEditName}>
            <ListItemIcon><PersonIcon/></ListItemIcon>
            <ListItemText primary="Edit name"/>
          </ListItem>
          <ListItem button onClick={openNewSession}>
            <ListItemIcon><OpenInNewIcon/></ListItemIcon>
            <ListItemText primary="New session"/>
          </ListItem>
          <Divider/>
          <ListItem button onClick={props.showSidebar}>
            <ListItemIcon><AddBoxIcon/></ListItemIcon>
            <ListItemText primary="Add card"/>
          </ListItem>
          <ListItem button onClick={importJiraCsv}>
            <ListItemIcon><AddToPhotosIcon/></ListItemIcon>
            <ListItemText primary="Import Jira CSV file"/>
          </ListItem>
          <ListItem button onClick={props.clearBoard}>
            <ListItemIcon><DeleteIcon/></ListItemIcon>
            <ListItemText primary="Clear board"/>
          </ListItem>
          <Divider/>
          {/* <ListItem button onClick={(_dummyFunction) => true}>
            <ListItemIcon><NotesIcon/></ListItemIcon>
            <ListItemText primary="Edit notes"/>
          </ListItem>
          <Divider/> */}
          {props.showHostControls &&
            <ListItem button onClick={!props.sessionStarted ? props.startSession : props.stopSession}>
              <ListItemIcon>{!props.sessionStarted ? <PlayArrowIcon/> : <StopIcon/>}</ListItemIcon>
              <ListItemText primary={!props.sessionStarted ? "Start session" : "Stop session"}/>
            </ListItem>}
          <ListItem button onClick={!props.showHostControls ? openHostLogin : props.hostLogout}>
            <ListItemIcon><LockOpenIcon/></ListItemIcon>
            <ListItemText primary={!props.showHostControls ? "Enter host password" : "Host logout"}/>
          </ListItem>
        </List>
      </Popover>

      <EditName
        editNameOpen={editNameOpen}
        closeEditName={closeEditName}
        participantNamePlaceholder={props.participantNamePlaceholder}
        currentParticipantName={props.currentParticipantName}
        setParticipantName={props.setParticipantName}
      />

      <NewSession
        newSessionOpen={newSessionOpen}
        closeNewSession={closeNewSession}
        newSession={props.newSession}
      />

      <HostLogin
        hostLoginOpen={hostLoginOpen}
        closeHostLogin={closeHostLogin}
        hostLogin={props.hostLogin}
      />

    </Fragment>
  );

}

export default MainMenu;
