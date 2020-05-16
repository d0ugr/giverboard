import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
// Icons
import PersonIcon from "@material-ui/icons/Person";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import LockOpenIcon from '@material-ui/icons/LockOpen';
// Host icons
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from '@material-ui/icons/Delete';
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import NotesIcon from "@material-ui/icons/Notes";
// List
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import * as c from "./constants";



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
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };
  const menuOpen = Boolean(anchorEl);

  const onButtonClick = (event) => {
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

      <Popover
        id="app-main-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={closeMenu}
        onClick={closeMenu}
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
          <ListItem button onClick={onButtonClick}>
            <ListItemIcon><PersonIcon/></ListItemIcon>
            <ListItemText primary="Edit name"/>
          </ListItem>
          <ListItem button onClick={onButtonClick}>
            <ListItemIcon><OpenInNewIcon/></ListItemIcon>
            <ListItemText primary="New session"/>
          </ListItem>
          <ListItem button onClick={onButtonClick}>
            <ListItemIcon><LockOpenIcon/></ListItemIcon>
            <ListItemText primary="Enter host password"/>
          </ListItem>
          <Divider/>
          <ListItem button onClick={onButtonClick}>
            <ListItemIcon><AddBoxIcon/></ListItemIcon>
            <ListItemText primary="Add card"/>
          </ListItem>
          <ListItem button onClick={onButtonClick}>
            <ListItemIcon><AddToPhotosIcon/></ListItemIcon>
            <ListItemText primary="Import Jira CSV"/>
          </ListItem>
          <ListItem button onClick={onButtonClick}>
            <ListItemIcon><DeleteIcon/></ListItemIcon>
            <ListItemText primary="Clear board"/>
          </ListItem>
          <ListItem button onClick={onButtonClick}>
            <ListItemIcon><NotesIcon/></ListItemIcon>
            <ListItemText primary="Edit notes"/>
          </ListItem>
        </List>
      </Popover>
    </Fragment>
  );

}

export default AppHeader;
