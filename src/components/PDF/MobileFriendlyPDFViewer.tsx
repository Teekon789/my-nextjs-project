import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';
import { FileIcon } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

interface PostType {
  pdfUrl?: string;
  document?: string;
  documentUrl?: string;
  title?: string;
}

interface MobileFriendlyPDFViewerProps {
  post: PostType;
}

const MobileFriendlyPDFViewer: React.FC<MobileFriendlyPDFViewerProps> = ({ post }) => {
  // ใช้ hook ที่มีอยู่แล้วสำหรับตรวจสอบว่าเป็นมือถือหรือไม่
  const isMobile = useIsMobile();
  
  // ตรวจสอบว่ามี PDF URL หรือไม่
  const hasPdfUrl = post && (post.pdfUrl || post.document || post.documentUrl);
  const pdfUrl = post?.pdfUrl || post?.document || post?.documentUrl || '';

  // สร้าง URL สำหรับ Google Docs Viewer
  const googleDocsViewerUrl = hasPdfUrl 
    ? `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true` 
    : '';

  // ฟังก์ชันสำหรับเปิด PDF ในแท็บใหม่
  const openPdfInNewTab = () => {
    if (googleDocsViewerUrl) {
      window.open(googleDocsViewerUrl, '_blank');
    }
  };

  // สำหรับการดูเอกสารบนมือถือ
  if (isMobile) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        {hasPdfUrl ? (
          <>
            <div className="text-center mb-4">
              <p className="text-gray-700 mb-2">คลิกที่ไอคอนด้านล่างเพื่อดูเอกสาร PDF</p>
            </div>
            
            <div 
              onClick={openPdfInNewTab}
              className="my-4 bg-gray-100 rounded-lg p-6 w-full max-w-xs flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-300"
            >
              <FileIcon className="w-16 h-16 text-red-500 mb-4" />
              <span className="text-gray-800 font-medium">เปิดเอกสาร PDF</span>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-gray-700">หรือดาวน์โหลดเอกสารได้จากปุ่ม "ดาวน์โหลด PDF" ด้านบน</p>
            </div>
          </>
        ) : (
          <div className="text-center bg-gray-50 p-6 rounded-lg shadow-sm">
            <p className="text-gray-700 mb-2">ไม่สามารถดูเอกสาร PDF ในมือถือได้</p>
            <p className="text-gray-700">กรุณาใช้ปุ่มดาวน์โหลดด้านบนเพื่อดูเอกสาร</p>
          </div>
        )}
      </div>
    );
  }

  // สำหรับอุปกรณ์ที่ไม่ใช่มือถือ แสดง PDF Viewer ตามปกติ
  return (
    <div className="w-full h-[600px] my-4">
      {hasPdfUrl ? (
        <iframe 
          src={googleDocsViewerUrl}
          className="w-full h-full border-0 rounded-lg shadow-md" 
          title="PDF Viewer"
        />
      ) : (
        // กรณีไม่มี URL แต่มี PDFDocument ก็ให้แสดง PDFViewer
        <PDFViewer className="w-full h-full">
          <PDFDocument post={post} />
        </PDFViewer>
      )}
    </div>
  );
};

export default MobileFriendlyPDFViewer;
