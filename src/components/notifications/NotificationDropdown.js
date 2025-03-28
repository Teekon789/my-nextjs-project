import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';

const NotificationDropdown = ({ userId, onNavigateToPost }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
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

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 10000);
      return () => clearInterval(intervalId);
    }
  }, [userId]);

  const formatDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMinutes = Math.round((now - notificationDate) / (1000 * 60));

    if (diffMinutes < 1) return 'เมื่อกี้';
    if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes/60)} ชั่วโมงที่แล้ว`;
    return notificationDate.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'new_submission': 
        return <Bell className="text-blue-500" />;
      case 'approved': 
        return <Check className="text-green-500" />;
      case 'rejected': 
        return <X className="text-red-500" />;
      default: 
        return <Bell className="text-gray-500" />;
    }
  };

  const handleNotificationClick = async (notification) => {
    // มาร์คการแจ้งเตือนว่าอ่านแล้ว
    await markAsRead(notification._id);
    
    // ปิด dropdown
    setIsOpen(false);
    
    // ส่งข้อมูลไปยังฟังก์ชันนำทาง
    if (notification.post?._id) {
      onNavigateToPost({
        postId: notification.post._id
      });
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100"
        aria-label="การแจ้งเตือน"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          <div className="p-4 border-b font-semibold">
            การแจ้งเตือน ({unreadCount} รายการใหม่)
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              ไม่มีการแจ้งเตือน
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification._id}
                className={`p-4 flex items-start hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="mr-3 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(notification.createdAt)}
                  </p>
                  {notification.post && (
                    <div className="text-xs text-blue-600 mt-1">
                      คลิกเพื่อดูรายละเอียด
                    </div>
                  )}
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