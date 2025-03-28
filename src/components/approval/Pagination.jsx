import React from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // คำนวณช่วงหน้าที่จะแสดง (แสดงสูงสุด 5 ปุ่ม)
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // ปรับเมื่ออยู่ใกล้จุดเริ่มต้นหรือสิ้นสุด
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center space-x-1 mt-6">
      {/* ปุ่มไปหน้าแรก */}
      <button
        onClick={() => paginate(1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
        aria-label="First page"
      >
        &laquo;
      </button>

      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
        aria-label="Previous page"
      >
        <MdKeyboardArrowLeft size={20} />
      </button>

      {/* จุดไข่ปลาหากมีหน้าก่อนหน้า */}
      {pageNumbers[0] > 1 && (
        <span className="px-2">...</span>
      )}

      {/* หมายเลขหน้า */}
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
          aria-current={currentPage === number ? 'page' : undefined}
        >
          {number}
        </button>
      ))}

      {/* จุดไข่ปลาหากมีหน้าถัดไป */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <span className="px-2">...</span>
      )}

      {/* ปุ่มถัดไป */}
      <button
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
        aria-label="Next page"
      >
        <MdKeyboardArrowRight size={20} />
      </button>

      {/* ปุ่มไปหน้าสุดท้าย */}
      <button
        onClick={() => paginate(totalPages)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
        aria-label="Last page"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;