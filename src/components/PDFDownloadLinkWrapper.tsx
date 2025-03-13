// PDFDownloadLinkWrapper.tsx

import React, { useState, useEffect } from 'react';
import { MdFileDownload, MdError } from 'react-icons/md';
import { BlobProvider } from '@react-pdf/renderer';

// Error Component
const ErrorPDFComponent = () => (
  <button disabled className="flex items-center gap-1 text-red-500 cursor-not-allowed">
    <MdError size={20} />
    ไม่สามารถโหลด PDF ได้ กรุณาลองใหม่อีกครั้ง
  </button>
);

interface PDFDownloadLinkWrapperProps {
  post: any; 
}

const PDFDownloadLinkWrapper: React.FC<PDFDownloadLinkWrapperProps> = ({ post }) => {
  const [PDFComponent, setPDFComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // ก่อนโหลด PDF Component ให้ set up crypto polyfill ก่อน
    const setupCrypto = async () => {
      // ตรวจสอบว่าอยู่ใน client side
      if (typeof window !== 'undefined') {
        try {
          // โหลด crypto-browserify เพื่อใช้แทน crypto ที่หายไปใน browser
          if (!window.crypto.subtle) {
            // ถ้าไม่มี crypto.subtle ให้โหลด polyfill
            const { default: cryptoBrowserify } = await import('crypto-browserify');
            
            // ตรวจสอบและเพิ่ม SHA224 ถ้าไม่มี
            if (cryptoBrowserify && (!cryptoBrowserify.SHA224)) {
              const { default: sha } = await import('sha.js');
              cryptoBrowserify.SHA224 = sha('sha224');
            }
            
            // ตั้งค่า global crypto ถ้าจำเป็น
            if (!window.crypto) {
              Object.defineProperty(window, 'crypto', {
                value: cryptoBrowserify,
                writable: true
              });
            }
          }
          
          // หลังจาก setup crypto แล้วค่อยโหลด PDF component
          const module = await import('@/components/PDF/TravelPDF');
          setPDFComponent(() => module.default);
        } catch (err) {
          console.error('Failed to load crypto or TravelPDF component:', err);
          setError(true);
        }
      }
    };
    
    setupCrypto();
  }, []);

  if (error) {
    return <ErrorPDFComponent />;
  }

  if (!post || Object.keys(post).length === 0 || !PDFComponent) {
    return (
      <button disabled className="flex items-center gap-1 text-gray-400 cursor-not-allowed">
        <MdFileDownload size={20} />
        กำลังเตรียมเอกสาร...
      </button>
    );
  }

  return (
    <BlobProvider document={<PDFComponent post={post} />}>
      {({ blob, url, loading, error }) => {
        if (loading || !url) {
          return (
            <button disabled className="flex items-center gap-1 text-gray-400 cursor-not-allowed">
              <MdFileDownload size={20} />
              กำลังโหลด...
            </button>
          );
        }

        if (error || !blob) {
          return <ErrorPDFComponent />;
        }

        const fileName = `travel_details_${post.fullname || 'document'}.pdf`;

        return (
          <a
            href={url}
            download={fileName}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-all"
          >
            <MdFileDownload size={20} />
            ดาวน์โหลด PDF
          </a>
        );
      }}
    </BlobProvider>
  );
};

export default PDFDownloadLinkWrapper;