
import React, { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';

const MobileFriendlyPDFViewer = ({ post }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ทำงานเฉพาะที่ฝั่ง client
    if (typeof window === 'undefined') return;
    
    const generatePdf = async () => {
      try {
        // นำเข้า PDFDocument แบบ dynamic
        const PDFDocument = (await import('./PDFDocument')).default;
        
        // สร้าง PDF blob
        const blob = await pdf(<PDFDocument post={post} />).toBlob();
        
        // สร้าง URL สำหรับ blob
        const url = URL.createObjectURL(blob);
        setUrl(url);
        setIsLoading(false);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้าง PDF:', error);
        setIsLoading(false);
      }
    };

    generatePdf();
    
    // ล้าง URL เมื่อคอมโพเนนต์ถูกนำออก
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [post]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">กำลังโหลดเอกสาร...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <iframe 
          src={url} 
          title="PDF Document" 
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
};

export default MobileFriendlyPDFViewer;