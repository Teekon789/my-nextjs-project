//create-user.js

import dbConnect from '../../utils/dbConnect';
import User from '../../models/user';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { 
      username, 
      password, 
      fullname, 
      department, 
      email, 
      role,
      userType,      // เพิ่ม userType
      employeeId,    // เพิ่มข้อมูลเพิ่มเติม
      position,
      faculty,
      tel
    } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!username || !password || !fullname || !email || !role) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'รูปแบบอีเมลไม่ถูกต้อง' });
    }

    try {
      // ตรวจสอบว่ามีผู้ใช้ชื่อนี้อยู่แล้วหรือไม่
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // สร้างผู้ใช้ใหม่
      const newUser = new User({
        username,
        password: hashedPassword,
        fullname,
        department,
        email,
        role,
        userType: role === 'user' ? userType : null,  // กำหนด userType เฉพาะเมื่อเป็น role user
        employeeId,
        position,
        faculty,
        tel
      });


      // บันทึกผู้ใช้ใหม่
      await newUser.save();

      // ส่ง response กลับไปยัง client
      res.status(201).json({ 
        message: 'สร้างผู้ใช้ใหม่สำเร็จ', 
        user: { username, fullname, email, role } 
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}