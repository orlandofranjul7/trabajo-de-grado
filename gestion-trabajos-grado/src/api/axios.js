import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: 'http://localhost:5122/api', // Reemplázalo con tu URL real
  headers: {
    'Content-Type': 'application/json',
  },
});


export default api;
