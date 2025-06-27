// src/api/product.js
import axiosClient from './axios';

export const fetchRecommendedProducts = async (params = {}) => {
  try {
    const response = await axiosClient.get('/home/recommend-by-category', {
      params: {
        page: params.page || 1,
        sort_by: params.sort_by || 'lienQuan',
        per_page: params.per_page || 16,
      },
      headers: {
        'Cache-Control': 'no-cache', // Vô hiệu hóa cache
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    throw error;
  }
};

export const fetchProductById = (id) => {
  return axiosClient.get(`/product/${id}`);
};

export const searchProducts = (q) => {
  return axiosClient.get('/products/search', {
    params: { q },
  });
};