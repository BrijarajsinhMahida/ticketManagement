import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.fetchUsers(params);
        return { data: data.data, pagination: data.pagination };
    } catch (error) {
        return rejectWithValue(error.response.data.error || 'Something went wrong');
    }
});

export const createUser = createAsyncThunk('users/add', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await api.createUser(userData);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response.data.error || 'Failed to add user');
    }
});

const userSlice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 0
        },
        loading: false,
        error: null,
        filters: {
            search: ''
        }
    },
    reducers: {
        setUserPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setUserLimit: (state, action) => {
            state.pagination.limit = action.payload;
            state.pagination.page = 1;
        },
        setUserFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearUserFilters: (state) => {
            state.filters = { search: '' };
            state.pagination.page = 1;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
                state.error = null;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setUserPage, clearError, setUserLimit, setUserFilters, clearUserFilters } = userSlice.actions;
export default userSlice.reducer;
