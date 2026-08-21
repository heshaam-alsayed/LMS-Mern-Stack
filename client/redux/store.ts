import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import uiSlice from "./features/ui/uiSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
