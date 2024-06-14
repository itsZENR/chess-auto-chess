import axios from 'axios';
import {getCookie, getAccessToken, setAccessToken} from "@/api/authCookie";


const api = axios.create({
    // baseURL: 'http://127.0.0.1',
    baseURL: 'http://chess-auto-chess.ru',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(config => {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    const token = getAccessToken();
    if (token) {
        config.headers['TOKEN'] = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const getAuth = async () => {
    try {
        const response = await api.get(`/api/auth/`);
        setAccessToken(response.data.token)
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const createRoom = async () => {
    try {
        const response = await api.post('/api/room/');
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const connectRoom = async (idRoom) => {
    try {
        const response = await api.get(`/api/room/connect/${idRoom}/`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};