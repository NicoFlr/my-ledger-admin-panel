import axios from 'axios';
import { API_BASE_URL } from '../config/environment';
import { SESSION_STORAGE } from '../constants/sessionStorageConstants';

const httpService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpService.interceptors.request.use(
  async request => {
    const jwToken = sessionStorage.getItem(SESSION_STORAGE.JWT);
    if (jwToken) {
      request.headers.Authorization = `Bearer ${jwToken}`;
    }
    return request;
  },
  error => {
    return Promise.reject(error);
  },
);

export default httpService;
