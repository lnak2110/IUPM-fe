import axios from 'axios';
import { router } from '../App';
import { toast } from 'react-toastify';

export const { setStore, getStore, getStoreJson, eraseStore } = {
  setStore: (name, value) => {
    if (typeof value !== 'string') {
      localStorage.setItem(name, JSON.stringify(value));
    } else {
      localStorage.setItem(name, value);
    }
  },
  getStore: (name) => {
    if (localStorage.getItem(name)) {
      return localStorage.getItem(name);
    }
    return null;
  },
  getStoreJson: (name) => {
    if (localStorage.getItem(name)) {
      return JSON.parse(localStorage.getItem(name));
    }
    return null;
  },
  eraseStore: (name) => {
    localStorage.removeItem(name);
  },
};

export const axiosAuth = axios.create({
  baseURL: process.env.REACT_APP_DOMAIN,
});

axiosAuth.interceptors.request.use(
  (config) => {
    const token = getStoreJson(
      process.env.REACT_APP_USER_LOGGED_IN
    ).accessToken;

    config.headers.set('Authorization', `Bearer ${token}`);
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

axiosAuth.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log(error?.response);
    toast.error(error?.response?.data?.message || 'Something wrong happened!');
    if (error?.response?.status === 401) {
      router.navigate('/login');
    }
    return Promise.reject(error);
  }
);

export const removeAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};
