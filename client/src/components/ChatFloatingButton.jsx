// src/components/ChatFloatingButton.jsx
import React from "react";
import { MessageSquare } from "lucide-react";

const ChatFloatingButton = ({ onClick }) => { // Nhận prop onClick
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick} // Gán onClick prop vào button
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-md rounded-full hover:shadow-lg transition"
      >
        <MessageSquare size={18} className="text-orange-500" />
        <span className="text-orange-500 font-medium text-sm">Chat</span>
      </button>
    </div>
  );
};

export default ChatFloatingButton;