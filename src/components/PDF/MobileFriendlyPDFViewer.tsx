import React, { useState, useEffect } from 'react';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';
import { FileIcon, Download, ExternalLink } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

interface PostType {
  pdfUrl?: string;
  document?: string;
  documentUrl?: string;
  title?: string;
  fullname?: string;
  department?: string;
  trip_details?: string;
  trip_type?: string;
  [key: string]: any; // เพิ่มเพื่อรองรับข้อมูลอื่นๆ ที่อาจมีในอนาคต
}

interface MobileFriendlyPDFViewerProps {
  post: PostType;
}

const MobileFriendlyPDFViewer: React.FC<MobileFriendlyPDFViewerProps> = ({ post }) => {
  const [showOptions, setShowOptions] = useState(false);
  const isMobile = useIsMobile();
  const [generatedPdf, setGeneratedPdf] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // ตรวจสอบหา URL ของ PDF ให้ละเอียดขึ้น
  const findPdfUrl = () => {
    // ตรวจสอบทุกค่าที่เป็นไปได้
    const possibleUrls = [post?.pdfUrl, post?.document, post?.documentUrl];
    // กรองเอาเฉพาะค่าที่ไม่เป็น null, undefined หรือ string ว่าง
    const validUrls = possibleUrls.filter(url => url && url.trim() !== '');
    
    // ดูในคอนโซลเพื่อการแก้ไขปัญหา
    console.log('PDF post data:', post);
    console.log('Valid URLs found:', validUrls);
    
    return validUrls.length > 0 ? validUrls[0] : '';
  };
  
  const pdfUrl = findPdfUrl();
  const hasPdfUrl = pdfUrl !== '';

  // ตรวจสอบว่ามีข้อมูลที่จะใช้สร้าง PDF
  const hasPdfContent = post && Object.keys(post).length > 0;
  
  // สร้างชื่อไฟล์ PDF
  const getFileName = () => {
    if (hasPdfUrl) {
      return pdfUrl.split('/').pop() || 'document.pdf';
    }
    // ใช้ชื่อที่มีอยู่ในข้อมูลหรือใช้ชื่อเริ่มต้น
    return post?.fullname ? `${post.fullname}_document.pdf` : 'document.pdf';
  };

  const fileHash = getFileName();

  // สร้าง PDF จากข้อมูลโดยใช้ PDFDocument
  useEffect(() => {
    // ถ้าไม่มี URL แต่มีข้อมูล post ให้สร้าง PDF
    if (!hasPdfUrl && hasPdfContent && !generatedPdf && !isGenerating) {
      const generatePdf = async () => {
        setIsGenerating(true);
        try {
          // สร้าง PDF โดยใช้ PDFDocument
          const blob = await pdf(<PDFDocument post={post} />).toBlob();
          const url = URL.createObjectURL(blob);
          setGeneratedPdf(url);
        } catch (error) {
          console.error('Error generating PDF:', error);
        } finally {
          setIsGenerating(false);
        }
      };
      
      generatePdf();
    }
    
    // ทำความสะอาด URL เมื่อ component unmount
    return () => {
      if (generatedPdf) {
        URL.revokeObjectURL(generatedPdf);
      }
    };
  }, [hasPdfUrl, hasPdfContent, post, generatedPdf, isGenerating]);

  // เปิดด้วย PDF.js
  const openWithPdfJs = () => {
    const urlToOpen = hasPdfUrl ? pdfUrl : generatedPdf;
    if (urlToOpen) {
      const pdfJsUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(urlToOpen)}`;
      window.open(pdfJsUrl, '_blank');
    }
  };

  // เปิด PDF ด้วยแอพเริ่มต้น
  const openWithDefaultApp = () => {
    const urlToOpen = hasPdfUrl ? pdfUrl : generatedPdf;
    if (urlToOpen) {
      window.location.href = urlToOpen;
    }
  };

  // ดาวน์โหลด PDF
  const downloadPdf = () => {
    const urlToDownload = hasPdfUrl ? pdfUrl : generatedPdf;
    if (urlToDownload) {
      const link = document.createElement('a');
      link.href = urlToDownload;
      link.download = fileHash;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // แสดงข้อมูลการดีบัก
  useEffect(() => {
    console.log('Device is mobile:', isMobile);
    console.log('Has PDF URL:', hasPdfUrl);
    console.log('Generated PDF:', generatedPdf);
    console.log('Is generating PDF:', isGenerating);
    console.log('PDF URL found:', pdfUrl);
    console.log('Full post object:', post);
  }, [isMobile, hasPdfUrl, generatedPdf, isGenerating, pdfUrl, post]);

  // ตรวจสอบว่ามี PDF ที่พร้อมใช้งาน
  const hasPdfReady = hasPdfUrl || generatedPdf !== null;

  // สำหรับการแสดงผลบนมือถือ
  if (isMobile) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        {hasPdfReady ? (
          <>
            <div className="text-center mb-4">
              <p className="text-gray-700 mb-2">กรุณาเลือกวิธีเปิดเอกสาร PDF</p>
            </div>
            
            <div 
              onClick={() => setShowOptions(!showOptions)}
              className="my-4 bg-gray-100 rounded-lg p-6 w-full max-w-xs flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-300"
            >
              <FileIcon className="w-16 h-16 text-red-500 mb-4" />
              <span className="text-gray-800 font-medium">เปิดเอกสาร {fileHash}</span>
            </div>
            
            {showOptions && (
              <div className="w-full max-w-xs bg-white shadow-lg rounded-lg p-4 mt-2">
                <div 
                  onClick={openWithPdfJs} 
                  className="flex items-center p-3 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <ExternalLink className="w-5 h-5 mr-3 text-blue-500" />
                  <span>เปิดด้วย PDF.js (แนะนำ)</span>
                </div>
                
                <div 
                  onClick={openWithDefaultApp} 
                  className="flex items-center p-3 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <ExternalLink className="w-5 h-5 mr-3 text-green-500" />
                  <span>เปิดด้วยแอพเริ่มต้น</span>
                </div>
                
                <div 
                  onClick={downloadPdf} 
                  className="flex items-center p-3 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <Download className="w-5 h-5 mr-3 text-gray-500" />
                  <span>ดาวน์โหลด PDF</span>
                </div>
              </div>
            )}
          </>
        ) : isGenerating ? (
          <div className="text-center">
            <p className="text-gray-700 mb-4">กำลังสร้างเอกสาร PDF...</p>
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : hasPdfContent ? (
          <div className="text-center">
            <p className="text-gray-700 mb-4">เตรียมสร้างเอกสาร PDF...</p>
            <button 
              onClick={() => setIsGenerating(true)} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              สร้างเอกสาร PDF
            </button>
          </div>
        ) : (
          <div className="text-center bg-yellow-50 p-6 rounded-lg shadow-sm">
            <p className="text-yellow-700 mb-2">พบปัญหาในการโหลดเอกสาร PDF บนมือถือ</p>
            <p className="text-yellow-700 mb-4">ลองวิธีเข้าถึงเอกสารดังนี้:</p>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-800 font-medium mb-2">วิธีแก้ปัญหา:</p>
              <ol className="text-left text-gray-700 pl-5 space-y-2">
                <li>ลองโหลดหน้าเว็บใหม่</li>
                <li>ใช้ปุ่มดาวน์โหลดด้านบนแทนการดูออนไลน์</li>
                <li>ลองเปิดเว็บในแอพเบราว์เซอร์อื่น (Chrome, Safari)</li>
                <li>ตรวจสอบว่าเชื่อมต่ออินเทอร์เน็ตอยู่</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    );
  }

  // สำหรับอุปกรณ์เดสก์ท็อป
  return (
    <div className="w-full h-[600px] my-4">
      {hasPdfReady ? (
        <iframe 
          src={hasPdfUrl ? pdfUrl : generatedPdf || ''}
          className="w-full h-full border-0 rounded-lg shadow-md" 
          title="PDF Viewer"
        />
      ) : isGenerating ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <p className="text-gray-700 mb-4">กำลังสร้างเอกสาร PDF...</p>
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      ) : hasPdfContent ? (
        <PDFViewer className="w-full h-full">
          <PDFDocument post={post} />
        </PDFViewer>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500">ไม่พบเอกสาร PDF</p>
        </div>
      )}
    </div>
  );
};

export default MobileFriendlyPDFViewer;