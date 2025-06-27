// src/components/ChatWindow.jsx
import React from 'react';
import { X } from 'lucide-react';

const ChatWindow = ({ isOpen, onClose }) => {
  return (
    <div
      className={`
        fixed bottom-6 right-6 z-40
        w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-xl
        flex flex-col
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
      `}
      style={{
        bottom: isOpen ? '90px' : '24px', // Điều chỉnh vị trí khi trồi lên, cách nút chat 1 khoảng
                                          // 24px là bottom mặc định của nút, 90px sẽ đẩy lên cao hơn
        right: '24px' // Giữ nguyên vị trí ngang của nút
      }}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-orange-500 text-white rounded-t-lg">
        <h3 className="font-semibold">Hỗ trợ trực tuyến</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto text-gray-700">
        {/* Nội dung chat sẽ ở đây */}
        <p>Chào bạn! Chúng tôi có thể giúp gì cho bạn?</p>
        <p className="mt-2 text-sm text-gray-500">
          (Đây là nội dung chat giả định. Bạn có thể tích hợp với dịch vụ chat thực tế ở đây.)
        </p>
      </div>
      <div className="p-4 border-t border-gray-200">
        <input
          type="text"
          placeholder="Nhập tin nhắn của bạn..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button className="mt-2 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition">
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;