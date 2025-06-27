import React, { useState } from 'react';
import axiosClient from '../api/axios';
import axios from 'axios';
import '../assets/css/style.css';
import bgImage from '../assets/images/bgr-login-register.jpg';
import { useAuth } from '../context/AuthContext'; 


export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const { setUser } = useAuth(); // lấy hàm setUser
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password.length < 8) {
    alert('Mật khẩu phải có ít nhất 8 ký tự');
    return;
  }

  if (form.password !== form.password_confirmation) {
    alert('Mật khẩu xác nhận không khớp');
    return;
  }

  try {
    await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
    const res = await axiosClient.post('/register', form);
    setUser(res.data.user); // lưu user vào context
    alert("Đăng ký thành công!");
    navigate("/");
    console.log('Success:', res.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
  return (
    <div
  className="min-h-screen bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: `url(${bgImage})` }}>
    <div className="bg-[#ffffff] min-h-4">
      </div>
    <div className="font-sans">
      <div className="banner-bg">
        <div className="login-form">
          <h2 className="text-xl font-bold mb-4 text-center">Đăng ký</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirm Password"
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">
              Đăng Ký
            </button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-gray-500">OR</span>
          </div>
          <div id="button_bottom" className="social-buttons mt-4">
            <button className="bg-blue-600 text-white p-2 rounded flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c..."/>
              </svg>
              Facebook
            </button>
            <button className="bg-red-600 text-white p-2 rounded flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545 2.875c..."/>
              </svg>
              Google
            </button>
          </div>
          <div className="mt-4 text-center">
            <span className="text-gray-500 mr-2">Đăng nhập với mã QR</span>
            <span className="qr-code"></span>
          </div>
          <p className="text-center mt-2 text-sm text-gray-500">
            Bạn mới biết Shopee? <a href="/login" className="text-black-500">Đăng nhập</a>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
