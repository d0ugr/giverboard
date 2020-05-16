import React, { Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import * as c from "./constants";



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "rebeccapurple",
    textAlign: "center",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontSize: "150%",
    textShadow: "2px 2px 2px black, 2px 2px 2px black",
  },
  sessionName: {
    color: "lightgoldenrodyellow",
  },
  disconnected: {
    color: "lightcoral",
  },
}));



function AppHeader(props) {

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      className={classes.appBar}
      position="static"
    >
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={onClick}
        >
          <MenuIcon/>
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={onClose}
        >
          <MenuItem onClick={onClose}>Profile</MenuItem>
          <MenuItem onClick={onClose}>My account</MenuItem>
          <MenuItem onClick={onClose}>Logout</MenuItem>
        </Menu>
        <Typography variant="h6" className={classes.title}>
          {c.APP_NAME}
          {props.sessionName
            ? <Fragment>&nbsp;&bull;&nbsp;<span className={classes.sessionName}><strong>{props.sessionName}</strong></span></Fragment>
            : ""}
          {props.connected
            ? ""
            : <Fragment>&nbsp;&bull;&nbsp;<span className={classes.disconnected}>Disconnected</span></Fragment>}
        </Typography>
        <IconButton
          edge="end"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={onClick}
        >
          <MenuIcon/>
        </IconButton>
      </Toolbar>
    </AppBar>
  );

}

export default AppHeader;
