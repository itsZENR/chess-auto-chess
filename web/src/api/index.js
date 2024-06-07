import axios  from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getUsers = async () => {
    try {
        await apiClient.get('api/users/');
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
