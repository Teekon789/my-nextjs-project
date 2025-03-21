import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument'; // คอมโพเนนต์สำหรับสร้าง PDF
import { FileIcon, Download, ExternalLink, ChevronDown, Maximize, Minimize, RefreshCw } from 'lucide-react';
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
  trip_date?: string;
  trip_date_end?: string;
  [key: string]: any;
}

interface MobileFriendlyPDFViewerProps {
  post: PostType;
}

const PDF_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const MobileFriendlyPDFViewer: React.FC<MobileFriendlyPDFViewerProps> = ({ post }) => {
  const [showOptions, setShowOptions] = useState(false);
  const isMobile = useIsMobile();
  const [generatedPdf, setGeneratedPdf] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const pdfViewerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const pdfGenerationRef = useRef(false);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => defaultTabs.slice(0, 2),
  });

  const findPdfUrl = useCallback(() => {
    const possibleUrls = [post?.pdfUrl, post?.document, post?.documentUrl];
    return possibleUrls.find(url => url && url.trim() !== '') || '';
  }, [post]);

  const pdfUrl = findPdfUrl();
  const hasPdfUrl = Boolean(pdfUrl);
  const hasPdfContent = Boolean(post && Object.keys(post).length > 0);

  const getFileName = useCallback(() => {
    if (hasPdfUrl) {
      const decodedUrl = decodeURIComponent(pdfUrl);
      return decodedUrl.split('/').pop() || 'document.pdf';
    }
    if (post?.title) return `${post.title.substring(0, 30)}.pdf`;
    if (post?.fullname) return `${post.fullname}_document.pdf`;
    return 'document.pdf';
  }, [hasPdfUrl, pdfUrl, post]);

  const fileHash = getFileName();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const simulateLoading = useCallback((startValue: number = 10, maxValue: number = 90, interval: number = 300) => {
    setLoadingProgress(startValue);
    return setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 10);
        return newProgress < maxValue ? newProgress : maxValue;
      });
    }, interval);
  }, []);

  const generatePdf = useCallback(async () => {
    setIsGenerating(true);
    setPdfError(null);
    try {
      const progressInterval = simulateLoading();
      const blob = await pdf(<PDFDocument post={post} />).toBlob();
      const url = URL.createObjectURL(blob);
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setGeneratedPdf(url);
      setIsPdfLoaded(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError('เกิดข้อผิดพลาดในการสร้าง PDF');
    } finally {
      setIsGenerating(false);
    }
  }, [post, simulateLoading]);

  useEffect(() => {
    if (!hasPdfUrl && hasPdfContent && !generatedPdf && !isGenerating && !pdfGenerationRef.current) {
      pdfGenerationRef.current = true;
      generatePdf();
    } else if (hasPdfUrl && !isPdfLoaded) {
      const loadingInterval = simulateLoading(50, 90, 200);
      const timeout = setTimeout(() => {
        clearInterval(loadingInterval);
        setIsPdfLoaded(true);
        setLoadingProgress(100);
      }, 2000);
      return () => {
        clearInterval(loadingInterval);
        clearTimeout(timeout);
      };
    }
    return () => {
      if (generatedPdf) {
        URL.revokeObjectURL(generatedPdf);
      }
    };
  }, [hasPdfUrl, hasPdfContent, generatedPdf, isGenerating, generatePdf, isPdfLoaded, simulateLoading]);

  useEffect(() => {
    document.body.style.overflow = isFullScreen ? 'hidden' : '';
    if (isFullScreen) window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullScreen]);

  const openWithPdfJs = useCallback(() => {
    const urlToOpen = hasPdfUrl ? pdfUrl : generatedPdf;
    if (urlToOpen) {
      const pdfJsPath = `/pdfjs/web/viewer.html?file=${encodeURIComponent(urlToOpen)}`;
      window.open(pdfJsPath, '_blank');
    }
    setShowOptions(false);
  }, [hasPdfUrl, pdfUrl, generatedPdf]);

  const openWithDefaultApp = useCallback(() => {
    const urlToOpen = hasPdfUrl ? pdfUrl : generatedPdf;
    if (urlToOpen) window.open(urlToOpen, '_blank');
    setShowOptions(false);
  }, [hasPdfUrl, pdfUrl, generatedPdf]);

  const downloadPdf = useCallback(() => {
    const urlToDownload = hasPdfUrl ? pdfUrl : generatedPdf;
    if (urlToDownload) {
      const link = document.createElement('a');
      link.href = urlToDownload;
      link.download = fileHash;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowOptions(false);
  }, [hasPdfUrl, pdfUrl, generatedPdf, fileHash]);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  const retryLoadPdf = useCallback(() => {
    setPdfError(null);
    setIsPdfLoaded(false);
    setLoadingProgress(0);
    pdfGenerationRef.current = false;
    if (hasPdfUrl) {
      setIsPdfLoaded(true);
    } else if (hasPdfContent) {
      generatePdf();
    }
  }, [hasPdfUrl, hasPdfContent, generatePdf]);

  const hasPdfReady = (hasPdfUrl || generatedPdf !== null) && isPdfLoaded;

  const PdfOptions = () => (
    <div ref={optionsRef} className="bg-white shadow-lg rounded-lg p-4 mt-2 border border-gray-200">
      <div onClick={openWithPdfJs} className="flex items-center p-3 hover:bg-gray-100 rounded cursor-pointer">
        <ExternalLink className="w-5 h-5 mr-3 text-blue-500" />
        <span>เปิดด้วย PDF.js ในแท็บใหม่</span>
      </div>
      <div onClick={openWithDefaultApp} className="flex items-center p-3 hover:bg-gray-100 rounded cursor-pointer">
        <ExternalLink className="w-5 h-5 mr-3 text-green-500" />
        <span>เปิดด้วยแอพเริ่มต้น</span>
      </div>
      <div onClick={downloadPdf} className="flex items-center p-3 hover:bg-gray-100 rounded cursor-pointer">
        <Download className="w-5 h-5 mr-3 text-gray-500" />
        <span>ดาวน์โหลด PDF</span>
      </div>
    </div>
  );

  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
      <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${loadingProgress}%` }} />
    </div>
  );

  const renderPdfViewer = useCallback(() => {
    const pdfToShow = hasPdfUrl ? pdfUrl : generatedPdf || '';
    if (!pdfToShow) return null;
    return (
      <Worker workerUrl={PDF_WORKER_URL}>
        <Viewer
          fileUrl={pdfToShow}
          defaultScale={isMobile ? SpecialZoomLevel.PageWidth : SpecialZoomLevel.PageFit}
          plugins={[defaultLayoutPluginInstance]}
          onDocumentLoad={() => {
            setIsPdfLoaded(true);
            setLoadingProgress(100);
          }}
        />
      </Worker>
    );
  }, [hasPdfUrl, pdfUrl, generatedPdf, isMobile, defaultLayoutPluginInstance]);

  const renderLoading = () => (
    <div className={`text-center p-6 ${isMobile ? 'w-full' : 'max-w-md'}`}>
      <p className="text-gray-700 mb-4">กำลังสร้างเอกสาร PDF...</p>
      <ProgressBar />
      <p className="text-sm text-gray-500 mt-2">{loadingProgress}% เสร็จสิ้น</p>
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mt-6"></div>
    </div>
  );

  const renderError = () => (
    <div className={`text-center ${isMobile ? 'bg-red-50 p-6 rounded-lg shadow-sm w-full' : 'p-6 max-w-md'}`}>
      <p className="text-red-700 mb-2">เกิดข้อผิดพลาด: {pdfError}</p>
      <button onClick={retryLoadPdf} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors mt-2 flex items-center mx-auto">
        <RefreshCw className="w-4 h-4 mr-2" />
        ลองใหม่อีกครั้ง
      </button>
    </div>
  );

  const renderInitialScreen = () => (
    <div className={`text-center p-6 ${isMobile ? 'w-full' : 'max-w-md'}`}>
      <p className="text-gray-700 mb-4">เตรียมสร้างเอกสาร PDF</p>
      <button onClick={generatePdf} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
        สร้างเอกสาร PDF
      </button>
    </div>
  );

  const renderNotFound = () => (
    <div className={`text-center ${isMobile ? 'bg-yellow-50 p-6 rounded-lg shadow-sm w-full' : 'p-6 max-w-md'}`}>
      <p className="text-yellow-700 mb-2">ไม่พบเอกสาร PDF</p>
      {isMobile ? (
        <>
          <p className="text-yellow-700 mb-4">ลองวิธีเข้าถึงเอกสารดังนี้:</p>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-800 font-medium mb-2">วิธีแก้ปัญหา:</p>
            <ol className="text-left text-gray-700 pl-5 space-y-2">
              <li>ลองโหลดหน้าเว็บใหม่</li>
              <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
              <li>ลองเปิดในเบราว์เซอร์อื่น (Chrome, Safari)</li>
              <li>ติดต่อผู้ดูแลระบบหากยังไม่สามารถเข้าถึงได้</li>
            </ol>
          </div>
        </>
      ) : (
        <p className="text-gray-700">โปรดตรวจสอบการเชื่อมต่อหรือติดต่อผู้ดูแลระบบ</p>
      )}
    </div>
  );

  const renderToolbar = (title: string) => (
    <div className="w-full bg-gray-100 p-3 flex items-center justify-between sticky top-0 z-10 border-b border-gray-300">
      <div className="flex items-center">
        <FileIcon className="w-5 h-5 text-red-500 mr-2" />
        <span className={`text-gray-800 font-medium truncate ${isMobile ? 'max-w-[150px]' : 'max-w-[400px]'}`}>{title}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={toggleFullScreen} className="p-2 rounded-full hover:bg-gray-200" aria-label={isFullScreen ? "ออกจากโหมดเต็มหน้าจอ" : "โหมดเต็มหน้าจอ"}>
          {isFullScreen ? <Minimize className="w-5 h-5 text-gray-700" /> : <Maximize className="w-5 h-5 text-gray-700" />}
        </button>
        <button onClick={() => setShowOptions(!showOptions)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center">
          <span className="mr-1">{isMobile ? 'ตัวเลือก' : 'ตัวเลือกเพิ่มเติม'}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className={`w-full flex flex-col items-center justify-center p-0 overflow-hidden ${isFullScreen ? 'fixed top-0 left-0 z-50 h-screen w-screen bg-white' : 'max-h-[90vh] relative'}`} ref={pdfViewerRef}>
        {hasPdfReady ? (
          <>
            {renderToolbar(fileHash)}
            {showOptions && <div className="absolute right-4 top-14 z-20 w-64"><PdfOptions /></div>}
            <div className={`w-full ${isFullScreen ? 'h-[calc(100vh-56px)]' : 'h-[450px]'} overflow-auto bg-gray-100`}>
              {renderPdfViewer()}
            </div>
          </>
        ) : isGenerating || (loadingProgress > 0 && loadingProgress < 100) ? (
          renderLoading()
        ) : pdfError ? (
          renderError()
        ) : hasPdfContent ? (
          renderInitialScreen()
        ) : (
          renderNotFound()
        )}
      </div>
    );
  }

  return (
    <div className={`w-full ${isFullScreen ? 'fixed top-0 left-0 z-50 h-screen w-screen bg-white' : 'h-[600px] my-4 relative'} overflow-hidden`} ref={pdfViewerRef}>
      {hasPdfReady ? (
        <div className="w-full h-full flex flex-col">
          {renderToolbar(fileHash)}
          {showOptions && <div className="absolute right-4 top-14 z-20"><PdfOptions /></div>}
          <div className={`w-full ${isFullScreen ? 'h-[calc(100vh-56px)]' : 'h-[calc(600px-56px)]'} overflow-auto bg-gray-100`}>
            {renderPdfViewer()}
          </div>
        </div>
      ) : isGenerating || (loadingProgress > 0 && loadingProgress < 100) ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          {renderLoading()}
        </div>
      ) : pdfError ? (
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-lg">
          {renderError()}
        </div>
      ) : hasPdfContent ? (
        <div className="w-full h-full flex flex-col">
          <div className="w-full bg-gray-100 p-3 flex items-center justify-between rounded-t-lg sticky top-0 z-10 border-b border-gray-300">
            <div className="flex items-center">
              <FileIcon className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-gray-800 font-medium">กำลังเตรียมเอกสาร PDF</span>
            </div>
            <button onClick={generatePdf} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center">
              <RefreshCw className="w-4 h-4 mr-1" />
              สร้างเอกสาร
            </button>
          </div>
          <div className="w-full flex-1 overflow-auto bg-gray-100">
            <PDFViewer className="w-full h-full">
              <PDFDocument post={post} />
            </PDFViewer>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          {renderNotFound()}
        </div>
      )}
    </div>
  );
};

export default MobileFriendlyPDFViewer;