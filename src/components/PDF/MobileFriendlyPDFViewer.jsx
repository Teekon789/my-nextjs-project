import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';

const MobileFriendlyPDFViewer = ({ post }) => {
  // ตรวจสอบว่าเป็นอุปกรณ์มือถือหรือไม่
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // ตรวจสอบว่ามี PDF URL หรือไม่
  const hasPdfUrl = post && (post.pdfUrl || post.document || post.documentUrl);

  // สำหรับการดูเอกสารบนมือถือ
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-white">
        <div className="text-center mb-4">
          <p className="text-lg font-medium text-gray-800">ไม่สามารถดูเอกสาร PDF ในมือถือได้</p>
          <p className="text-sm text-gray-600">กรุณาใช้ปุ่มดาวน์โหลดด้านบนเพื่อดูเอกสาร</p>
        </div>
        
        {/* รูปแสดงไอคอน PDF */}
        <div className="my-4 bg-gray-100 rounded-lg p-6 w-full max-w-xs flex items-center justify-center">
          <svg className="w-20 h-20 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 text-center">เอกสารนี้สามารถดาวน์โหลดได้จากปุ่ม "ดาวน์โหลด PDF" ด้านบน</p>
        
       
        
      </div>
    );
  }

  // สำหรับอุปกรณ์ที่ไม่ใช่มือถือ แสดง PDF Viewer ตามปกติ
  return (
    <div className="w-full h-full">
      {hasPdfUrl ? (
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <PDFDocument post={post} />
        </PDFViewer>
      ) : (
        // กรณีไม่มี URL แต่มี PDFDocument ก็ให้แสดง PDFViewer ไปก่อน
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <PDFDocument post={post} />
        </PDFViewer>
      )}
    </div>
  );
};

export default MobileFriendlyPDFViewer;