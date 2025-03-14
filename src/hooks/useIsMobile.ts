import { useState, useEffect } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // ฟังก์ชันตรวจสอบความกว้างของหน้าจอ
    const checkIfMobile = () => {
      const mobileBreakpoint = 768; // กำหนด breakpoint สำหรับมือถือ
      setIsMobile(window.innerWidth <= mobileBreakpoint);
    };

    // เรียกฟังก์ชันครั้งแรกเมื่อโหลด component
    checkIfMobile();

    // เพิ่ม event listener สำหรับการ resize หน้าจอ
    window.addEventListener('resize', checkIfMobile);

    // Cleanup event listener เมื่อ component unmount
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
};

export default useIsMobile;