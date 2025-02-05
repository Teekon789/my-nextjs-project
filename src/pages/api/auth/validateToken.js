import dbConnect from '../../../utils/dbConnect';
import Session from '../../../models/session';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token ไม่ถูกต้อง' });
    }

    // ถอดรหัส Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Token หมดอายุ หรือ ไม่ถูกต้อง' });
    }

    // ตรวจสอบว่า Session ยัง Active หรือไม่
    const session = await Session.findOne({
      userId: decoded.id,
      sessionId: decoded.sessionId,
      isActive: true
    });

    if (!session) {
      return res.status(401).json({ message: 'Session หมดอายุหรือไม่ถูกต้อง' });
    }

    // ตรวจสอบว่าหมดอายุหรือยัง
    if (session.expiresAt < new Date()) {
      // ปิด session นี้เลย
      await Session.findOneAndUpdate(
        { sessionId: decoded.sessionId },
        { isActive: false, expiresAt: new Date() }
      );

      return res.status(401).json({ message: 'Session หมดอายุ กรุณาเข้าสู่ระบบใหม่' });
    }

    // Token และ Session ถูกต้อง
    res.status(200).json({ message: 'Token ถูกต้อง', userId: decoded.id });

  } catch (error) {
    console.error('Validate Token Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบ Token' });
  }
}
