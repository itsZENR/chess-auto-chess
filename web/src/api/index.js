import axios from 'axios';
import {getCookie, getAccessToken, setAccessToken} from "@/api/authCookie";
import Cookies from "js-cookie";


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
    const token = getAccessToken();
    if (token) {
        config.headers['TOKEN'] = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const getToken = async () => {
    try {
        await axios.get(`/api/token/`);
        // const response = await api.get(`/api/token/`);
        // Cookies.set("csrftoken", response.data, {expires: 1});

        // console.log("response", response.data)
        // return response
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const postAuth = async () => {
    try {
        await api.post(`/api/auth/`);
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