// Trong Login.jsx
import React, { useState } from "react";
import axiosClient from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import HeaderLogin  from "../components/HeaderLogin"; // Import HeaderLogin
import bgImage from "../assets/images/bgr-login-register.jpg";
import { toast } from 'react-toastify'; // Import toast

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Chỉ cần setUser, không cần fetchUser ở đây vì AuthContext đã tự gọi

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post("/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem('access_token', res.data.access_token);
      setUser(res.data.user);

      // Thay thế alert bằng toast.success
      toast.success("Đăng nhập thành công!", {
        position: "top-right", // Vị trí hiển thị
        autoClose: 2000, // Tự động đóng sau 2 giây
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Chuyển hướng sau một khoảng thời gian ngắn để người dùng kịp thấy thông báo
      setTimeout(() => {
        navigate("/");
      }, 2000); // Chuyển hướng sau 2 giây (phù hợp với autoClose của toast)

    } catch (err) {
      console.error(err);
      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = "Lỗi: " + err.response.data.message;
      }
      // Thay thế alert bằng toast.error
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` } }
    >
      <HeaderLogin /> {/* Thêm HeaderLogin */}
      <div className="bg-[#ffffff] min-h-4">
      </div>
      <div className="banner-bg">
        {/* Form Đăng Nhập */}
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4 text-center">Đăng nhập</h2>
            <p className="text-center mb-4 text-gray-500">
              Đăng nhập để nhận voucher
            </p>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              ĐĂNG NHẬP
            </button>

            <p className="text-center mt-2 text-sm text-gray-500">
              Quên mật khẩu?
            </p>

            <div className="mt-4 text-center">
              <span className="text-gray-500">OR</span>
            </div>

            <div id="button_bottom" className="social-buttons mt-4">
              <button className="bg-blue-600 text-white p-2 rounded flex items-center justify-center mb-2">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 16h-1.5v-4h1.5v4zm-1.5-5h-1.5V9h1.5v4z" />
                </svg>
                Facebook
              </button>

              <button className="bg-red-600 text-white p-2 rounded flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 16h-1.5v-4h1.5v4z" />
                </svg>
                Google
              </button>
            </div>

            <div className="mt-4 text-center">
              <span className="text-gray-500 mr-2">Đăng nhập với mã QR</span>
              <span className="qr-code"></span>
            </div>

            <p className="text-center mt-2 text-sm text-gray-500">
              Bạn mới biết Shopee?{" "}
              <a href="/register" className="text-black-500">
                Đăng ký
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}