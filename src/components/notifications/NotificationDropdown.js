// src/components/notifications/NotificationDropdown.js
import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';

const NotificationDropdown = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const router = useRouter();

  // ดึงการแจ้งเตือน
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

  // มาร์คการแจ้งเตือนว่าอ่านแล้ว
  const markAsRead = async (notification) => {
    try {
      await fetch(`/api/notifications/${notification._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      });

      // นำทางไปยังโพสต์ที่เกี่ยวข้อง
      if (notification.postId) {
        router.push(`/viewPost?id=${notification.postId}`);
      }

      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      
      // ตั้งเวลาดึงการแจ้งเตือนใหม่ทุก 5 วินาที
      const intervalId = setInterval(fetchNotifications, 5000);
      return () => clearInterval(intervalId);
    }
  }, [userId]);

  useEffect(() => {
    // สร้าง socket connection
    const newSocket = io();
    setSocket(newSocket);

    // ลงทะเบียน userId
    newSocket.emit('register', userId);

    // รับการแจ้งเตือนใหม่
    newSocket.on('receiveNotification', (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // รับการรีเฟรชโพสต์
    newSocket.on('refreshPosts', (data) => {
      // อาจเพิ่มลอจิกสำหรับการรีเฟรชโพสต์ในอนาคต
      console.log('Post status updated:', data);
    });

    // ล้าง socket เมื่อ component unmount
    return () => newSocket.close();
  }, [userId]);

  // แปลงวันที่ให้อ่านง่าย
  const formatDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMinutes = Math.round((now - notificationDate) / (1000 * 60));

    if (diffMinutes < 1) return 'เมื่อกี้';
    if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes/60)} ชั่วโมงที่แล้ว`;
    return notificationDate.toLocaleDateString('th-TH');
  };

  // เลือกไอคอนตามประเภทการแจ้งเตือน
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'post_approved': 
        return <Check className="text-green-500" />;
      case 'post_rejected': 
        return <X className="text-red-500" />;
      default: 
        return <Bell className="text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
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
                className={`p-4 flex items-center hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => markAsRead(notification)}
              >
                <div className="mr-3">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(notification.createdAt)}
                  </p>
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