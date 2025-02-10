//post.js

import mongoose, { Schema } from "mongoose";

// ล้าง Cache ของโมเดล Post (ถ้ามี)
delete mongoose.connection.models['Post'];

const postSchema = new mongoose.Schema({
  fullname: String , 
  personnel_type: String,
  department: String,
  email: String,
  phone: String,
  fund_source: String,
  contract_number: String,
  allowance: Number,
  accommodation: Number,
  transportation: Number,
  expenses: Number,
  total_budget: Number,
  trip_type: String,
  accommodation_type: String,
  accommodation_days: Number,
  transportation_type: String,
  //วันที่
  date123: Date,
  trip_date: Date,
  departure_date: Date,
  return_date: Date,
  //วันที่
  trip_details: String,
  province: String,
  traveler_name: String,
  traveler_name1: String,
  traveler_name2: String,
  traveler_relation: String,
  

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  sendTo: {
    type: String,
    required: true,
    enum: ['dean', 'head', 'director']
  },

  //ฟิลด์ visibility เพื่อควบคุมการแสดงผลแยกตามประเภทผู้
  visibility: {
    creator: { type: Boolean, default: true },
    approver: { type: Boolean, default: true }
  },

  
  travelers: [Object], // สามารถเก็บข้อมูลในรูปแบบ Array ของ Object ได้

  // field createdBy เป็น reference ไปยังโมเดล User
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, 
  creatorName: String,  // เพิ่มชื่อผู้สร้าง
  creatorDepartment: String, // เพิ่มหน่วยงานผู้สร้าง
  sendTo: String,  // ผู้อนุมัติ (dean/head/director)
 

  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  approvedAt: Date,
  comments: String

}, { timestamps: true }

);



const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;


