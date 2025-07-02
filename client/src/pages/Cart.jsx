// src/pages/Cart.js (or wherever your Cart component is)

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Make sure this is imported
import HeaderCart from "../components/HeaderCart";
import Footer from "../components/Footer";

const Cart = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [selectedItems, setSelectedItems] = useState([]); // This state holds the selected items

  const allSelected = selectedItems.length === cartItems.length && cartItems.length > 0; // Fix: allSelected should be false if cart is empty

  const toggleSelectItem = (item) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
    });
  };

  const toggleSelectAll = () => {
    setSelectedItems(allSelected ? [] : cartItems);
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) => {
      const newCart = prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleDeleteItem = (id) => {
    const newCart = cartItems.filter((item) => item.id !== id);
    setCartItems(newCart);
    setSelectedItems((prev) => prev.filter((item) => item.id !== id)); // Also remove from selectedItems
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const total = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      const cartItem = cartItems.find((i) => i.id === item.id);
      return sum + (cartItem?.price || 0) * (cartItem?.quantity || 0);
    }, 0);
  }, [selectedItems, cartItems]);

  // Function to handle navigation to checkout
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để mua hàng.");
      return;
    }
    // Pass the selectedItems array to the checkout page via state
    navigate("/checkout", { state: { selectedItemsForCheckout: selectedItems } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderCart />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-6 bg-white rounded shadow mt-6">
          {/* Tiêu đề */}
          <div className="flex items-center border-b pb-3 font-semibold text-sm text-gray-700">
            <div className="w-1/2 flex items-center space-x-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
              <span>Sản phẩm</span>
            </div>
            <div className="w-1/6 text-center">Đơn giá</div>
            <div className="w-1/6 text-center">Số lượng</div>
            <div className="w-1/6 text-center">Thao tác</div>
          </div>

          {/* Danh sách sản phẩm */}
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Giỏ hàng của bạn đang trống.</div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-b py-4 text-sm text-gray-800"
              >
                <div className="w-1/2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!!selectedItems.find((i) => i.id === item.id)}
                    onChange={() => toggleSelectItem(item)}
                  />
                  <img
                    src={item.thumbnail || item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span>{item.name}</span>
                </div>
                <div className="w-1/6 text-center text-red-600 font-semibold">
                  ₫{Number(item.price).toLocaleString()}
                </div>
                <div className="w-1/6 text-center flex items-center justify-center space-x-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                <div
                  className="w-1/6 text-center text-blue-500 cursor-pointer hover:underline"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  Xóa
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Thanh sticky dưới */}
      <div className="sticky bottom-0 bg-white border-t shadow-md px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
          />
          <span className="text-sm text-gray-700">Chọn tất cả</span>
          <button
            onClick={() => {
              const newCart = cartItems.filter(
                (item) => !selectedItems.find((sel) => sel.id === item.id)
              );
              setCartItems(newCart);
              setSelectedItems([]);
              localStorage.setItem("cart", JSON.stringify(newCart));
            }}
            className="text-sm text-red-500 hover:underline"
          >
            Xóa
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-700">
            Tổng cộng:&nbsp;
            <span className="text-lg text-red-600 font-semibold">
              ₫{total.toLocaleString()}
            </span>
          </div>
          <button
            className="bg-orange-500 text-white px-6 py-2 font-semibold rounded-none hover:bg-orange-600"
            onClick={handleCheckout}
            disabled={selectedItems.length === 0} // Disable if no items are selected
          >
            Mua hàng
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;