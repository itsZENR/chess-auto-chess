import axios from 'axios';
import {getCookie} from "@/api/api";


export function getToken() {
    const csrfToken = getCookie('csrftoken');

    const data = {
        username: 'your_username',
        password: 'your_password'
    };

    const url = 'http://127.0.0.1/api/auth/';

    axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        withCredentials: true // если нужно отправлять куки с запросом
    })
        .then(response => {
            console.log('Response received:', response.data);
        })
        .catch(error => {
            console.error('Error:', error.response ? error.response.statusText : error.message);
        });

}
