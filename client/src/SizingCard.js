import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
// import CardActions from "@material-ui/core/CardActions";
// import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

import * as c from "./constants";



const useStyles = makeStyles({
  root: {
    width:           `${c.CARD_WIDTH}px`,
    height:          `${c.CARD_HEIGHT}px`,
    overflow:        "visible",
  },
  card: {
    height:          "100%",
    // border:          ".5px solid white",
    boxShadow:       "0 1px 1px rgba(0, 0, 0, .2), 0 -1px 1px rgba(0, 0, 0, .2), 1px 0 1px rgba(0, 0, 0, .2), -1px 0 1px rgba(0, 0, 0, .2)",
  },
  // toolbar: {
  //   margin: 0,
  //   padding: 0,
  // },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    maxWidth: "10px",
    maxHeight: "10px",
  },
  cardContent: {
    height:          "100%",
    padding:         "0",
    backgroundColor: "khaki",
  },
  story: {
    backgroundColor: "lightskyblue",
  },
  task: {
    backgroundColor: "lightgreen",
  },
  bug: {
    backgroundColor: "lightsalmon",
  },
  title: {
    // borderBottom:    "1px solid black",
    boxShadow:       "0 .5px .5px olive",
    padding:         ".25em .5em",
    backgroundColor: "rebeccapurple",
    color:           "ghostwhite",
    fontSize:        "40%",
    fontWeight:      "bold",
    textShadow:      ".1em .1em .1em black",
    whiteSpace:      "nowrap",
    overflow:        "hidden",
    textOverflow:    "ellipsis",
  },
  body: {
    padding:         ".25em .5em",
    fontSize:        "30%",
  },

});



function SizingCard(props) {

  const classes = useStyles();
  // const bull = <span className={classes.bullet}>•</span>;

  return (
    // foreignObject cannot be styled much,
    //    so a container div is necessary:
    <foreignObject
      className={classes.root}
      style={{
        cursor:        (props.cardMoveAllowed ? "move" : "default"),
        // pointerEvents: (props.cardMoveAllowed ? "auto" : "none")
      }}
      x={props.card.position.x || 0}
      y={props.card.position.y || 0}
      // width={props.card.w || CARD_WIDTH}
      // height={props.card.h || CARD_HEIGHT}
      onMouseDown={props.setClickObject}
    >
      <Card className={classes.card}>
        <CardContent className={classNames(classes.cardContent, classes[props.card.content.category])}>
          {/* <Toolbar disableGutters> */}
            <Typography className={classes.title}>
              {props.card.content.title}
            </Typography>
            <IconButton
              className={classes.closeButton}
              color="inherit"
              aria-label="close"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={props.removeCardNotify}
            >
              <CloseIcon
                className={classes.closeButton}
              />
            </IconButton>
          {/* </Toolbar> */}
          <Typography className={classes.body}>
            {/* be{bull}nev{bull}o{bull}lent */}
            {props.card.content.body}
          </Typography>
        </CardContent>
        {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
      </Card>

      {/* <div className={props.card.content.category}>
        <header>
          <strong>{props.card.content.title}</strong>
        </header>
        <article>
          <span>{props.card.content.body}</span>
        </article>
      </div> */}
    </foreignObject>
  );

}

export default SizingCard;
