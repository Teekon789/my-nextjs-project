import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, password } = req.body;

    // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบหรือไม่
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // สร้าง token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        department: user.department,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}