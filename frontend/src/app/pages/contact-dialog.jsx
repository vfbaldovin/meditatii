import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {CalendarEventDialog} from "../../sections/dashboard/calendar/calendar-event-dialog";

const ContactDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Contact Us</DialogTitle>
      <DialogContent>
        <CalendarEventDialog></CalendarEventDialog>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
        />
        {/* Add more input fields as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Send</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactDialog;
