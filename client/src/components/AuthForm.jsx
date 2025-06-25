// src/components/AuthForm.jsx
import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function AuthForm({ isLogin = true }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.get('/sanctum/csrf-cookie'); // Bắt buộc cho Sanctum
      if (isLogin) {
        await api.post('/api/login', {
          email: form.email,
          password: form.password,
        });
      } else {
        await api.post('/api/register', form);
      }
      navigate('/');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Có lỗi xảy ra');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
      {!isLogin && (
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Mật khẩu"
        value={form.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      {!isLogin && (
        <input
          type="password"
          name="password_confirmation"
          placeholder="Xác nhận mật khẩu"
          value={form.password_confirmation}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      )}
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {isLogin ? 'Đăng nhập' : 'Đăng ký'}
      </button>
    </form>
  );
}
