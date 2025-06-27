// Trong axios.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // Bỏ dòng này nếu bạn chỉ dùng token và không dùng cookie
});

// Thêm một interceptor để đính kèm token vào header cho mọi request
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Đính kèm token vào header
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Thêm một interceptor để xử lý lỗi 401 (Unauthorized)
axiosClient.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            // Xóa token nếu bị 401, chuyển hướng về trang đăng nhập
            localStorage.removeItem('access_token');
            // Bạn có thể cần một cách để truy cập navigate ở đây,
            // hoặc xử lý việc chuyển hướng ở component gọi API
            // Ví dụ: window.location.href = '/login';
            console.log('Token expired or unauthorized. Redirecting to login.');
        }
        return Promise.reject(error);
    }
);

export default axiosClient;