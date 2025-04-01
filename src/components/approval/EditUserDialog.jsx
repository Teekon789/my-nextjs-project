import React, { useState, useEffect, useRef } from 'react';
import { FaRegSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaBuilding, FaBriefcase, FaGraduationCap, FaIdCard, FaUserTag } from 'react-icons/fa';

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
  
  // เพิ่ม animation state
  const [showAnimation, setShowAnimation] = useState(false);
  
  // เพิ่ม ref เพื่อตรวจสอบว่า component ได้ mount แล้วหรือยัง
  const isMounted = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
      isMounted.current = true;
    } else {
      setShowAnimation(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentUser && isMounted.current) {
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
    
    if (!userData.fullname?.trim()) {
      newErrors.fullname = 'กรุณากรอกชื่อ-นามสกุล';
    }

    if (!userData.email?.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
    }

    if (!userData.tel?.trim()) {
      newErrors.tel = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!/^\d{9,10}$/.test(userData.tel.replace(/[-\s]/g, ''))) {
      newErrors.tel = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (9-10 หลัก)';
    }

    if (!userData.department?.trim()) {
      newErrors.department = 'กรุณากรอกภาควิชา/หน่วยงาน';
    }

    if (!userData.position?.trim()) {
      newErrors.position = 'กรุณากรอกตำแหน่ง';
    }

    if (!userData.faculty?.trim()) {
      newErrors.faculty = 'กรุณากรอกคณะ';
    }

    if (!userData.userType) {
      newErrors.userType = 'กรุณาเลือกประเภทผู้ใช้งาน';
    }

    if (!userData.employeeId?.trim()) {
      newErrors.employeeId = 'กรุณากรอกรหัสพนักงาน/รหัสนักศึกษา';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // แยกส่วนการจัดการสำหรับ input text และ select
  const handleTextInputChange = (e) => {
    const { name, value } = e.target;
    
    setUserData((prevData) => {
      const newData = { ...prevData, [name]: value };
      console.log(`Updated ${name} to: "${value}"`, newData);
      return newData;
    });
    
    // ล้าง error เมื่อผู้ใช้เริ่มพิมพ์
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", userData);
    if (validateForm()) {
      onSave(userData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto transform ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        } transition-all duration-300 ease-in-out`}
      >
        {/* ส่วนหัวของ Dialog */}
        <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-orange-500 to-orange-400 rounded-t-xl">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FaUser className="mr-2" /> แก้ไขข้อมูลส่วนตัว
          </h2>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200"
            type="button"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* ส่วนฟอร์มข้อมูล */}
        <div className="max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="col-span-1 md:col-span-2 bg-orange-50 p-4 rounded-lg border border-orange-100 shadow-sm">
                {/* ชื่อ-นามสกุล */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อ-นามสกุล {errors.fullname && <span className="text-orange-500">*</span>}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500 group-hover:text-orange-600 transition-colors duration-200">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="fullname"
                      value={userData.fullname}
                      onChange={handleTextInputChange}
                      className={`w-full pl-10 pr-3 py-2.5 border-2 ${
                        errors.fullname ? 'border-orange-300 bg-orange-50' : 'border-gray-200 group-hover:border-orange-300'
                      } rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                      bg-white shadow-sm transition-all duration-200`}
                      placeholder="ชื่อ-นามสกุล"
                    />
                  </div>
                  {errors.fullname && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.fullname}</p>}
                </div>
              </div>

              {/* อีเมล */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล {errors.email && <span className="text-orange-500">*</span>}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500 group-hover:text-orange-600 transition-colors duration-200">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleTextInputChange}
                    className={`w-full pl-10 pr-3 py-2.5 border-2 ${
                      errors.email ? 'border-orange-300 bg-orange-50' : 'border-gray-200 group-hover:border-orange-300'
                    } rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                    bg-white shadow-sm transition-all duration-200`}
                    placeholder="อีเมล"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.email}</p>}
              </div>

              {/* เบอร์โทรศัพท์ */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทรศัพท์ {errors.tel && <span className="text-orange-500">*</span>}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500 group-hover:text-orange-600 transition-colors duration-200">
                    <FaPhone />
                  </div>
                  <input
                    type="text"
                    name="tel"
                    value={userData.tel}
                    onChange={handleTextInputChange}
                    className={`w-full pl-10 pr-3 py-2.5 border-2 ${
                      errors.tel ? 'border-orange-300 bg-orange-50' : 'border-gray-200 group-hover:border-orange-300'
                    } rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                    bg-white shadow-sm transition-all duration-200`}
                    placeholder="เบอร์โทรศัพท์"
                  />
                </div>
                {errors.tel && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.tel}</p>}
              </div>

              {/* ภาควิชา/หน่วยงาน */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ภาควิชา/หน่วยงาน {errors.department && <span className="text-orange-500">*</span>}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500 group-hover:text-orange-600 transition-colors duration-200">
                    <FaBuilding />
                  </div>
                  <input
                    type="text"
                    name="department"
                    value={userData.department}
                    onChange={handleTextInputChange}
                    className={`w-full pl-10 pr-3 py-2.5 border-2 ${
                      errors.department ? 'border-orange-300 bg-orange-50' : 'border-gray-200 group-hover:border-orange-300'
                    } rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                    bg-white shadow-sm transition-all duration-200`}
                    placeholder="ภาควิชา/หน่วยงาน"
                  />
                </div>
                {errors.department && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.department}</p>}
              </div>

              {/* ตำแหน่ง */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ตำแหน่ง {errors.position && <span className="text-orange-500">*</span>}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500 group-hover:text-orange-600 transition-colors duration-200">
                    <FaBriefcase />
                  </div>
                  <input
                    type="text"
                    name="position"
                    value={userData.position}
                    onChange={handleTextInputChange}
                    className={`w-full pl-10 pr-3 py-2.5 border-2 ${
                      errors.position ? 'border-orange-300 bg-orange-50' : 'border-gray-200 group-hover:border-orange-300'
                    } rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                    bg-white shadow-sm transition-all duration-200`}
                    placeholder="ตำแหน่ง"
                  />
                </div>
                {errors.position && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.position}</p>}
              </div>

              {/* คณะ */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  คณะ {errors.faculty && <span className="text-orange-500">*</span>}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500 group-hover:text-orange-600 transition-colors duration-200">
                    <FaGraduationCap />
                  </div>
                  <input
                    type="text"
                    name="faculty"
                    value={userData.faculty}
                    onChange={handleTextInputChange}
                    className={`w-full pl-10 pr-3 py-2.5 border-2 ${
                      errors.faculty ? 'border-orange-300 bg-orange-50' : 'border-gray-200 group-hover:border-orange-300'
                    } rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                    bg-white shadow-sm transition-all duration-200`}
                    placeholder="คณะ"
                  />
                </div>
                {errors.faculty && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.faculty}</p>}
              </div>
              
              {/* ส่วน Dropdown ประเภทผู้ใช้ */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ประเภทผู้ใช้งาน {errors.userType && <span className="text-orange-500">*</span>}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500 group-hover:text-orange-600 transition-colors duration-200">
                    <FaUserTag />
                  </div>
                  <select
                    name="userType"
                    value={userData.userType}
                    onChange={handleTextInputChange}
                    className={`w-full pl-10 pr-10 py-2.5 border-2 ${
                      errors.userType ? 'border-orange-300 bg-orange-50' : 'border-gray-200 group-hover:border-orange-300'
                    } rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200
                    appearance-none bg-white shadow-sm transition-all duration-200`}
                  >
                    <option value="">เลือกประเภทผู้ใช้งาน</option>
                    <option value="อาจารย์">อาจารย์</option>
                    <option value="เจ้าหน้าที่">เจ้าหน้าที่</option>
                    <option value="นักศึกษา">นักศึกษา</option>
                  </select>
                  {/* ไอคอนลูกศรสำหรับ dropdown */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-orange-500 group-hover:text-orange-600 transition-colors duration-200">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {errors.userType && (
                  <p className="mt-1 text-xs text-orange-500 font-medium">{errors.userType}</p>
                )}
              </div>
              
              {/* รหัสพนักงาน/รหัสนักศึกษา */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสพนักงาน/รหัสนักศึกษา {errors.employeeId && <span className="text-orange-500">*</span>}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-orange-500 group-hover:text-orange-600 transition-colors duration-200">
                    <FaIdCard />
                  </div>
                  <input
                    type="text"
                    name="employeeId"
                    value={userData.employeeId}
                    onChange={handleTextInputChange}
                    className={`w-full pl-10 pr-3 py-2.5 border-2 ${
                      errors.employeeId ? 'border-orange-300 bg-orange-50' : 'border-gray-200 group-hover:border-orange-300'
                    } rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                    bg-white shadow-sm transition-all duration-200`}
                    placeholder="รหัสพนักงาน/รหัสนักศึกษา"
                  />
                </div>
                {errors.employeeId && <p className="mt-1 text-xs text-orange-500 font-medium">{errors.employeeId}</p>}
              </div>
            </div>

            {/* ส่วนปุ่มกดด้านล่าง */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 pt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border-2 border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 font-medium w-full sm:w-auto"
              >
                <span className="flex items-center justify-center">
                  <FaTimes className="mr-2" /> ยกเลิก
                </span>
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg hover:shadow-lg hover:from-orange-600 hover:to-orange-500 active:scale-95 transition-all duration-200 font-medium w-full sm:w-auto"
              >
                <span className="flex items-center justify-center">
                  <FaRegSave className="mr-2" /> บันทึกข้อมูล
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserDialog;