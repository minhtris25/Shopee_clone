import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/productlist';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ProductList />} />
            {/* Thêm các route khác tại đây */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;