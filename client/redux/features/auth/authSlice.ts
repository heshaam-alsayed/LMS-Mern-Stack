import { AuthState } from "@/types/auth.type";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  verificationToken: null,
  loading: true,
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    registerUser: (state, action) => {
      state.verificationToken = action.payload.token;
    },
    logoutUser: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setUser, logoutUser, registerUser } = authSlice.actions;
export default authSlice.reducer;
