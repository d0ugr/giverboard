import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";



function NewSession(props) {

  const [ name,           setName           ] = useState("");
  const [ password,       setPassword       ] = useState("");
  const [ verifyPassword, setVerifyPassword ] = useState("");

  const newSession = (event) => {
    event.preventDefault();
    props.newSession(name, password);
    closeNewSession();
  };

  const closeNewSession = () => {
    setPassword("");
    setVerifyPassword("");
    props.closeNewSession();
  }

  return (
    <Dialog fullWidth open={props.newSessionOpen} onClose={closeNewSession} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-new-session-dialog-title">New session</DialogTitle>
      <form onSubmit={newSession}>
        <DialogContent>
          <DialogContentText>
            Enter the name for a new session.
            An optional host password allows a participant to
            become a host and start/stop the session, and orchestrate turns.
          </DialogContentText>
          <TextField
            fullWidth
            margin="dense"
            id="session-name"
            label="New session name"
            type="text"
            value={name}
            autoFocus
            onFocus={(event) => event.target.select()}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            id="host-password"
            label="Host password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            id="verify-host-password"
            label="Verify host password"
            type="password"
            value={verifyPassword}
            onChange={(event) => setVerifyPassword(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewSession} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={
              !name.trim() ||
              !(!password.trim() || (password === verifyPassword))}
            onClick={newSession}
          >
            OK
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );

}

export default NewSession;
