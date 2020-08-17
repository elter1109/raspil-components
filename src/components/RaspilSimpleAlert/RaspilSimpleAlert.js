import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function RaspilSimpleAlert({ text, error, history, redirectToOrders }) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    if (redirectToOrders) {
      history.push('/');
    }
  };

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{text}</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Понятно
        </Button>
      </DialogActions>
    </Dialog>
  );
}
