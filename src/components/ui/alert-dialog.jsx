// components/ui/alert-dialog.jsx
import React from "react";

// คอมโพเนนต์หลัก AlertDialog
export const AlertDialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        {children}
      </div>
    </div>
  );
};

// ส่วนเนื้อหาของ AlertDialog
export const AlertDialogContent = ({ children }) => (
  <div>{children}</div>
);

// ส่วนหัวของ AlertDialog
export const AlertDialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

// ชื่อเรื่องของ AlertDialog
export const AlertDialogTitle = ({ children }) => (
  <h2 className="text-xl font-bold">{children}</h2>
);

// คำอธิบายของ AlertDialog
export const AlertDialogDescription = ({ children }) => (
  <p className="text-gray-600">{children}</p>
);

// ส่วนท้ายของ AlertDialog (สำหรับปุ่ม)
export const AlertDialogFooter = ({ children }) => (
  <div className="mt-4 flex justify-end space-x-2">{children}</div>
);

// ปุ่มยกเลิก
export const AlertDialogCancel = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
  >
    {children}
  </button>
);

// ปุ่มตกลง
export const AlertDialogAction = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    {children}
  </button>
);