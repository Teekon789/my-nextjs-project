//user.js
import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'dean', 'head', 'director', 'admin'],
    default: 'user'
  },
  userType: {
    type: String,
    enum: ['อาจารย์', 'เจ้าหน้าที่', 'นักศึกษา', null],
    default: null,
    // required เฉพาะเมื่อ role เป็น user
    required: function() {
      return this.role === 'user';
    }
  },
  fullname: String,
  department: String,
  email: String,
  employeeId: String, // รหัสพนักงาน/รหัสนักศึกษา
  position: String,   // ตำแหน่ง
  faculty: String,    // คณะ
  tel: String        // เบอร์โทรศัพท์
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;