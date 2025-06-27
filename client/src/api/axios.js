import axios from 'axios';

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // bật để gửi cookie CSRF + session
});

export default axiosClient;