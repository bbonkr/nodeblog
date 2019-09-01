import axios from 'axios';

export const http = axios.create({
    baseURL: axios.defaults.baseURL || '/api',
    timeout: 180000,
    withCredentials: true,
    // headers: { crossDomain: true, 'Content-Type': 'application/json' },
});