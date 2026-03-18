import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.login(credentials);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.error || 'Login failed');
    }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.getMe();
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response.data.error);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token'),
        isAuthenticated: !!localStorage.getItem('token'),
        user: (() => {
            try {
                const user = localStorage.getItem('user');
                return user && user !== 'undefined' ? JSON.parse(user) : null;
            } catch (error) {
                return null;
            }
        })(),
        loading: false,
        error: null
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state) => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                state.loading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
