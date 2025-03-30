import dbConnect from "../../utils/dbConnect";
import User from "../../models/user";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token ไม่ถูกต้อง" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debug log
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
    }

    // ดึง userId จาก decoded token
    const userId = decoded.sub || decoded._id || decoded.id || decoded.userId;
    console.log("Looking for user with ID:", userId); // Debug log

    if (!userId) {
      console.error("No user ID found in token:", decoded);
      return res.status(400).json({ message: "ไม่พบ ID ผู้ใช้ในtoken" });
    }

    // ค้นหาและอัพเดทผู้ใช้
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: {
          fullname: req.body.fullname,
          email: req.body.email,
          tel: req.body.tel,
          department: req.body.department,
          position: req.body.position,
          faculty: req.body.faculty,
          userType: req.body.userType,
          employeeId: req.body.employeeId
        } 
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    if (!updatedUser) {
      console.error("User not found or update failed for ID:", userId);
      return res.status(404).json({ message: "ไม่พบผู้ใช้หรือไม่สามารถอัพเดทข้อมูลได้" });
    }

    console.log("Successfully updated user:", updatedUser); // Debug log
    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการอัพเดทข้อมูล",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}