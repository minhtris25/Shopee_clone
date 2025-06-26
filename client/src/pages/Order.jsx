import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { orders } from "../data/mockData.js";
import Sidebar from "../components/Sidebar";
import ChatFloatingButton from "../components/ChatFloatingButton";
import { Search, Bell, User, CreditCard, Ticket, CircleDollarSign, Tag, Pencil, MessageSquare, Store, Truck } from "lucide-react"; // dùng icon đẹp

  const Order = () => {
    return ( 
        <>
        <Header /> 
        <ChatFloatingButton />
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
  
        <div className="flex-1 px-3 py-4">
          <h1 className="text-xl font-semibold mb-4">Đơn Mua</h1>

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
                type="text"
                placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            </div>
  
          {orders.map((order) => (
            <div
                key={order.id}
                className="bg-white mb-5 rounded-xl shadow-md"
                >

              {/* Header shop + trạng thái */}
              <div className="flex justify-between items-center px-4 py-3 bg-white">
              <div className="flex items-center gap-2 text-sm font-medium">
              <span className="flex items-center gap-1">
                    <Store size={14} className="text-gray-600" />
                     {order.shop}</span>
                    <div className="flex items-center gap-2">
                    {/* Nút Chat */}
                    <button className="flex items-center gap-1 text-orange-500 font-medium text-xs border px-2 py-0.5 rounded hover:bg-orange-50">
                    <MessageSquare size={12} className="text-orange-500" />
                    Chat
                    </button>
                    {/* Nút Xem Shop */}
                    <button className="flex items-center gap-1 border border-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded hover:bg-gray-50 transition">
                        <Store size={14} />
                        Xem Shop
                    </button>
                    </div>
                </div>
                <div
                    className={`flex items-center gap-1 text-xs font-semibold ${
                        order.canceled
                        ? "text-gray-500"
                        : order.status === "completed"
                        ? "text-green-600"
                        : "text-yellow-500"
                    }`}
                    >
                    {!order.canceled && (
                        <Truck
                        size={14}
                        className={`${
                            order.status === "completed" ? "text-green-500" : "text-yellow-500"
                        }`}
                        />  
                    )}
                    {order.canceled
                        ? "ĐÃ HỦY"
                        : order.status === "completed"
                        ? "Giao hàng thành công"
                        : "ĐANG XỬ LÝ"}
                    </div>

                </div>
  
              {/* Sản phẩm */}
              <div className="px-4 py-2 space-y-4">
                {order.products.map((product, index) => (
                  <div key={index} className="flex gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    />
                    <div className="flex-1 flex flex-col justify-between text-sm">
                      <div>
                        <div className="text-gray-800 font-medium">
                          {product.name}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          Phân loại hàng: {product.option}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        x{product.qty}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="line-through text-gray-400 text-xs">
                        ₫{(product.original_price || 0).toLocaleString()}
                      </div>
                      <div className="text-red-500 font-semibold">
                        ₫{(product.price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
  
              {/* Tổng tiền */}
              <div className="flex justify-end px-4 py-3 bg-gray-50 text-sm">
                <div className="text-gray-700 mr-2">Thành tiền:</div>
                <div className="text-red-500 font-bold text-lg">
                  ₫{(order.total || 0).toLocaleString()}
                </div>
              </div>
  
              {/* Action buttons */}
              <div className="flex justify-end px-4 py-3 gap-2  bg-white">
                {order.canceled ? (
                  <>
                    <button className="text-sm px-3 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                      Xem Thông Tin Hoàn Tiền
                    </button>
                    <button className="bg-orange-500 text-white text-sm px-4 py-1 rounded hover:bg-orange-600">
                      Mua Lại
                    </button>
                  </>
                ) : (
                  <>
                    <button className="text-sm px-3 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                      Liên Hệ Người Bán
                    </button>
                    <button className="bg-orange-500 text-white text-sm px-4 py-1 rounded hover:bg-orange-600">
                      Mua Lại
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    <Footer /> 
      </>
    );
  };
  
    


export default Order;