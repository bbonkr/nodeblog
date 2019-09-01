import axios from 'axios';

export const http = axios.create({
    baseURL: process.env.apiBaseUrl,
    timeout: 180000,
    withCredentials: true,
});