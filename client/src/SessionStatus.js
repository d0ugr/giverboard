import React, { Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import "./SessionStatus.scss";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    backgroundColor: "rgba(1, 1, 1, .5)",
  },
}));



function SessionStatus(props) {

  const classes = useStyles();

  let status = "";
  if (!props.sessionStart) {
    status = "Session not started"
  } else if (props.sessionStart && props.sessionStop) {
    status = "Session stopped"
  } else if (props.participants) {
    const participantKeys = Object.keys(props.participants);
    const currentParticipant = participantKeys[props.currentTurn];
    const nextTurn = props.currentTurn + 1;
    const nextParticipant = participantKeys[(nextTurn < participantKeys.length ? nextTurn : 0)];
    status =
      <Fragment>
        <div className="current turn">{currentParticipant && props.participants[currentParticipant].name}</div>
        {/* <div className="next turn">{nextParticipant && ` -> ${props.participants[nextParticipant].name}`}</div> */}
        <div className="next turn">{nextParticipant && props.participants[nextParticipant].name}</div><br/>
        {props.showHostControls &&
        <Fragment>
          <Button
            className={classes.button}
            variant="outlined"
            size="small"
            startIcon={<ChevronLeftIcon/>}
            color="primary"
            onClick={(_event) => props.setTurn(-1)}
          >
            Previous turn
          </Button>
          <Button
            className={classes.button}
            variant="outlined"
            size="small"
            endIcon={<ChevronRightIcon/>}
            color="primary"
            onClick={(_event) => props.setTurn(1)}
          >
            Next turn
          </Button>
        </Fragment>}
      </Fragment>
    };

  return (
    <div className="session-status">
      {status}
    </div>
  );

}

export default SessionStatus;
