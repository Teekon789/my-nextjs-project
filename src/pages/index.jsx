import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AlertCircle, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import mn_1 from "../logo/mn_1.png";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

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

      // บันทึก token และข้อมูลผู้ใช้
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // นำทางผู้ใช้ไปยังหน้า /approval
      router.push('/approval');
    } catch (error) {
      setLoginAttempts((prev) => prev + 1);
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-50 via-amber-50 to-slate-50">
      {/* Background decoration */}
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
                className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
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
              className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-200"
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
        </div>
      </motion.div>
    </div>
  );
};

export default Login;