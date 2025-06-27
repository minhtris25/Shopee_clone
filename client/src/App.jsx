// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Uncomment if you have a Register page
import Product from "./pages/Product";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Order from "./pages/Order";
import SellerDashboard from "./seller/SellerDashboard";
import ChatFloatingButton from "./components/ChatFloatingButton";
import ChatWindow from "./components/ChatWindow";

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false); // State được định nghĩa ở đây

  const toggleChat = () => { // Hàm toggleChat được định nghĩa ở đây, bên trong component App
    setIsChatOpen(!isChatOpen);
    };
    return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/" element={<ProductList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/detail/:id" element={<ProductDetail />} />
        <Route path="/order" element={<Order/>} />
        <Route path="/seller" element={<SellerDashboard />} />
      </Routes>
       <ChatFloatingButton onClick={toggleChat} />
      <ChatWindow isOpen={isChatOpen} onClose={toggleChat} />
    </Router>
  );
};

export default App;
