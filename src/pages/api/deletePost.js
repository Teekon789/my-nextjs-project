import { connectMongoDB } from '../../lib/mongodb';
import Post from '../../models/post';
import mongoose from 'mongoose';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
      try {
        const { postId, userId, userRole } = req.body;
        const post = await Post.findById(postId);
  
        if (!post) {
          return res.status(404).json({ message: 'ไม่พบโพสต์' });
        }
  
        // ถ้าเป็นผู้สร้างโพสต์ - ลบออกจากฐานข้อมูล
        if (post.createdBy.toString() === userId) {
          await Post.findByIdAndDelete(postId);
          return res.status(200).json({ message: 'ลบโพสต์ออกจากระบบสำเร็จ' });
        } 
        
        // ถ้าเป็นผู้อนุมัติ - ซ่อนการแสดงผล
        if (post.sendTo === userRole) {
          await Post.findByIdAndUpdate(postId, {
            'visibility.approver': false
          });
          return res.status(200).json({ message: 'ซ่อนโพสต์สำเร็จ' });
        }
  
        return res.status(403).json({ message: 'ไม่มีสิทธิ์ลบโพสต์นี้' });
  
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }