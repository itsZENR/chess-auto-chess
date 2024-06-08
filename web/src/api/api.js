import axios from 'axios';

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const api = axios.create({
  baseURL: 'https://127.0.0.1',
});

api.interceptors.request.use(config => {
  const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrfToken='));
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken.split('=')[1];
  }
  return config;
});

export default api;
