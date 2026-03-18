import { configureStore } from '@reduxjs/toolkit';
import ticketReducer from './slices/ticketSlice';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        tickets: ticketReducer,
        users: userReducer,
        auth: authReducer
    }
});
