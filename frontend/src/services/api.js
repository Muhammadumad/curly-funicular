import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Ensure this matches your active 'artisan serve' address
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'Accept': 'application/json',          // Forces Laravel to return JSON errors instead of HTML views
        'Content-Type': 'application/json',
    }
});

export default api;