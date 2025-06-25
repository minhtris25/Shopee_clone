import React, { useState } from "react";
import axios from "../api/axios";
import axiosClient from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../assets/css/style.css";
import logo from "../assets/images/shopee.png";
import bgImage from "../assets/images/bgr-login-register.jpg";
import "../index.css";



export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Dùng axios trực tiếp cho CSRF
    await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
      withCredentials: true,
    });

    // Sau đó login bằng axiosClient (đã có baseURL)
    await axiosClient.post("/login", form, {
      withCredentials: true,
    });

    alert("Đăng nhập thành công!");
    navigate("/");
  } catch (err) {
    console.error(err);
    alert("Đăng nhập thất bại!");
  }
};

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` } }
    >
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
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 16h-1.5v-4h1.5v4zm-1.5-5h-1.5V9h1.5v4z" />
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
