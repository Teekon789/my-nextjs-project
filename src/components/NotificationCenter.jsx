import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// คอมโพเนนต์การแจ้งเตือนหลัก
const NotificationCenter = ({ currentUser, posts }) => {
  // State สำหรับการจัดการการแจ้งเตือน
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // ฟังก์ชันสร้างการแจ้งเตือน
  const generateNotifications = () => {
    const newNotifications = [];

    // แจ้งเตือนการส่งแบบฟอร์มใหม่
    const newPosts = posts.filter(post => post.status === 'pending');
    if (newPosts.length > 0) {
      newNotifications.push({
        id: 'new-forms',
        type: 'info',
        message: `มีแบบฟอร์มรอการอนุมัติ ${newPosts.length} ฉบับ`,
        icon: <AlertTriangle className="text-yellow-500" />
      });
    }

    // แจ้งเตือนการอนุมัติ
    const approvedPosts = posts.filter(post => post.status === 'Approved');
    if (approvedPosts.length > 0) {
      newNotifications.push({
        id: 'approved-forms',
        type: 'success',
        message: `มีแบบฟอร์มที่ได้รับการอนุมัติ ${approvedPosts.length} ฉบับ`,
        icon: <CheckCircle className="text-green-500" />
      });
    }

    // แจ้งเตือนการปฏิเสธ
    const rejectedPosts = posts.filter(post => post.status === 'Rejected');
    if (rejectedPosts.length > 0) {
      newNotifications.push({
        id: 'rejected-forms',
        type: 'error',
        message: `มีแบบฟอร์มที่ถูกปฏิเสธ ${rejectedPosts.length} ฉบับ`,
        icon: <XCircle className="text-red-500" />
      });
    }

    setNotifications(newNotifications);
  };

  // ตรวจสอบและสร้างการแจ้งเตือนเมื่อ posts เปลี่ยนแปลง
  useEffect(() => {
    generateNotifications();
  }, [posts]);

  // ฟังก์ชันลบการแจ้งเตือน
  const removeNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  return (
    <div className="relative">
      {/* ปุ่มการแจ้งเตือน */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
            {notifications.length}
          </span>
        )}
      </button>

      {/* เมนูการแจ้งเตือน */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg border z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">การแจ้งเตือน</h3>
            <button 
              onClick={() => setNotifications([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ล้างทั้งหมด
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              ไม่มีการแจ้งเตือน
            </div>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <li 
                  key={notification.id}
                  className="p-4 border-b flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {notification.icon}
                    <span className="text-sm">{notification.message}</span>
                  </div>
                  <button 
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;