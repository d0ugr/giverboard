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
import NotesIcon from "@material-ui/icons/Notes";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
// List
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import EditName from "./EditName";
import HostLogin from "./HostLogin";



function MainMenu(props) {

  const [ hostLoginOpen, setHostLoginOpen ] = useState(false);
  const openHostLogin  = () => {
    if (!props.showHostControls) {
      setHostLoginOpen(true);
    } else {
      props.hostLogout();
    }
  };
  const closeHostLogin = () => setHostLoginOpen(false);

  const [ editNameOpen, setEditNameOpen ] = useState(false);
  const openEditName  = () => setEditNameOpen(true);
  const closeEditName = () => setEditNameOpen(false);

  const importJiraCsv = (_event) => {
    document.querySelector("#import-jira-csv").click();
  };

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
          <ListItem button onClick={props.onMenuItemClick}>
            <ListItemIcon><OpenInNewIcon/></ListItemIcon>
            <ListItemText primary="New session"/>
          </ListItem>
          <ListItem button onClick={props.onMenuItemClick}>
            <ListItemIcon><AddBoxIcon/></ListItemIcon>
            <ListItemText primary="Add card"/>
          </ListItem>
          <ListItem button onClick={props.clearBoard}>
            <ListItemIcon><DeleteIcon/></ListItemIcon>
            <ListItemText primary="Clear board"/>
          </ListItem>
          <ListItem button onClick={importJiraCsv}>
            <ListItemIcon><AddToPhotosIcon/></ListItemIcon>
            <ListItemText primary="Import Jira CSV file"/>
          </ListItem>
          <ListItem button onClick={openHostLogin}>
            <ListItemIcon><LockOpenIcon/></ListItemIcon>
            <ListItemText primary={!props.showHostControls ? "Enter host password" : "Host logout"}/>
          </ListItem>
          <Divider/>
          <ListItem button onClick={props.onMenuItemClick}>
            <ListItemIcon><NotesIcon/></ListItemIcon>
            <ListItemText primary="Edit notes"/>
          </ListItem>
          <Divider/>
          <ListItem button onClick={!props.sessionStarted ? props.startSession : props.stopSession}>
            <ListItemIcon>{!props.sessionStarted ? <PlayArrowIcon/> : <StopIcon/>}</ListItemIcon>
            <ListItemText primary={!props.sessionStarted ? "Start session" : "Stop session"}/>
          </ListItem>
        </List>
      </Popover>

      <HostLogin
        hostLoginOpen={hostLoginOpen}
        closeHostLogin={closeHostLogin}
        hostLogin={props.hostLogin}
      />

      <EditName
        editNameOpen={editNameOpen}
        closeEditName={closeEditName}
        participantNamePlaceholder={props.participantNamePlaceholder}
        currentParticipantName={props.currentParticipantName}
        setParticipantName={props.setParticipantName}
      />

    </Fragment>
  );

}

export default MainMenu;
