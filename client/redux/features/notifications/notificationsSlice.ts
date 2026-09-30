import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  INotification,
  INotificationsResponse,
} from "../../../types/notification.type";

interface IInitialState {
  data: INotificationsResponse | null;
}

const initialState: IInitialState = {
  data: null,
};

const notificationSlice = createSlice({
  initialState,
  name: "notification",
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
      console.log(state.data);
    },
    updateStatus: (state, action) => {
      if (!state.data) return;

      const notification = state?.data.notifications.find(
        (item) => item._id === action.payload,
      );
      if (notification) {
        notification.status = "read";
      }
    },
    addNotification: (state, action: PayloadAction<INotification>) => {
      console.log("🔥 ADD NOTIFICATION REDUCER:", action.payload);

      if (!state.data) return;

      state.data.notifications.unshift(action.payload);

      state.data.result += 1;
    },
  },
});

export const { setData, updateStatus, addNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
