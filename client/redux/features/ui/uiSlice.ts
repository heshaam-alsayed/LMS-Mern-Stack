import { createSlice } from "@reduxjs/toolkit";

type AuthMode = "login" | "signup";

interface UIState {
  isAuthModalOpen: boolean;
  authMode: AuthMode;
}

const initialState: UIState = {
  isAuthModalOpen: false,
  authMode: "login",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openLoginModal(state) {
      state.isAuthModalOpen = true;
      state.authMode = "login";
    },

    openSignupModal(state) {
      state.isAuthModalOpen = true;
      state.authMode = "signup";
    },

    closeAuthModal(state) {
      state.isAuthModalOpen = false;
    },
  },
});

export const { openLoginModal, openSignupModal, closeAuthModal } =
  uiSlice.actions;

export default uiSlice.reducer;
