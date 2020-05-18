import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
// import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
// import SkipNextIcon from '@material-ui/icons/SkipNext';

import "./SessionStatus.scss";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    backgroundColor: "rgba(128, 128, 128, .5)",
  },
}));



function SessionStatus(props) {

  const classes = useStyles();

  let status = "";
  if (!props.sessionStart) {
    status = ""; //"Session not started"
  } else if (props.sessionStart && props.sessionStop) {
    status = "Session closed";
  } else if (props.participants) {
    const participantKeys = Object.keys(props.participants);
    const currentParticipant = participantKeys[props.currentTurn];
    const nextTurn = props.currentTurn + 1;
    const nextParticipant = participantKeys[(nextTurn < participantKeys.length ? nextTurn : 0)];
    status =
      <Fragment>
        <div className="current turn">{currentParticipant && props.participants[currentParticipant].name}</div>
        <div className="next turn">{nextParticipant && props.participants[nextParticipant].name}</div><br/>
        {/* <div className="next turn">{nextParticipant && ` -> ${props.participants[nextParticipant].name}`}</div> */}
        {props.showHostControls &&
          <Fragment>
            <Button
              className={classes.button}
              variant="contained"
              size="small"
              color="primary"
              // startIcon={<SkipPreviousIcon/>}
              onClick={(_event) => props.setTurn(-1)}
            >
              Previous turn
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              size="small"
              color="secondary"
              onClick={props.stopSession}
            >
              Stop session
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              size="small"
              color="primary"
              // endIcon={<SkipNextIcon/>}
              onClick={(_event) => props.setTurn(1)}
            >
              Next turn
            </Button>
          </Fragment>
        }
      </Fragment>
    ;
  };

  return (
    <div className="session-status">
      {status}
    </div>
  );

}

export default SessionStatus;
