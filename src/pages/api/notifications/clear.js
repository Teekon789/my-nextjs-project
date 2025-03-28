// src/pages/api/notifications/clear.js
import { connectMongoDB } from '../../../lib/mongodb';
import Notification from '../../../models/notification';

export default async function handler(req, res) {
  await connectMongoDB();

  // รองรับ DELETE method สำหรับล้างการแจ้งเตือน
  if (req.method === 'DELETE') {
    try {
      const { userId, type } = req.query;

      // ตรวจสอบ userId
      if (!userId) {
        return res.status(400).json({ 
          message: 'ต้องระบุ userId' 
        });
      }

      // กรณีล้างการแจ้งเตือนทั้งหมด
      if (!type) {
        const result = await Notification.deleteMany({ 
          recipient: userId 
        });

        return res.status(200).json({
          message: 'ลบการแจ้งเตือนทั้งหมดสำเร็จ',
          deletedCount: result.deletedCount
        });
      }

      // กรณีล้างการแจ้งเตือนตามประเภท
      const result = await Notification.deleteMany({ 
        recipient: userId,
        type: type 
      });

      return res.status(200).json({
        message: `ลบการแจ้งเตือนประเภท ${type} สำเร็จ`,
        deletedCount: result.deletedCount
      });

    } catch (error) {
      console.error('Error clearing notifications:', error);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาดในการลบการแจ้งเตือน', 
        error: error.message 
      });
    }
  }
}