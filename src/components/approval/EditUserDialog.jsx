// แก้ไข EditUserDialog.jsx
import React, { useState, useEffect } from 'react';
import { FaRegSave, FaTimes } from 'react-icons/fa';

const EditUserDialog = ({ isOpen, onClose, currentUser, onSave }) => {
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    tel: '',
    department: '',
    position: '',
    faculty: '',
    userType: '',
    employeeId: ''
  });

  // เพิ่ม state สำหรับ validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      setUserData({
        fullname: currentUser.fullname || '',
        email: currentUser.email || '',
        tel: currentUser.tel || '',
        department: currentUser.department || '',
        position: currentUser.position || '',
        faculty: currentUser.faculty || '',
        userType: currentUser.userType || '',
        employeeId: currentUser.employeeId || ''
      });
    }
  }, [currentUser]);

  // ฟังก์ชันตรวจสอบข้อมูล
  const validateForm = () => {
    const newErrors = {};
    
    // ตรวจสอบชื่อ-นามสกุล
    if (!userData.fullname?.trim()) {
      newErrors.fullname = 'กรุณากรอกชื่อ-นามสกุล';
    }

    // ตรวจสอบอีเมล
    if (!userData.email?.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
    }

    // ตรวจสอบเบอร์โทรศัพท์
    if (!userData.tel?.trim()) {
      newErrors.tel = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!/^\d{9,10}$/.test(userData.tel.replace(/[-\s]/g, ''))) {
      newErrors.tel = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (9-10 หลัก)';
    }

    // ตรวจสอบภาควิชา/หน่วยงาน
    if (!userData.department?.trim()) {
      newErrors.department = 'กรุณากรอกภาควิชา/หน่วยงาน';
    }

    // ตรวจสอบตำแหน่ง
    if (!userData.position?.trim()) {
      newErrors.position = 'กรุณากรอกตำแหน่ง';
    }

    // ตรวจสอบคณะ
    if (!userData.faculty?.trim()) {
      newErrors.faculty = 'กรุณากรอกคณะ';
    }

    // ตรวจสอบประเภทผู้ใช้งาน
    if (!userData.userType) {
      newErrors.userType = 'กรุณาเลือกประเภทผู้ใช้งาน';
    }

    // ตรวจสอบรหัสพนักงาน/รหัสนักศึกษา
    if (!userData.employeeId?.trim()) {
      newErrors.employeeId = 'กรุณากรอกรหัสพนักงาน/รหัสนักศึกษา';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    // ล้าง error เมื่อผู้ใช้เริ่มพิมพ์
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(userData);
    }
  };

  // สร้าง Input component ที่มี error handling
  const Input = ({ label, name, type = "text", value, error, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {error && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-auto animate-fadeIn overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-800">แก้ไขข้อมูลส่วนตัว</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input
                label="ชื่อ-นามสกุล"
                name="fullname"
                value={userData.fullname}
                onChange={handleChange}
                error={errors.fullname}
                placeholder="ชื่อ-นามสกุล"
              />
            </div>
            <Input
              label="อีเมล"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="อีเมล"
            />
            <Input
              label="เบอร์โทรศัพท์"
              name="tel"
              value={userData.tel}
              onChange={handleChange}
              error={errors.tel}
              placeholder="เบอร์โทรศัพท์"
            />
            <Input
              label="ภาควิชา/หน่วยงาน"
              name="department"
              value={userData.department}
              onChange={handleChange}
              error={errors.department}
              placeholder="ภาควิชา/หน่วยงาน"
            />
            <Input
              label="ตำแหน่ง"
              name="position"
              value={userData.position}
              onChange={handleChange}
              error={errors.position}
              placeholder="ตำแหน่ง"
            />
            <Input
              label="คณะ"
              name="faculty"
              value={userData.faculty}
              onChange={handleChange}
              error={errors.faculty}
              placeholder="คณะ"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเภทผู้ใช้งาน {errors.userType && <span className="text-red-500">*</span>}
              </label>
              <select
                name="userType"
                value={userData.userType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.userType ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.userType ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              >
                <option value="">เลือกประเภทผู้ใช้งาน</option>
                <option value="อาจารย์">อาจารย์</option>
                <option value="เจ้าหน้าที่">เจ้าหน้าที่</option>
                <option value="นักศึกษา">นักศึกษา</option>
              </select>
              {errors.userType && (
                <p className="mt-1 text-xs text-red-500">{errors.userType}</p>
              )}
            </div>
            <Input
              label="รหัสพนักงาน/รหัสนักศึกษา"
              name="employeeId"
              value={userData.employeeId}
              onChange={handleChange}
              error={errors.employeeId}
              placeholder="รหัสพนักงาน/รหัสนักศึกษา"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FaTimes className="inline mr-2" /> ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaRegSave className="inline mr-2" /> บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDialog;