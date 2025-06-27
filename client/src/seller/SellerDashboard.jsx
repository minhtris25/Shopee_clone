import React, { useState } from 'react';
import ManageProducts from './ManageProducts';
import AddProduct from './AddProduct';
import SidebarSeller from './SidebarSeller';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SellerDashboard = () => {
  const [activeSection, setActiveSection] = useState('manageProducts'); // State để quản lý section đang hoạt động

  const renderContent = () => {
    switch (activeSection) {
      case 'manageProducts':
        return <ManageProducts />;
      case 'addProduct':
        return <AddProduct />;
      default:
        return <ManageProducts />;
    }
  };

  return (
    <>
      <Header />
    <div className="flex h-screen bg-gray-100">
      <SidebarSeller setActiveSection={setActiveSection} activeSection={activeSection} />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          {activeSection === 'manageProducts' ? 'Quản lý sản phẩm' : 'Thêm sản phẩm'}
        </h1>
        {renderContent()}
      </main>
    </div>
    <Footer />
    </>
  );
};

export default SellerDashboard;