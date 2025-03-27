import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'new_submission', 
      'approved', 
      'rejected', 
      'commented'
    ],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// เพิ่ม indexes สำหรับการค้นหา
notificationSchema.index({ recipient: 1, createdAt: -1 }); // สำหรับดึงการแจ้งเตือนของผู้ใช้และเรียงตามเวลา
notificationSchema.index({ post: 1 }); // สำหรับค้นหาการแจ้งเตือนตาม postId
notificationSchema.index({ recipient: 1, read: 1 }); // สำหรับค้นหาการแจ้งเตือนที่ยังไม่ได้อ่าน
notificationSchema.index({ type: 1, createdAt: -1 }); // สำหรับค้นหาตามประเภทและเรียงตามเวลา

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;