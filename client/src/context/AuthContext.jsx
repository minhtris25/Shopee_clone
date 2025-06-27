// Trong AuthContext.jsx
import React, { createContext, useEffect, useState, useContext } from 'react';
import api from '../api/axios'; // Đảm bảo api là axiosClient đã cấu hình
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) { // Nếu không có token, không cố gắng fetch user
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      // axiosClient đã được cấu hình để tự động đính kèm token vào header Authorization
      // KHÔNG CẦN { withCredentials: true } NỮA
      const res = await api.get('/me');
      console.log('Kết quả fetchUser:', res.data);
      setUser(res.data);
    } catch (error) {
      console.error('Lỗi fetchUser:', error);
      setUser(null);
      localStorage.removeItem('access_token'); // Xóa token cũ nếu không hợp lệ
      // Có thể chuyển hướng về trang đăng nhập nếu là lỗi 401
      // if (error.response?.status === 401) { navigate('/login'); }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Gửi request logout để thu hồi token ở backend
      await api.post('/logout');
    } catch (err) {
      console.error('Logout failed on server:', err);
      // Xử lý lỗi nếu cần, nhưng vẫn xóa token ở client
    } finally {
      localStorage.removeItem('access_token'); // Xóa token khỏi localStorage
      setUser(null); // Xóa user state
      window.location.href = '/login'; // Chuyển hướng sau khi đăng xuất
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);