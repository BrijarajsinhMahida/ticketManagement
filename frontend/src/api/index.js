import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export const fetchTickets = (params) => API.get('/tickets', { params });
export const createTicket = (ticketData) => API.post('/tickets', ticketData);
export const updateTicket = (id, ticketData) => API.patch(`/tickets/${id}`, ticketData);

export const fetchUsers = (params) => API.get('/users', { params });
export const createUser = (userData) => API.post('/users', userData);

export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const getMe = () => API.get('/auth/me');

// Add token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
