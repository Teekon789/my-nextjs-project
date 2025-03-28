import { connectMongoDB } from '../../../lib/mongodb';
import Notification from '../../../models/notification';

export default async function handler(req, res) {
  // เพิ่ม headers เพื่อระบุ content type
  res.setHeader('Content-Type', 'application/json');

  try {
    await connectMongoDB();

    // รองรับ DELETE method สำหรับลบการแจ้งเตือนรายบุคคล
    if (req.method === 'DELETE') {
      const { notificationId } = req.query;

      // ตรวจสอบ notificationId
      if (!notificationId) {
        return res.status(400).json({ 
          success: false,
          message: 'ต้องระบุ notificationId',
          error: 'Missing notificationId' 
        });
      }

      // ลบการแจ้งเตือน
      const result = await Notification.findByIdAndDelete(notificationId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบการแจ้งเตือนที่ต้องการลบ',
          error: 'Notification not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'ลบการแจ้งเตือนสำเร็จ',
        deletedNotification: result
      });
    } else {
      // หากไม่ใช่ DELETE method
      return res.status(405).json({ 
        success: false,
        message: 'Method Not Allowed',
        error: 'Only DELETE method is supported' 
      });
    }
  } catch (error) {
    // จัดการ error อย่างระมัดระวัง
    return res.status(500).json({ 
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบการแจ้งเตือน', 
      error: error.toString() 
    });
  }
}