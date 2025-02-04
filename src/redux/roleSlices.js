import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userRoles: []
};

const roleSlices = createSlice({
  name: 'Roles',
  initialState,
  reducers: {
    setUserRoles: (state, action) => {
      state.userRoles = action.payload;
    },
  },
});

export const { setUserRoles } = roleSlices.actions;
export default roleSlices.reducer;
