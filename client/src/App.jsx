// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Uncomment if you have a Register page
import Product from "./pages/Product";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Order from "./pages/Order"; // Import Order component
import SearchResults from './pages/SearchResults';
import SellerDashboard from "./seller/SellerDashboard";
import ChatFloatingButton from "./components/ChatFloatingButton";
import ChatWindow from "./components/ChatWindow";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import OrderDetail from "./pages/OrderDetail"; // Import OrderDetail component
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout"; // 👈 Thêm dòng này ở phần import



const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        
        <Route path="/profile" element={<Profile />} />

        <Route path="/order" element={<Order/>} /> 
        <Route path="/checkout" element={<Checkout/>} /> 
        <Route path="/products/search" element={<SearchResults />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/order/:id" element={<OrderDetail />} />
      </Routes>
      <ToastContainer />
      <ChatFloatingButton onClick={toggleChat} />
      <ChatWindow isOpen={isChatOpen} onClose={toggleChat} />
    </Router>
  );
};

export default App;