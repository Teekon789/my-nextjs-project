import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import { AlertCircle, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import mn_1 from "../logo/mn_1.png";

const Register = () => {
  // สถานะสำหรับจัดการข้อมูลฟอร์มและการควบคุม UI
  const [formData, setFormData] = useState({
    username: '',          // ชื่อผู้ใช้
    fullname: '',         // ชื่อ-นามสกุล
    password: '',         // รหัสผ่าน
    confirmPassword: '',   // ยืนยันรหัสผ่าน
    email: '',            // อีเมล
    userType: '',         // ประเภทผู้ใช้
    employeeId: '',       // รหัสพนักงาน/นักศึกษา
    position: '',         // ตำแหน่ง
    department: '',       // แผนก/ภาควิชา
    faculty: '',          // คณะ
    tel: ''              // เบอร์โทรศัพท์
  });

  // สถานะสำหรับการแสดง/ซ่อนรหัสผ่าน
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // สถานะสำหรับการโหลดและข้อความแจ้งเตือน
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const router = useRouter();

  
  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword ||
        !formData.fullname || !formData.email || !formData.userType) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return false;
    }

    
    // ตรวจสอบความซับซ้อนของรหัสผ่าน
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร และประกอบด้วยตัวอักษรและตัวเลข');
      return false;
    }

     // ตรวจสอบรูปแบบอีเมล
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(formData.email)) {
       setError('รูปแบบอีเมลไม่ถูกต้อง');
       return false;
     }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/create-user', {
        ...formData,
        role: 'user' // กำหนดค่าเริ่มต้นเป็น user
      });

      setSuccess('ลงทะเบียนสำเร็จ กรุณารอการอนุมัติจากผู้ดูแลระบบ');
      
      // รอ 3 วินาทีแล้ว redirect ไปหน้า login
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    value = value.replace(/[^0-9]/g, ""); // ลบอักขระที่ไม่ใช่ตัวเลข
    if (value.length > 3 && value.length <= 6) {
      return value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 6) {
      return value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 10);
    }
    return value;
  };
  
// ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: name === "tel" ? formatPhoneNumber(value) : value,
  }));
};

  const formFields = [
    { label: "ชื่อผู้ใช้ *", name: "username", type: "text", placeholder: "กรอกชื่อผู้ใช้", required: true },
    { label: "ชื่อ-นามสกุล *", name: "fullname", type: "text", placeholder: "กรอกชื่อ-นามสกุล", required: true },
    { label: "รหัสผ่าน *", name: "password", type: "password", placeholder: "กรอกรหัสผ่าน", required: true },
    { label: "ยืนยันรหัสผ่าน *", name: "confirmPassword", type: "password", placeholder: "ยืนยันรหัสผ่าน", required: true },
    { label: "อีเมล *", name: "email", type: "email", placeholder: "กรอกอีเมล", required: true },
    { label: "รหัสพนักงาน/นักศึกษา", name: "employeeId", type: "text", placeholder: "กรอกรหัสพนักงาน/นักศึกษา" },
    { label: "ตำแหน่ง", name: "position", type: "text", placeholder: "กรอกตำแหน่ง" },
    { label: "แผนก/ภาควิชา", name: "department", type: "text", placeholder: "กรอกแผนก/ภาควิชา" },
    { label: "คณะ", name: "faculty", type: "text", placeholder: "กรอกคณะ" },
    { label: "เบอร์โทรศัพท์", name: "tel", type: "tel", placeholder: "กรอกเบอร์โทรศัพท์" }
  ];
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-50 via-amber-50 to-slate-50 py-12">
      {/* พื้นหลังแบบ Blob */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -left-12 -top-12 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute w-96 h-96 -right-12 -bottom-12 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      {/* คอนเทนเนอร์หลัก */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-4"
      >
        <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-300">
          {/* ส่วนหัวและโลโก้ */}
          <div className="text-center mb-8">
            <motion.div 
              className="w-24 h-24 mx-auto mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={mn_1}
                alt="Logo"
                className="w-full h-full object-contain"
                priority
              />
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-800">สมัครสมาชิก</h2>
            <p className="text-gray-600 mt-1">กรอกข้อมูลเพื่อสมัครสมาชิก</p>
          </div>

          {/* แสดงข้อความแจ้งเตือน */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 rounded-lg bg-green-50 text-green-600 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          

          {/* ฟอร์มลงทะเบียน */}
          <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
            
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทผู้ใช้ *</label>
        <select
          name="userType"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          value={formData.userType}
          onChange={handleChange}
        >
          <option value="">เลือกประเภทผู้ใช้</option>
          <option value="อาจารย์">อาจารย์</option>
          <option value="เจ้าหน้าที่">เจ้าหน้าที่</option>
          <option value="นักศึกษา">นักศึกษา</option>
        </select>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {formFields.map(({ label, name, type, placeholder, required }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            value={formData[name]}
            onChange={handleChange}
          />
        </div>
      ))}
      
    </div>
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8">
      <button
        type="button"
        onClick={() => router.push('/')}
        className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
      >
        กลับไปหน้าเข้าสู่ระบบ
      </button>
      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 border border-transparent rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'สมัครสมาชิก'}
      </motion.button>
    </div>
  </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;