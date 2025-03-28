//src/components/approval/PostsTable.jsx


import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Trash2, FileText, Menu,LayoutDashboard } from "lucide-react";
import PropTypes from 'prop-types';
import NotificationDropdown from '../notifications/NotificationDropdown';

// Custom Hook สำหรับจัดการเมนู
const useMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState({});

  const toggleMenu = (postId) => {
    setIsMenuOpen(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return { isMenuOpen, toggleMenu };
};

// Component สำหรับแสดงสถานะ
const StatusBadge = ({ status }) => (
  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
    status === "pending" ? "bg-yellow-100 text-yellow-700" :
    status === "Approved" ? "bg-emerald-100 text-emerald-700" :
    "bg-red-100 text-red-700"
  }`}>
    {status === "pending" ? "รอการอนุมัติ" :
     status === "Approved" ? "อนุมัติแล้ว" :
     "ไม่อนุมัติ"}
  </span>
);

// Component สำหรับแสดงปุ่มการกระทำ (รวมปุ่มเอกสาร)
const TableActions = React.memo(({ post, currentUser, onApprove, onReject, onView, onDelete, onViewPDF }) => (
  <div className="flex justify-start sm:justify-center space-x-2">
    {currentUser && currentUser.role === "dean" && (
      <>
        <button
          onClick={() => onApprove(post)}
          className="p-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
          title="อนุมัติ"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={() => onReject(post)}
          className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
          title="ปฏิเสธ"
        >
          <X className="w-4 h-4" />
        </button>
      </>
    )}
    <button
      onClick={() => onView(post)}
      className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
      title="ดูรายละเอียด"
    >
      <Eye className="w-4 h-4" />
    </button>
    <button
      onClick={() => onViewPDF(post)}
      className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
      title="เอกสาร"
    >
      <FileText className="w-4 h-4" />
    </button>
    {post.status !== "Approved" && (
      <button
        onClick={() => onDelete(post)}
        className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 transition-colors"
        title="ลบ"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )}
  </div>
));

// Component หลัก
const PostsTable = ({ 
  currentPosts, 
  currentUser, 
  onApprove, 
  onReject, 
  onView, 
  onDelete, 
  onViewPDF,
  onNavigateToPostsDashboard,
  currentPage,    
  setCurrentPage,  
  onChangeView,
}) => {
  const { isMenuOpen, toggleMenu } = useMenu();
  const [selectedPost, setSelectedPost] = useState(null);
  
// เพิ่มฟังก์ชันนำทางจากการแจ้งเตือน
const handleNavigateFromNotification = ({ page, postId }) => {
  // คำนวณหน้าที่ถูกต้องจาก postId 
  const postIndex = currentPosts.findIndex(post => post._id === postId);
  
  if (postIndex === -1) {
    // ถ้าไม่พบโพสต์ในหน้าปัจจุบัน
    if (setCurrentPage && page !== currentPage) {
      setCurrentPage(page); // ใช้หน้าที่ส่งมาจากการแจ้งเตือน
    }

    // เปลี่ยนวิวกลับไปที่ตารางโพสต์
    if (onChangeView) {
      onChangeView('posts-table');
    }

    // รอให้ DOM อัพเดทแล้วค่อยเลื่อนไปที่โพสต์
    setTimeout(() => {
      const element = document.getElementById(`post-${postId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // เพิ่ม highlight effect
        element.classList.add('bg-yellow-100');
        setTimeout(() => {
          element.classList.remove('bg-yellow-100');
        }, 2000);
      }
    }, 500);
  } else {
    // กรณีพบโพสต์ในหน้าปัจจุบัน scroll ไปที่โพสต์ได้เลย
    const element = document.getElementById(`post-${postId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('bg-yellow-100');
      setTimeout(() => {
        element.classList.remove('bg-yellow-100');
      }, 2000);
    }
  }
};


  const sendToMapping = {
    dean: "คณบดี",
    head: "หัวหน้าภาควิชา",
    director: "ผู้อำนวยการ"
  };

  

  

  return (
    <div className="bg-slate-50 rounded-xl shadow-lg p-4 sm:p-6 relative">
    {/* เพิ่มปุ่มไปยังแดชบอร์ด */}
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">รายการ</h2>
        <div className="flex items-center space-x-4">
        {currentUser && currentUser.id && (
            <NotificationDropdown 
            userId={currentUser.id} 
            onNavigateToPost={handleNavigateFromNotification} 
          />
          )}
          <button 
            onClick={onNavigateToPostsDashboard}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
            title="ไปยังแดชบอร์ด"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* แสดงผลบนจอขนาดใหญ่ */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-300/80">
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">ชื่อเต็ม</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">เรียนถึง</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-slate-600">จํานวนเงินที่ขอเบิก</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-slate-600">สถานะ</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-slate-600">การกระทำ</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                  {currentPosts.map((post) => (
                  <tr 
                    key={post._id} 
                    id={`post-${post._id}`} // เพิ่ม id เพื่อการค้นหาและเลื่อนไปยังรายการ
                    className="hover:bg-white/50 transition-colors"
                  >
                <td className="px-6 py-4">
                  <a href={`/viewPost?id=${post._id}`} className="cursor-pointer">
                    <div className="font-medium text-slate-800">{post.fullname}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(post.updatedAt).toLocaleString('th-TH')}
                    </div>
                  </a>
                </td>
                <td className="px-6 py-4 text-slate-600">{sendToMapping[post.sendTo]}</td>
                <td className="px-6 py-4 text-slate-600 text-center">{`${post.total_budget.toLocaleString('th-TH')} บาท`}</td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={post.status} />
                </td>
                <td className="px-6 py-4 text-center">  
                  <TableActions 
                    post={post} 
                    currentUser={currentUser} 
                    onApprove={onApprove} 
                    onReject={onReject} 
                    onView={onView} 
                    onDelete={onDelete} 
                    onViewPDF={onViewPDF} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* แสดงผลบนจอขนาดเล็ก */}
      <div className="sm:hidden space-y-4">

        {/* ปุ่ม Dashboard สำหรับ mobile */}
        {currentPosts.map((post) => (
          <div key={post._id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <a href={`/viewPost?id=${post._id}`} className="cursor-pointer">
                  <div className="font-medium text-slate-800">{post.fullname}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(post.updatedAt).toLocaleString('th-TH')}
                  </div>
                </a>
              </div>
              <button
                onClick={() => toggleMenu(post._id)}
                className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">เรียนถึง</span>
                <span className="text-sm text-slate-700">{sendToMapping[post.sendTo]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">จํานวนเงินที่ขอเบิก</span>
                <span className="text-sm text-slate-700">{`${post.total_budget.toLocaleString('th-TH')} บาท`}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">สถานะ</span>
                <StatusBadge status={post.status} />
              </div>
            </div>

            {/* เมนูการกระทำบนมือถือ */}
            {isMenuOpen[post._id] && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <TableActions 
                  post={post} 
                  currentUser={currentUser} 
                  onApprove={onApprove} 
                  onReject={onReject} 
                  onView={onView} 
                  onDelete={onDelete} 
                  onViewPDF={onViewPDF} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

PostsTable.propTypes = {
  currentPosts: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewPDF: PropTypes.func.isRequired,
  onNavigateToPostsDashboard: PropTypes.func.isRequired, // อัปเดตชื่อ prop type
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  onChangeView: PropTypes.func, // เพิ่ม prop type นี้
  posts: PropTypes.array.isRequired, // เพิ่ม prop type นี้
  
};

export default PostsTable;