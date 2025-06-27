import React, { createContext, useEffect, useState, useContext } from 'react';
import api from '../api/axios'; // axiosClient đã cấu hình baseURL + withCredentials
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // để biết khi nào đang fetch user

const fetchUser = async () => {
  try {
    const res = await api.get('/me', { withCredentials: true });
    console.log('Kết quả fetchUser:', res.data);
    setUser(res.data);
  } catch (error) {
    setUser(null);
  } finally {
    setLoading(false);
  }
};


  // Gọi API logout
  const logout = async () => {
    try {
      await api.post('/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Fetch user khi lần đầu load ứng dụng
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook tiện sử dụng
export const useAuth = () => useContext(AuthContext);
