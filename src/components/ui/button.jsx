// Button.jsx
import React from "react";

const Button = ({ children, onClick, className = "", ...props }) => {
  return (
    <button
      className={`px-6 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md flex items-center space-x-2 ${className}`}
      onClick={onClick}
      {...props}  // รองรับ props อื่นๆ ที่ส่งเข้ามา
    >
      {children}
    </button>
  );
};

export default Button;