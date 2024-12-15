import { createSlice } from "@reduxjs/toolkit";
import { NotificationState } from "../../types/notification";

const initialState: NotificationState = {
    type: null,
    message: null,
}

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification: (state, action) => {
            state.type = action.payload.type;
            state.message = action.payload.message;
        },
        clearNotification: (state) => {
            state.type = null;
            state.message = null;
        },
    },
});

export const {
    setNotification,
    clearNotification,
} = notificationSlice.actions;

export const selectNotification = (state: any) => state.notification;

export default notificationSlice.reducer;