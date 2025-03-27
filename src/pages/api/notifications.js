// src/pages/api/notifications.js
import { connectMongoDB } from '../../lib/mongodb';
import Notification from '../../models/notification'; // We'll create this model
import User from '../../models/user';

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === 'POST') {
    try {
      const { 
        recipientId, 
        type, 
        message, 
        postId, 
        senderId 
      } = req.body;

      // สร้างการแจ้งเตือนใหม่
      const notification = new Notification({
        recipient: recipientId,
        sender: senderId,
        type,
        message,
        post: postId,
        read: false
      });

      await notification.save();

      return res.status(201).json({ 
        message: 'Notification created successfully', 
        notification 
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาดในการสร้างการแจ้งเตือน', 
        error: error.message 
      });
    }
  } else if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      // ดึงการแจ้งเตือนของผู้ใช้ โดยเรียงลำดับจากล่าสุด
      const notifications = await Notification.find({ 
        recipient: userId 
      })
      .sort({ createdAt: -1 })
      .populate('sender', 'fullname')
      .populate('post');

      return res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาดในการดึงการแจ้งเตือน', 
        error: error.message 
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { notificationId } = req.query;
      
      // อัปเดตสถานะการอ่านการแจ้งเตือน
      await Notification.findByIdAndUpdate(notificationId, { 
        read: true 
      });

      return res.status(200).json({ 
        message: 'อัปเดตการแจ้งเตือนสำเร็จ' 
      });
    } catch (error) {
      console.error('Error updating notification:', error);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาดในการอัปเดตการแจ้งเตือน', 
        error: error.message 
      });
    }
  }
}