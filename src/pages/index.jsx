//index.jsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


import axios from 'axios';
import { AlertCircle, Lock, User, Loader2, Eye, EyeOff  ,CheckCircle} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import mn_1 from "../logo/mn_1.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";


const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  

  //รีเซต
  const [showResetDialog, setShowResetDialog] = useState(false);
const [isSessionError, setIsSessionError] = useState(false);


const handleSubmit = async (e) => {
  e.preventDefault();

  // ตรวจสอบความถูกต้องของข้อมูล
  if (!formData.username || !formData.password) {
    setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
    return;
  }

  // จำกัดจำนวนครั้งที่ล็อกอินผิดพลาด
  if (loginAttempts >= 5) {
    setError("คุณล็อกอินผิดพลาดเกินจำนวนครั้งที่กำหนด กรุณาลองใหม่ในภายหลัง");
    return;
  }

  setIsLoading(true);
  setError("");

  try {
    const { data } = await axios.post('/api/auth/login', formData);

    // เพิ่มการตรวจสอบ requireLogout
    if (data.requireLogout) {
      // ล้าง local storage
      localStorage.clear();
      
      // ลบ cookies ทั้งหมด
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // แสดงข้อความและ redirect ไปหน้า login
      setError('มีการยกเลิกเซสชันก่อนหน้า กรุณาล็อกอินใหม่');
      router.push('/login');
      return;
    }

    // บันทึก token และข้อมูลผู้ใช้
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // redirect ไปที่หน้า approval
    router.push('/approval');
  } catch (error) {
    setLoginAttempts((prev) => prev + 1);
    const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบโปรดตรวจสอบ ชื่อผู้ใช้หรือรหัสผ่านว่าถูกต้อง แล้วลองเข้สสู่ระบบใหม่';
    setError(errorMessage);

    // เช็คว่าเป็น error จาก session ซ้ำซ้อนหรือไม่
    if (errorMessage === 'มีการล็อกอินอยู่แล้วในอุปกรณ์อื่น กรุณาออกจากระบบก่อน') {
      setIsSessionError(true);
    }
  } finally {
    setIsLoading(false);
  }
};

 // เพิ่ม state สำหรับจัดการสถานะความสำเร็จ
 const [successMessage, setSuccessMessage] = useState('');

 const resetSession = async () => {
  // ตรวจสอบว่ามี username และ password
  if (!formData.username || !formData.password) {
    setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่านก่อนรีเซ็ต Session");
    setShowResetDialog(false);
    return;
  }

  try {
    setIsLoading(true);
    setError("");
    setSuccessMessage(""); // เคลียร์ข้อความสำเร็จเก่า
    
    // เรียก API reset session
    const response = await axios.post('/api/auth/reset-session', {
      username: formData.username,
      password: formData.password
    });

    if (response.data.success) {
      // ล้าง local storage
      localStorage.clear();
      
      // รีเซ็ตฟอร์มและสถานะ
      setFormData({ username: formData.username, password: '' });
      setIsSessionError(false);
      setSuccessMessage("รีเซ็ต Session สำเร็จ กรุณาล็อกอินใหม่"); // ใช้ successMessage แทน error
    } else {
      throw new Error(response.data.message || "ไม่สามารถรีเซ็ต Session ได้");
    }
    
  } catch (error) {
    console.error('Reset error:', error);
    setError(error.response?.data?.message || "เกิดข้อผิดพลาดในการรีเซ็ต Session");
  } finally {
    setIsLoading(false);
    setShowResetDialog(false);
  }
};




  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-50 via-amber-50 to-slate-50">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-96 h-96 -left-12 -top-12 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute w-96 h-96 -right-12 -bottom-12 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
    </div>

    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-4"
    >

      <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-300">
        {/* Logo and Title */}
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
          <h2 className="text-2xl font-semibold text-gray-800">เข้าสู่ระบบ</h2>
          <p className="text-gray-600 mt-1">ยินดีต้อนรับ</p>
        </div>

      {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}
                  <span>  {isSessionError && formData.username && (
                <button
                  onClick={() => setShowResetDialog(true)}
                  className="text-sm text-orange-600 hover:text-orange-700 transition-colors mt-2 text-left underline"
                >
                  คลิกที่นี่เพื่อรีเซ็ต Session
                </button>
              )}</span>
                </p>
              </div>

            
            </motion.div>
          )}

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-lg bg-green-50 text-green-600 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อผู้ใช้
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    autoComplete="username"
                  />

                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg bg-gradient-to-r from-orange-500 
              to-amber-500 text-white font-medium hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-orange-500 disabled:opacity-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'เข้าสู่ระบบ'
              )}
            </motion.button>

            {/* Forgot Password Link */}
            {loginAttempts > 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-4"
              >
                <button
                  onClick={() => router.push('/forgot-password')}
                  className="text-sm text-orange-600 hover:text-orange-700 transition-colors duration-200"
                >
                  ลืมรหัสผ่าน?
                </button>
              </motion.div>
            )}           
          </form>
          <div className="flex flex-col gap-2 text-center mt-4">
            <div className="text-sm text-gray-600">
              ยังไม่มีบัญชี?{' '}
              <button
                onClick={() => router.push('/Register')}
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
              >
                สมัครสมาชิก
              </button>
            </div>
          </div>
        </div>
      </motion.div>


         {/* Alert Dialog for Reset Session Confirmation */}
<AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>ยืนยันการรีเซ็ต Session</AlertDialogTitle>
      <AlertDialogDescription>
        คุณต้องการรีเซ็ตการล็อกอินที่ค้างอยู่ของผู้ใช้ "{formData.username}" ใช่หรือไม่?
        การกระทำนี้จะทำให้ผู้ใช้ที่กำลังใช้งานอยู่ต้องล็อกอินใหม่
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel 
        onClick={() => {
          setShowResetDialog(false);
          setError("");
        }}
      >
        ยกเลิก
      </AlertDialogCancel>
      <AlertDialogAction 
        onClick={resetSession}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'ยืนยัน'
        )}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

      
    </div>
  );
};

export default Login;