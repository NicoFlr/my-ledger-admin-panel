import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { hideSnackbar } from '../../redux/snackbarSlice';

const SnackbarMessage = () => {
  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.snackbar);

  const handleClose = () => {
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={10000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        zIndex: 2000
      }}
    >
      <Box
        sx={{
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
        }}
      >
      <Alert onClose={handleClose} severity={snackbar.severity} variant={snackbar.variant}>
        {snackbar.message}
      </Alert>
      </Box>
    </Snackbar>
  );
};

export default SnackbarMessage;