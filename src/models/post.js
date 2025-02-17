import mongoose, { Schema } from "mongoose";

// ล้าง Cache ของโมเดล Post (ถ้ามี)
delete mongoose.connection.models['Post'];

const postSchema = new mongoose.Schema({
  fullname: String, // ชื่อ-นามสกุล
  personnel_type: String, // ประเภทบุคลากร
  department: String, // หน่วยงาน
  email: String, // อีเมล
  phone: String, // เบอร์โทรศัพท์
  fund_source: String, // แหล่งเงินทุน
  contract_number: String, // หมายเลขสัญญา
  allowance: Number, // ค่าเบี้ยเลี้ยง
  accommodation: Number, // ที่พัก
  transportation: Number, // ค่าพาหนะ
  expenses: Number, // ค่าใช้จ่ายอื่นๆ
  total_budget: Number, // งบประมาณรวม
  trip_type: String, // ประเภทการเดินทาง
  accommodation_type: String, // ประเภทที่พัก
  accommodation_days: Number, // จำนวนวันที่พัก
  accommodation_quantity: Number, //จำนวนวันที่พัก
  allowance_days: Number, //จำนวนวันเบี้ยเลี้ยง
  allowance_quantity: Number, //จำนวนเบี้ยเลี้ยง
  allowance_type: String, //ประเภทเบี้ยเลี้ยง
  transportation_type: String, // ประเภทพาหนะ
  Vehicle_quantity: Number, //จำนวนพาหนะ
  date123: Date, // วันที่ (ตัวอย่างชื่อฟิลด์)
  trip_date: Date, // วันที่เดินทาง
  departure_date: Date, // วันที่ออก
  return_date: Date, // วันที่กลับ
  trip_details: String, // รายละเอียดการเดินทาง
  province: String, // จังหวัด
  traveler_name: String, // ชื่อผู้เดินทาง
  traveler_name1: String, // ชื่อผู้เดินทางคนที่ 1
  traveler_name2: String, // ชื่อผู้เดินทางคนที่ 2
  traveler_relation: String, // ความสัมพันธ์กับผู้เดินทาง

  // สถานะการอนุมัติ
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"], // รอดำเนินการ, อนุมัติ, ปฏิเสธ
    default: "pending" // ค่าเริ่มต้น: รอดำเนินการ
  },

  // ส่งถึง (ผู้อนุมัติ)
  sendTo: {
    type: String,
    required: true,
    enum: ['dean', 'head', 'director'], // คณบดี, หัวหน้าภาควิชา, ผู้อำนวยการ
  },

  // ควบคุมการแสดงผล
  visibility: {
    creator: { type: Boolean, default: true }, // ผู้สร้างเห็น
    approver: { type: Boolean, default: true } // ผู้อนุมัติเห็น
  },

  // รายชื่อผู้เดินทาง (Array ของ Object)
  travelers: [Object],

  // ข้อมูลผู้สร้าง
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorName: String, // ชื่อผู้สร้าง
  creatorDepartment: String, // หน่วยงานผู้สร้าง

  // ข้อมูลผู้อนุมัติ
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date, // วันที่อนุมัติ
  comments: String // ความคิดเห็นเพิ่มเติม

}, { timestamps: true }); // เพิ่มฟิลด์ createdAt และ updatedAt อัตโนมัติ

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;