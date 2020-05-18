import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
// import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";



const drawerWidth = "20%";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  addCard: {
    margin:  theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: "khaki",
  },
  // content: {
  //   flexGrow: 1,
  //   padding: theme.spacing(3),
  //   transition: theme.transitions.create("margin", {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen,
  //   }),
  //   marginLeft: -drawerWidth,
  // },
  // contentShift: {
  //   transition: theme.transitions.create("margin", {
  //     easing: theme.transitions.easing.easeOut,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  //   marginLeft: 0,
  // },
}));



function Sidebar(props) {

  const theme   = useTheme();
  const classes = useStyles();

  const [ cardTitle, setCardTitle ] = useState("");
  const [ cardBody,  setCardBody  ] = useState("");

  const addCard = () => {
    props.addCard({
      category: "",
      title:    cardTitle,
      body:     cardBody
    });
  };

  return (
    <div className={classes.root}>
      <CssBaseline/>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={props.sidebarOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={props.closeSidebar}>
            {theme.direction === "ltr" ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
          </IconButton>
        </div>
        <Divider/>

        <Card className={classes.addCard}>
          <TextField
            autoFocus
            margin="dense"
            id="card-title"
            label="Card title"
            type="text"
            value={cardTitle}
            onChange={(event) => setCardTitle(event.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            id="card-content"
            label="Card content"
            type="text"
            multiline
            rows={10}
            value={cardBody}
            onChange={(event) => setCardBody(event.target.value)}
            fullWidth
          />
          <div style={{ display: "flex", justifyContent: "right" }}>
            <Button
              color="primary"
              disabled={cardTitle.trim() && cardBody.trim() ? false : true}
              onClick={addCard}
            >
              Add card
            </Button>
          </div>
        </Card>

      </Drawer>
    </div>
  );

}

export default Sidebar;
