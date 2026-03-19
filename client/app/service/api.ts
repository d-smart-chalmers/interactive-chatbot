import axios from 'axios';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:8080',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error || error.message || 'Something went wrong';
    toast.error(message, {
      position: 'top-right',
    });
    return Promise.reject(error);
  },
);
