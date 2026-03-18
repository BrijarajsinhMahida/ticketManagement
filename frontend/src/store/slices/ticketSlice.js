import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api';

export const fetchTickets = createAsyncThunk('tickets/fetchAll', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.fetchTickets(params);
        return { data: data.data, pagination: data.pagination };
    } catch (error) {
        return rejectWithValue(error.response.data.error || 'Something went wrong');
    }
});

export const createTicket = createAsyncThunk('tickets/add', async (ticketData, { rejectWithValue }) => {
    try {
        const { data } = await api.createTicket(ticketData);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response.data.error || 'Something went wrong');
    }
});

export const updateTicket = createAsyncThunk('tickets/update', async ({ id, ticketData }, { rejectWithValue }) => {
    try {
        const { data } = await api.updateTicket(id, ticketData);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response.data.error || 'Something went wrong');
    }
});

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        list: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 6,
            totalPages: 0
        },
        loading: false,
        error: null,
        filters: {
            status: '',
            priority: '',
            search: '',
            assignedTo: '',
            page: 1
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { status: '', priority: '', search: '', assignedTo: '', page: 1 };
        },
        setLimit: (state, action) => {
            state.pagination.limit = action.payload;
            state.pagination.page = 1;
            state.filters.page = 1;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            .addCase(updateTicket.fulfilled, (state, action) => {
                const index = state.list.findIndex((t) => t._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            });
    }
});

export const { setFilters, clearFilters, setLimit } = ticketSlice.actions;
export default ticketSlice.reducer;
