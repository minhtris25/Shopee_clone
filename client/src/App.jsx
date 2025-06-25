// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/productlist';
import Login from './pages/Login';
import Register from './pages/Register'; // Uncomment if you have a Register page 

import Home from './pages/Home';
import Cart from './pages/Cart';

const App = () => {
  return (
    <Router>

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
       <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<ProductList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
