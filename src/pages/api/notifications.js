// src/pages/api/notifications.js
import { connectMongoDB } from '../../lib/mongodb';
import Notification from '../../models/notification';
import User from '../../models/user';

export default async function handler(req, res) {
  await connectMongoDB();

  // โค้ดเดิมสำหรับ POST method
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
  } 
  
  // แก้ไข GET method เพื่อเพิ่มการตรวจสอบสิทธิ์
  else if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      // ตรวจสอบว่ามี userId หรือไม่
      if (!userId) {
        return res.status(400).json({ 
          message: 'ต้องระบุ userId' 
        });
      }

      // ดึงการแจ้งเตือนของผู้ใช้ โดยเรียงลำดับจากล่าสุด
      const notifications = await Notification.find({ 
        recipient: userId 
      })
      .sort({ createdAt: -1 })
      .populate('sender', 'fullname')
      .populate('post', 'fullname status');

      return res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาดในการดึงการแจ้งเตือน', 
        error: error.message 
      });
    }
  } 
  
  // โค้ดเดิมสำหรับ PUT method
  else if (req.method === 'PUT') {
    try {
      const { notificationId, postId } = req.query;
      
      // กรณีอัพเดทการแจ้งเตือนเดี่ยว
      if (notificationId) {
        // ตรวจสอบว่ามีการแจ้งเตือนนี้อยู่จริงหรือไม่
        const notification = await Notification.findById(notificationId);
        if (!notification) {
          return res.status(404).json({ 
            message: 'ไม่พบการแจ้งเตือนที่ระบุ' 
          });
        }

        await Notification.findByIdAndUpdate(notificationId, { 
          read: true 
        });

        return res.status(200).json({ 
          message: 'อัปเดตการแจ้งเตือนสำเร็จ' 
        });
      }
      
      // กรณีอัพเดทการแจ้งเตือนทั้งหมดที่เกี่ยวข้องกับโพสต์
      else if (postId) {
        const result = await Notification.updateMany(
          { post: postId },
          { read: true }
        );

        return res.status(200).json({
          message: 'อัปเดตการแจ้งเตือนทั้งหมดสำเร็จ',
          updatedCount: result.modifiedCount
        });
      }

      return res.status(400).json({
        message: 'กรุณาระบุ notificationId หรือ postId'
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