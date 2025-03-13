//PDFDownloadButton.tsx

import React, { useEffect, useState } from 'react';
import { MdFileDownload } from 'react-icons/md';

// LoadingButton component แยกออกมาเพื่อความสะอาดของโค้ด
const LoadingButton = () => (
  <button type="button" disabled className="flex items-center gap-1 text-gray-400 cursor-not-allowed">
    <MdFileDownload size={20} />
    กำลังเตรียมเอกสาร...
  </button>
);

interface PDFDownloadButtonProps {
  post: any;  // Using any to simplify this example
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ post }) => {
  const [isClient, setIsClient] = useState(false);
  const [PDFWrapper, setPDFWrapper] = useState<React.ComponentType<any> | null>(null);
  

  useEffect(() => {
    // Set isClient on mount
    setIsClient(true);
    
    // Load the PDF components only on client-side
    if (typeof window !== 'undefined') {
      const loadPDF = async () => {
        try {
          const module = await import('./PDFDownloadLinkWrapper');
          setPDFWrapper(() => module.default);
        } catch (err) {
          console.error('Failed to load PDF component:', err);
        }
      };
      loadPDF();
    }
  }, []);
  // แสดงปุ่มโหลดถ้ายังไม่ได้อยู่ฝั่ง client หรือไม่มีข้อมูล post หรือ component ยังไม่โหลดเสร็จ
  if (!isClient || !post || Object.keys(post).length === 0 || !PDFWrapper) {
    return <LoadingButton />;
  }
  
  // เมื่ออยู่ฝั่ง client และมีข้อมูล post พร้อมแล้ว
  return <PDFWrapper post={post} />;
};

export default PDFDownloadButton;