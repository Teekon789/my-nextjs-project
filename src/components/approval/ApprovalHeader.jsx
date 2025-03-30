// components/approval/ApprovalHeader.jsx
import { useState } from 'react';
import { FaUserCircle, FaSignOutAlt, FaEdit } from "react-icons/fa";
import Image from 'next/image';
import mn_1 from '@/logo/mn_1.png';
import EditUserDialog from './EditUserDialog';
import axios from 'axios';
import { toast } from 'react-toastify';

const ApprovalHeader = ({ currentUser, handleLogout, setCurrentUser }) => { // เพิ่ม setCurrentUser
  // สถานะสำหรับการเปิด/ปิด dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // เปิด dialog แก้ไขข้อมูล
  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  // ปิด dialog แก้ไขข้อมูล
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  // บันทึกข้อมูลที่แก้ไข
  const handleSaveUserData = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('กรุณาเข้าสู่ระบบใหม่');
        return;
      }

      const response = await axios.put('/api/updateUser', updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 && response.data) {
        const updatedUser = response.data;
        // อัพเดท localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // อัพเดท state
        setCurrentUser(updatedUser);
        toast.success('อัพเดทข้อมูลสำเร็จ');
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response?.status === 401) {
        toast.error('กรุณาเข้าสู่ระบบใหม่');
        handleLogout?.();
      } else {
        const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล';
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Image
              src={mn_1}
              alt="Logo"
              className="w-16 h-16 text-3xl text-gray-600"
              priority={true}  // ให้โหลดภาพทันที
            />
            <h1 className="text-2xl font-bold text-gray-800 relative">
              มหาวิทยาลัยนเรศวร
              <span className="absolute bottom-0 right-0 w-1/2 border-b-4 border-orange-500/85"></span>
            </h1>
          </div>
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors group"
                onClick={handleOpenEditDialog}
              >
                <div className="relative">
                  <FaUserCircle className="text-gray-600 text-xl group-hover:text-gray-600 transition-colors" />
                  <div className="absolute -top-1 -right-1 bg-gray-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaEdit className="text-xs" />
                  </div>
                </div>
                <span className="text-gray-700 group-hover:text-gray-600 transition-colors">{currentUser.fullname}</span>
                <span className="hidden group-hover:inline-block text-xs text-gray-600">(แก้ไข)</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* แทรก EditUserDialog Component */}
      <EditUserDialog 
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        currentUser={currentUser}
        onSave={handleSaveUserData}
      />
    </div>
  );
};

export default ApprovalHeader;