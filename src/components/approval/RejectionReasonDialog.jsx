import React, { useState, useEffect } from 'react';
import { X, AlertCircle, FileX, CheckCircle } from 'lucide-react';

const RejectionReasonDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  post 
}) => {
  // สถานะสำหรับเก็บเหตุผลการปฏิเสธ
  const [reason, setReason] = useState('');
  // สถานะสำหรับการเลือกเหตุผลแบบตายตัว
  const [selectedReasons, setSelectedReasons] = useState([]);
  // สถานะสำหรับการแสดงผลแอนิเมชัน
  const [isVisible, setIsVisible] = useState(false);

  // รายการเหตุผลการปฏิเสธที่กำหนดไว้ล่วงหน้า
  const predefinedReasons = [
    'งบประมาณไม่ถูกต้อง',
    'เอกสารประกอบไม่ครบถ้วน',
    'รายละเอียดการเดินทางไม่ชัดเจน',
    'ขัดต่อระเบียบการเบิกจ่าย',
    'ระยะเวลาการเดินทางไม่เหมาะสม',
    'ขาดเอกสารสำคัญ',
    'อื่นๆ'
  ];

  // จัดการการแสดงผลแอนิเมชัน
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // รีเซ็ตค่าเมื่อเปิดไดอะล็อก
      setReason('');
      setSelectedReasons([]);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // จัดการการเลือกเหตุผลแบบตายตัว
  const handleReasonSelect = (selectedReason) => {
    setSelectedReasons(prev => 
      prev.includes(selectedReason)
        ? prev.filter(r => r !== selectedReason)
        : [...prev, selectedReason]
    );
  };

  // จัดการการส่งเหตุผลการปฏิเสธ
  const handleSubmit = () => {
    // รวมเหตุผลที่เลือกและเหตุผลที่พิมพ์เพิ่มเติม
    const combinedReasons = [
      ...selectedReasons,
      ...(reason.trim() ? [reason.trim()] : [])
    ];

    // ตรวจสอบว่ามีการกรอกเหตุผลหรือไม่
    if (combinedReasons.length === 0) {
      alert('กรุณาระบุเหตุผลการปฏิเสธ');
      return;
    }

    // เรียกฟังก์ชันส่งข้อมูลจากพาเรนท์
    onSubmit(post, combinedReasons.join('\n'));
    
    // ปิดไดอะล็อก
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
        className={`bg-white rounded-3xl shadow-2xl w-full max-w-xl mx-auto transform transition-all duration-300 
          ${isOpen 
            ? 'scale-100 opacity-100' 
            : 'scale-95 opacity-0'
          }`}
      >
        {/* ส่วนหัวของไดอะล็อก */}
        <div className="flex items-center justify-between p-5 bg-red-50 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <FileX className="w-8 h-8 text-red-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-red-800">
              เหตุผลการปฏิเสธ
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* ส่วนเนื้อหาของไดอะล็อก */}
        <div className="p-6 space-y-5">
          {/* ส่วนเลือกเหตุผลแบบตายตัว */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              เลือกเหตุผลการปฏิเสธ
            </h3>
            <div className="flex flex-wrap gap-2">
              {predefinedReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleReasonSelect(reason)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                    selectedReasons.includes(reason)
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {/* ช่องกรอกเหตุผลเพิ่มเติม */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              เหตุผลเพิ่มเติม (ถ้ามี)
            </label>
            <textarea 
              value={reason}
              onChange={(e) => {
                // จำกัดความยาวตัวอักษร
                const inputValue = e.target.value;
                if (inputValue.length <= 500) {
                  setReason(inputValue);
                }
              }}
              placeholder="อธิบายเหตุผลการปฏิเสธเพิ่มเติม..."
              className="w-full h-32 p-3 border-2 border-red-100 rounded-xl focus:ring-2 focus:ring-red-200 focus:outline-none resize-none text-gray-700 leading-relaxed"
            />
            
            <div className="flex justify-between items-center mt-2">
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
        </div>

        {/* ส่วนปุ่มการกระทำ */}
        <div className="flex justify-end space-x-3 p-5 bg-gray-50 rounded-b-3xl">
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