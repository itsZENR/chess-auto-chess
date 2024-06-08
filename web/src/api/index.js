import axios from 'axios';
import {getCookie} from "@/api/authCookie";

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
    },
});

export const postAuth = async () => {
    try {
        await apiClient.post('api/auth/');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const createRoom = async () => {
    try {
        await apiClient.post('api/room/');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// export const sendUserData = async (userData) => {
//     try {
//         await apiClient.post('api/users', userData);
//     } catch (error) {
//         console.error('Error sending user data:', error);
//         throw error;
//     }
// };
