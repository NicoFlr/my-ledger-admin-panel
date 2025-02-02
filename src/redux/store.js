import { configureStore } from '@reduxjs/toolkit';
import userSlices from './userSlices';
import snackbarSlice from './snackbarSlice';
import roleSlices from './roleSlices';

const store = configureStore({
  reducer: {
    user: userSlices,
    roles: roleSlices,
    snackbar: snackbarSlice
  },
});

export default store;
