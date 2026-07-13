import axios from 'axios';

const api = axios.create({
    baseURL: typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:8000`
        : 'http://127.0.0.1:8000',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'Accept': 'application/json',          // Forces Laravel to return JSON errors instead of HTML views
        'Content-Type': 'application/json',
    }
});

export default api;