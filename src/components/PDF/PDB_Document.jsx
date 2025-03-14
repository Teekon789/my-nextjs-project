import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import สำหรับ PDFDownloadLink และ PDFDocument
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
);

const PDFDocument = dynamic(
  () => import('./PDFDocument'),
  { ssr: false }
);

// Loading component
const LoadingButton = () => (
  <div className="px-4 py-2 flex items-center">
    <span className="animate-pulse text-gray-400">กำลังโหลด...</span>
  </div>
);

const PDB_Document = ({ post }) => {
  return (
    <Suspense fallback={<LoadingButton />}>
      <PDFDownloadLink
        document={<PDFDocument post={post} />}
        fileName={`travel-document-${post.fullname || 'document'}.pdf`}
        className="px-4 py-2 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        {({ loading }) => (
          loading ? (
            <span className="text-gray-500">กำลังโหลด...</span>
          ) : (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>ดาวน์โหลด PDF</span>
            </div>
          )
        )}
      </PDFDownloadLink>
    </Suspense>
  );
};

export default PDB_Document;