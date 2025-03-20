'use client';

import { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';

/**
 * Hook สำหรับจัดการการสร้าง PDF ในฝั่ง Client เท่านั้น
 * เพื่อแก้ปัญหา "Cannot read properties of null (reading 'props')" 
 * ที่เกิดจากการรันโค้ด PDF renderer ใน SSR
 * 
 * @param pdfDocument React element จาก @react-pdf/renderer
 * @param dependencies อาร์เรย์ของค่าที่เมื่อเปลี่ยนแปลงจะทำการสร้าง PDF ใหม่
 * @returns สถานะต่างๆ ของการสร้าง PDF และ URL ของ PDF ที่สร้าง
 */
const useClientPDF = (
  pdfDocument: React.ReactElement | null,
  dependencies: any[] = []
) => {
  // สถานะเก็บ URL ของ PDF ที่สร้าง
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  // สถานะแสดงว่ากำลังสร้าง PDF อยู่หรือไม่
  const [isGenerating, setIsGenerating] = useState(false);
  // สถานะเก็บข้อความข้อผิดพลาด (ถ้ามี)
  const [error, setError] = useState<string | null>(null);
  // สถานะบอกว่าคอมโพเนนต์ถูกโหลดในฝั่ง client แล้วหรือไม่
  const [isClient, setIsClient] = useState(false);

  // ตรวจสอบว่าโค้ดกำลังทำงานบนฝั่ง client หรือไม่
  useEffect(() => {
    setIsClient(true);
  }, []);

  // สร้าง PDF เมื่อคอมโพเนนต์ถูกโหลดในฝั่ง client และมีข้อมูลพร้อม
  useEffect(() => {
    // ดำเนินการต่อเมื่ออยู่ในฝั่ง client และมี document ที่จะสร้าง PDF
    if (isClient && pdfDocument && !isGenerating && !pdfUrl) {
      const generatePdf = async () => {
        setIsGenerating(true);
        setError(null);
        
        try {
          // สร้าง PDF blob
          const blob = await pdf(pdfDocument).toBlob();
          // สร้าง URL จาก blob
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        } catch (err) {
          console.error('เกิดข้อผิดพลาดในการสร้าง PDF:', err);
          setError('ไม่สามารถสร้าง PDF ได้ กรุณาลองใหม่อีกครั้ง');
        } finally {
          setIsGenerating(false);
        }
      };
      
      generatePdf();
    }
    
    // ล้าง URL เมื่อ component unmount หรือเมื่อ dependencies เปลี่ยน
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    };
  }, [isClient, pdfDocument, isGenerating, pdfUrl, ...dependencies]);

  // ฟังก์ชันสำหรับบังคับให้สร้าง PDF ใหม่
  const regeneratePdf = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setError(null);
  };

  return {
    pdfUrl,
    isGenerating,
    error,
    isClient,
    regeneratePdf
  };
};

export default useClientPDF;