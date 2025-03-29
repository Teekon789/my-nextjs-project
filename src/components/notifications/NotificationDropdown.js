import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Trash2, XCircle } from 'lucide-react';

const NotificationDropdown = ({ userId, onNavigateToPost }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // ฟังก์ชันดึงการแจ้งเตือน
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications?userId=${userId}`);
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // ฟังก์ชันมาร์คการแจ้งเตือนเป็นอ่านแล้ว
  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications?notificationId=${notificationId}`, {
        method: 'PUT'
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // ฟังก์ชันล้างการแจ้งเตือนทั้งหมด
  const clearAllNotifications = async () => {
    try {
      await fetch(`/api/notifications/clear?userId=${userId}`, {
        method: 'DELETE'
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  // ฟังก์ชันลบการแจ้งเตือนรายบุคคล
  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/delete?notificationId=${notificationId}`, {
        method: 'DELETE'
      });
  
      const data = await response.json();
  
      if (!data.success) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการลบการแจ้งเตือน');
      }
  
      // อัปเดตรายการการแจ้งเตือน
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n._id !== notificationId)
      );
  
      // อัปเดต unread count
      setUnreadCount(prev => 
        prev - (notifications.find(n => n._id === notificationId)?.read ? 0 : 1)
      );
    } catch (error) {
      console.error('Error deleting individual notification:', error);
      alert(error.message);
    }
  };

  // เพิ่ม event listener สำหรับคลิกนอกเมื่อ dropdown เปิด
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 10000);
      return () => clearInterval(intervalId);
    }
  }, [userId]);

  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMinutes = Math.round((now - notificationDate) / (1000 * 60));

    if (diffMinutes < 1) return 'เมื่อกี้';
    if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes/60)} ชั่วโมงที่แล้ว`;
    return notificationDate.toLocaleDateString();
  };

  // ฟังก์ชันเลือกไอคอนตามประเภทการแจ้งเตือน
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'new_submission': 
        return <Bell className="text-blue-500 w-6 h-6" />;
      case 'approved': 
        return <Check className="text-emerald-500 w-6 h-6" />;
      case 'rejected': 
        return <X className="text-rose-500 w-6 h-6" />;
      default: 
        return <Bell className="text-gray-500 w-6 h-6" />;
    }
  };

  // จัดการคลิกการแจ้งเตือน
  const handleNotificationClick = async (notification) => {
    await markAsRead(notification._id);
    setIsOpen(false);
    
    if (notification.post?._id) {
      onNavigateToPost({
        postId: notification.post._id
      });
    }
  };

  return (
    <div className="relative">
      {/* ปุ่มการแจ้งเตือน */}
      <button 
        title="การแจ้งเตือน"
        onClick={(e) => {
          e.stopPropagation(); // ป้องกันการปิด dropdown
          setIsOpen(!isOpen);
        }}
        className="relative p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 group"
        aria-label="การแจ้งเตือน"
      >
        <Bell className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown การแจ้งเตือน */}
      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()} // ป้องกันการปิด dropdown เมื่อคลิกภายใน
          className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-[500px] overflow-y-auto z-[100]"
        >
          {/* หัวข้อการแจ้งเตือน */}
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-lg text-gray-800">
              การแจ้งเตือน 
              <span className="text-sm text-blue-600 ml-2">
                ({unreadCount} รายการใหม่)
              </span>
            </h3>
            
            {/* ปุ่มล้างการแจ้งเตือน */}
            {notifications.length > 0 && (
              <button 
                onClick={clearAllNotifications}
                className="text-gray-500 hover:text-rose-600 transition-colors duration-300 tooltip"
                title="ล้างการแจ้งเตือนทั้งหมด"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* รายการการแจ้งเตือน */}
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500 space-y-2">
              <Bell className="mx-auto w-12 h-12 text-gray-300 mb-2" />
              <p>ยังไม่มีการแจ้งเตือน</p>
              <p className="text-xs text-gray-400">คุณจะได้รับการแจ้งเตือนเมื่อมีกิจกรรมใหม่</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification._id}
                className={`p-4 flex items-start hover:bg-gray-50 relative group transition-all duration-300 cursor-pointer 
                  ${!notification.read 
                    ? 'bg-blue-50/50 border-l-4 border-blue-500 hover:bg-blue-50/70' 
                    : 'hover:bg-gray-100'}`}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* ปุ่มลบการแจ้งเตือนรายบุคคล */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id);
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  title="ลบการแจ้งเตือน"
                >
                  <XCircle className="w-4 h-4" />
                </button>

                <div className="flex w-full">
                  <div className="mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                    {notification.post && (
                      <div className="text-xs text-blue-600 mt-1 font-semibold">
                        คลิกเพื่อดูรายละเอียด
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;