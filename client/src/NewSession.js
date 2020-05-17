import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";



function NewSession(props) {

  const [ name, setName ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ verifyPassword, setVerifyPassword ] = useState("");

  const validateInput = (_event) => {
    if (!name.trim()) {
      return;
    } else if (password !== verifyPassword) {
      return;
    } else {
      props.newSession(name, password);
      props.closeNewSession();
    }
  };

  return (
    <Dialog open={props.newSessionOpen} onClose={props.closeNewSession} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-new-session-dialog-title">New session</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the name for a new session.
          An optional host password allows a participant to
          become a host and start/stop the session, and orchestrate turns.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="session-name"
          label="New session name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          fullWidth
        />
        <TextField
          margin="dense"
          id="host-password"
          label="Host password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          fullWidth
        />
        <TextField
          margin="dense"
          id="verify-host-password"
          label="Verify host password"
          type="verify-password"
          value={verifyPassword}
          onChange={(event) => setVerifyPassword(event.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closeNewSession} color="primary">
          Cancel
        </Button>
        <Button onClick={validateInput} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );

}

export default NewSession;
