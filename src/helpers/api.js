import axios from 'axios';
import { getDomain } from 'helpers/getDomain';

export const api = axios.create({
  baseURL: getDomain(),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

api.interceptors.request.use((config) => {
  // TODO: rename token to Authorization
  config.headers.token = localStorage.getItem('token');
  return config;
});
