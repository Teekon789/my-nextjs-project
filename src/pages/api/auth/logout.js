//logout.js

import dbConnect from '../../../utils/dbConnect';
import Session from '../../../models/session';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];

    try {
      // ถอดรหัส Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ลบ Session
      await Session.findOneAndUpdate(
        { sessionId: decoded.sessionId }, 
        { 
          isActive: false,
          // เพิ่มเวลาหมดอายุทันที
          expiresAt: new Date() 
        }
      );

      res.status(200).json({ message: 'ออกจากระบบสำเร็จ' });
    } catch (error) {
      // กรณี Token หมดอายุหรือไม่ถูกต้อง
      res.status(200).json({ message: 'ออกจากระบบสำเร็จ' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}