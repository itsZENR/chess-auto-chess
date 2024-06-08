import axios from 'axios';
import {getCookie} from "@/api/authCookie";


const api = axios.create({
    baseURL: 'http://127.0.0.1',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(config => {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const postAuth = async () => {
    try {
        await api.post('/api/auth/');
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