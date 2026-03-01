import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hrms-backend-production-4717.up.railway.app/api',
});

export default api;
