//[id].js
import { connectMongoDB } from '../../../lib/mongodb'; 
import Post from '../../../models/post'; 

export default async function handler(req, res) {
  const { id } = req.query; // ดึง id จาก query string
  
  // ถ้าเป็นคำขอ GET ดึงข้อมูลโพสต์ตาม ID
  if (req.method === 'GET') {
    try {
      await connectMongoDB(); // เชื่อมต่อฐานข้อมูล MongoDB

      // ค้นหาโพสต์ในฐานข้อมูลตาม ID
      const post = await Post.findById(id);

      // ถ้าไม่พบโพสต์ ให้ส่งสถานะ 404 พร้อมข้อความแจ้งเตือน
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // ส่งข้อมูลโพสต์กลับไปในรูปแบบ JSON
      return res.status(200).json(post);
    } catch (error) {
      console.error('Error fetching post:', error); // แสดงข้อผิดพลาดใน console
      return res.status(500).json({ message: 'Server error', error: error.message }); // ส่งข้อผิดพลาดกลับไป
    }
  } 

  // ถ้าเป็นคำขอ PUT ให้ทำการอัปเดตโพสต์
  else if (req.method === 'PUT') {
    try {
      await connectMongoDB(); // เชื่อมต่อฐานข้อมูล MongoDB

      // ตรวจสอบและกำหนดค่า status (ถ้ามีการส่งค่า status)
      const updatedData = { ...req.body };

      // ตรวจสอบว่า status ที่ส่งมาถูกต้องหรือไม่
      if (updatedData.status && !["Pending Approval", "Approved", "Rejected"].includes(updatedData.status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      // อัปเดตข้อมูลโพสต์ในฐานข้อมูลตาม ID และข้อมูลใน req.body
      const updatedPost = await Post.findByIdAndUpdate(id, updatedData, {
        new: true, // ส่งข้อมูลโพสต์ที่อัปเดตแล้วกลับไป
        runValidators: true, // ตรวจสอบความถูกต้องของข้อมูลตาม schema
      });

      // ถ้าไม่พบโพสต์ ให้ส่งสถานะ 404 พร้อมข้อความแจ้งเตือน
      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // ส่งข้อมูลโพสต์ที่อัปเดตแล้วกลับไปในรูปแบบ JSON
      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error); // แสดงข้อผิดพลาดใน console
      return res.status(500).json({ message: 'Server error', error: error.message }); // ส่งข้อผิดพลาดกลับไป
    }
  } 
  
  // ถ้าไม่ใช่คำขอ GET หรือ PUT ให้ส่งสถานะ 405 (Method Not Allowed)
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}