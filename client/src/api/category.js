import axiosClient from './axios';

export const fetchCategories = () =>
  axiosClient.get('/home/categories').then((res) => res.data);
