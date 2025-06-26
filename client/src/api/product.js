// src/api/product.js
import axiosClient from './axios';

export const fetchRecommendedProducts = (page = 1) =>
  axiosClient.get(`/home/recommend-by-category?page=${page}`).then(res => res.data);
