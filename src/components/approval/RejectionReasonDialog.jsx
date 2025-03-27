import React, { useState, useEffect } from 'react';
import { X, AlertCircle, FileX } from 'lucide-react';

const RejectionReasonDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  post 
}) => {
  // สถานะสำหรับเก็บเหตุผลการปฏิเสธ
  const [reason, setReason] = useState('');
  // สถานะสำหรับการแสดงผลแอนิเมชัน
  const [isVisible, setIsVisible] = useState(false);

  // จัดการการแสดงผลแอนิเมชัน
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // จัดการการส่งเหตุผลการปฏิเสธ
  const handleSubmit = () => {
    // ตรวจสอบว่ามีการกรอกเหตุผลหรือไม่
    if (reason.trim() === '') {
      alert('กรุณาระบุเหตุผลการปฏิเสธ');
      return;
    }

    // เรียกฟังก์ชันส่งข้อมูลจากพาเรนท์
    onSubmit(post, reason);
    // รีเซ็ตช่องกรอกและปิดไดอะล็อก
    setReason('');
    onClose();
  };

  // หากไม่ได้เปิดไดอะล็อก ให้ return null
  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 
        ${isOpen 
          ? 'animate-fade-in' 
          : 'animate-fade-out'
        }`}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 
          ${isOpen 
            ? 'scale-100 opacity-100' 
            : 'scale-95 opacity-0'
          }`}
      >
        {/* ส่วนหัวของไดอะล็อก */}
        <div className="flex items-center justify-between p-5 bg-red-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <FileX className="w-7 h-7 text-red-500 animate-pulse" />
            <h2 className="text-xl font-bold text-red-800">
              เหตุผลการปฏิเสธ
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ส่วนเนื้อหาของไดอะล็อก */}
        <div className="p-5 space-y-4">
          <div className="bg-gray-100 p-3 rounded-lg mb-2">
            <p className="text-sm text-gray-600 italic">
              กรุณาอธิบายเหตุผลอย่างชัดเจนและสร้างสรรค์
            </p>
          </div>
          
          <textarea 
            value={reason}
            onChange={(e) => {
              // จำกัดความยาวตัวอักษร
              const inputValue = e.target.value;
              if (inputValue.length <= 500) {
                setReason(inputValue);
              }
            }}
            placeholder="เขียนเหตุผลการปฏิเสธที่นี่..."
            className="w-full h-36 p-3 border-2 border-red-100 rounded-xl focus:ring-2 focus:ring-red-200 focus:outline-none resize-none text-gray-700 leading-relaxed"
          />
          
          <div className="flex justify-between items-center">
            <span 
              className={`text-sm font-medium ${
                reason.length > 450 ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              {reason.length}/500 ตัวอักษร
            </span>
            {reason.length > 450 && (
              <span className="text-xs text-red-500 animate-bounce">
                ใกล้ถึงความยาวสูงสุดแล้ว
              </span>
            )}
          </div>
        </div>

        {/* ส่วนปุ่มการกระทำ */}
        <div className="flex justify-end space-x-3 p-5 bg-gray-50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 group"
          >
            <span>ยืนยันการปฏิเสธ</span>
            <AlertCircle className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionReasonDialog;