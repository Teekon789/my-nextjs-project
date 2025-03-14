import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { FiDownload } from 'react-icons/fi';

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
  <button className="px-4 py-2 flex items-center text-gray-400 cursor-not-allowed">
    <span className="animate-pulse">กำลังโหลด...</span>
  </button>
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
              <FiDownload className="mr-1" size={18} />
              <span>ดาวน์โหลด PDF</span>
            </div>
          )
        )}
      </PDFDownloadLink>
    </Suspense>
  );
};

export default PDB_Document;