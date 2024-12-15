import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import notificationReducer from '../slices/notificationSlice';
import gameReducer from '../slices/gameSlice';
import socketReducer from '../slices/socketSlice';
import languageReducer from '../slices/languageSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        notification: notificationReducer,
        game: gameReducer,
        language: languageReducer,
        socket: socketReducer,
    },
});

export default store;
