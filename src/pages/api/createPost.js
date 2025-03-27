import { connectMongoDB } from '../../lib/mongodb';
import Post from '../../models/post';
import Notification from '../../models/notification'; // นำเข้า Model การแจ้งเตือน
import User from '../../models/user'; // นำเข้า Model ผู้ใช้เพื่อค้นหาผู้รับ
import mongoose from 'mongoose';

export default async function handler(req, res) {
  // เชื่อมต่อ MongoDB
  try {
    await connectMongoDB();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return res.status(500).json({ message: 'Failed to connect to MongoDB', error: error.message });
  }

  // Handle GET request to fetch all posts
  if (req.method === 'GET') {
    try {
      const posts = await Post.find({}); // ดึงข้อมูลทั้งหมดจากฐานข้อมูล
      return res.status(200).json(posts); // ส่งข้อมูลกลับไปยังผู้ใช้
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Handle POST request to create a new post
  else if (req.method === 'POST') {
    try {
      console.log('Received data:', req.body);
  
      // Validate required fields
      const { fullname, email, sendTo, createdBy } = req.body;
      if (!fullname || !email || !sendTo || !createdBy) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          required: ['fullname', 'email', 'sendTo', 'createdBy']
        });
      }
  
      // สร้างโพสต์ใหม่
      const newPost = new Post(req.body);
      const savedPost = await newPost.save();
      console.log('Saved post:', savedPost);

      // ค้นหาผู้ใช้ที่ตรงกับ sendTo เพื่อส่งการแจ้งเตือน
      const recipientUser = await User.findOne({ role: sendTo });
      
      if (recipientUser) {
        // สร้างการแจ้งเตือนใหม่
        const notification = new Notification({
          recipient: recipientUser._id,
          sender: createdBy,
          type: 'new_submission',
          message: `มีคำขอใหม่จาก ${fullname} รอการอนุมัติ`,
          post: savedPost._id,
          read: false
        });

        await notification.save();
      }
  
      return res.status(201).json(savedPost);
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ 
        message: 'Error creating post', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      });
    }
  }

  // Handle PUT request to update a post
  else if (req.method === 'PUT') {
    try {
      // ตรวจสอบว่า _id ถูกต้องหรือไม่
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: 'Invalid or missing _id' });
      }

      // อัปเดตโพสต์ตาม _id
      const updatedPost = await Post.findByIdAndUpdate(_id, req.body, { new: true });

      // หากไม่พบโพสต์ ให้ส่งสถานะ 404
      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }

      return res.status(200).json(updatedPost); // ส่งข้อมูลที่อัปเดตกลับไป
    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Handle DELETE request to delete a post
  else if (req.method === 'DELETE') {
    try {
      // ตรวจสอบว่า _id ถูกต้องหรือไม่
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: 'Invalid or missing _id' });
      }

      // ลบโพสต์ตาม _id
      const deletedPost = await Post.findByIdAndDelete(_id);

      // หากไม่พบโพสต์ ให้ส่งสถานะ 404
      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }

      return res.status(204).end(); // ส่งสถานะ 204 No Content เมื่อการลบสำเร็จ
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // จัดการกับเมธอดที่ไม่รองรับ
  else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}