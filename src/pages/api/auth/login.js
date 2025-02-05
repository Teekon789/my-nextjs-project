import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/user';
import Session from '../../../models/session';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { randomUUID } from 'crypto';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, password } = req.body;

    // ตรวจสอบ IP และจำนวนการพยายามล็อกอิน
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const loginAttempt = await checkLoginAttempts(clientIp, username);
    
    if (loginAttempt.blocked) {
      return res.status(429).json({ 
        message: 'มีการล็อกอินผิดพลาดหลายครั้ง กรุณาลองใหม่อีกครั้งหลังจาก 15 นาที'
      });
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบหรือไม่
    const user = await User.findOne({ username });
    if (!user) {
      await recordFailedLogin(clientIp, username);
      return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await recordFailedLogin(clientIp, username);
      return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // ตรวจสอบว่ามี Session อยู่แล้วหรือไม่
    const existingSession = await Session.findOne({ 
      userId: user._id, 
      isActive: true 
    });

    if (existingSession) {
      return res.status(403).json({ 
        message: 'มีการล็อกอินอยู่แล้วในอุปกรณ์อื่น กรุณาออกจากระบบก่อน' 
      });
    }

    // สร้าง Session
    const sessionId = randomUUID();
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({ 
      id: user._id, 
      sessionId: sessionId,
      globalInvalidationToken: user.globalInvalidationToken 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret);

    await Session.create({
      userId: user._id,
      sessionId: sessionId,
      ip: clientIp,
      isActive: true,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 ชั่วโมง
    });

    // คืนค่า Token และข้อมูลผู้ใช้
    res.status(200).json({
      token: token,
      sessionId: sessionId,
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

// ฟังก์ชันตรวจสอบการพยายามล็อกอิน
async function checkLoginAttempts(ip, username) {
  const loginAttempts = await Session.find({
    ip: ip,
    username: username,
    isSuccessful: false,
    createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) }
  });

  return {
    blocked: loginAttempts.length >= 5,
    attempts: loginAttempts.length
  };
}

// บันทึกการล็อกอินที่ล้มเหลว
async function recordFailedLogin(ip, username) {
  await Session.create({
    ip: ip,
    username: username,
    isSuccessful: false,
    createdAt: new Date()
  });
}