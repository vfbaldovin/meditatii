import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const DeleteButtonWithConfirmation = ({ listingId, fetchWithAuth, paths }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    try {
      const response = await fetchWithAuth(`/api/dashboard/listings/delete/${listingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        window.location.href = paths.dashboard.index;
      } else {
        console.error('Failed to delete the listing.');
      }
    } catch (error) {
      console.error('An error occurred while deleting the listing:', error);
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <Button
        color="error"
        variant="outlined"
        onClick={handleOpen}
      >
        Șterge anunț
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Ești sigur că vrei să ștergi anunțul? 😔
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Odată șters, acesta nu mai poate fi recuperat.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between', // Distribute buttons to opposite ends
            width: '100%', // Ensure full width alignment
          }}
        >
          <Button
            onClick={handleClose}
            color="inherit"
            // variant="outlined"
            sx={{ ml: 0 }} // Ensure left alignment
          >
            Înapoi
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="outlined"
            autoFocus
            sx={{ mr: 0 }} // Ensure right alignment
          >
            Șterge anunț
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteButtonWithConfirmation;
