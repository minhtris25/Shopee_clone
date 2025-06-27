import React, { useState, useEffect } from 'react'; // Import useEffect
import ManageProducts from './ManageProducts';
import AddProduct from './AddProduct';
import SidebarSeller from './SidebarSeller';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify'; // Import toast

const SellerDashboard = () => {
  const [activeSection, setActiveSection] = useState('manageProducts');
  const { user, loading } = useAuth(); // Lấy user và loading từ AuthContext
  const navigate = useNavigate(); // Khởi tạo useNavigate

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    // Đảm bảo rằng việc kiểm tra hoàn tất (loading đã false)
    // và user không tồn tại (chưa đăng nhập)
    if (!loading && !user) {
      toast.warn("Vui lòng đăng nhập để trở thành người bán!", {
        position: "top-center", // Vị trí hiển thị thông báo
        autoClose: 3000, // Tự động đóng sau 3 giây
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/login'); // Chuyển hướng đến trang đăng nhập
    }
  }, [user, loading, navigate]); // Chạy lại khi user, loading hoặc navigate thay đổi

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

  // Hiển thị một cái gì đó trong khi đang kiểm tra trạng thái đăng nhập
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Đang tải...</p> {/* Hoặc một spinner loading */}
      </div>
    );
  }

  // Nếu user không tồn tại sau khi load, component này sẽ không được render
  // vì đã chuyển hướng trong useEffect.
  // Nếu user tồn tại, thì render nội dung dashboard
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