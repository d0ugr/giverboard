import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";



function EditName(props) {

  const [ name, setName ] = useState(props.currentParticipantName);

  const setParticipantName = () => {
    props.setParticipantName(name)
    props.closeEditName();
  };

  const closeEditName = () => {
    setName(props.currentParticipantName);
    props.closeEditName();
  }

  return (
    <Dialog open={props.editNameOpen} onClose={closeEditName} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-edit-participant-name-dialog-title">Enter your name</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter your name.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="participant-name"
          label="Your name"
          type="text"
          placeholder={props.participantNamePlaceholder}
          value={name}
          onChange={(event) => setName(event.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeEditName} color="primary">
          Cancel
        </Button>
        <Button onClick={setParticipantName} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );

}

export default EditName;
