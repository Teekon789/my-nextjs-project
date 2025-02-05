import mongoose from 'mongoose';


const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  ip: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }
  },
  globalInvalidationToken: {
    type: String,
    default: null
  },
  globalInvalidationTimestamp: {
    type: Date,
    default: null
  },
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ส่งสัญญาณจากเซิร์ฟเวอร์ไปยัง client
sessionSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    // ส่งข้อความไปยังทุกอุปกรณ์ที่มีการเชื่อมต่ออยู่
    const io = global.io; // ตั้งค่า global io instance สำหรับการใช้ในทุกฟังก์ชัน
    io.to(doc.userId.toString()).emit('sessionDeleted', {
      message: 'Your session has been deleted. Please log in again.',
    });
  }
});



export default mongoose.models.Session || mongoose.model('Session', sessionSchema);
