import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

// import "./SizingCard.scss";

const useStyles = makeStyles({
  root: {
    width:           "75px",
    height:          "50px",
    cursor:          "move",
    overflow:        "visible",
  },
  card: {
    height:          "100%",
    // border:          ".5px solid white",
    boxShadow:       "0 1px 1px rgba(0, 0, 0, .2), 0 -1px 1px rgba(0, 0, 0, .2), 1px 0 1px rgba(0, 0, 0, .2), -1px 0 1px rgba(0, 0, 0, .2)",
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
    backgroundColor: "olive",
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

// const CARD_WIDTH  = 75;
// const CARD_HEIGHT = 50;



function SizingCard(props) {

  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    // foreignObject cannot be styled much,
    //    so a container div is necessary:
    <foreignObject
      className={classes.root}
      x={props.card.x || 0}
      y={props.card.y || 0}
      // width={props.card.w || CARD_WIDTH}
      // height={props.card.h || CARD_HEIGHT}
      onMouseDown={props.setClickObject}
    >
      <Card className={classes.card}>
        <CardContent className={classNames(classes.cardContent, classes[props.card.content.category])}>
          <Typography className={classes.title}>
            {props.card.content.title}
          </Typography>
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
