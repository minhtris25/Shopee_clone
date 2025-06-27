// axios.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // <-- Thay đổi thành false
});

// Thêm một interceptor để tự động đính kèm token vào header Authorization
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token'); // Lấy token từ localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
            // Có thể trigger fetchUser để cập nhật trạng thái user trong AuthContext
            // hoặc chuyển hướng trực tiếp nếu bạn không muốn tái fetch
            window.location.href = '/login'; // Ví dụ chuyển hướng cứng
        }
        return Promise.reject(error);
    }
);

export default axiosClient;