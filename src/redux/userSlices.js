import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      return { ...state, user: action.payload };
    },
    logoutUser: (state, action) => {
      return initialState;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
