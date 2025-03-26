import React from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  // คำนวณจำนวนหน้าทั้งหมด
  const pageNumbers = [];
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // คำนวณช่วงของหน้าที่จะแสดง
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);
  
  // ปรับช่วงหน้าเมื่ออยู่ใกล้จุดเริ่มต้นหรือจุดสิ้นสุด
  if (currentPage <= 3) {
    endPage = Math.min(5, totalPages);
  } else if (currentPage >= totalPages - 2) {
    startPage = Math.max(1, totalPages - 4);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <div className="pagination-container">
      {/* ปุ่มไปหน้าแรก */}
      <button
        onClick={() => paginate(1)}
        className={`pagination-link pagination-navigate ${currentPage === 1 ? 'pagination-disabled' : ''}`}
        disabled={currentPage === 1}
        aria-label="ไปหน้าแรก"
      >
        <span>&#171;</span> {/* สัญลักษณ์ << */}
      </button>
      
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
        className={`pagination-link pagination-navigate ${currentPage === 1 ? 'pagination-disabled' : ''}`}
        disabled={currentPage === 1}
        aria-label="ย้อนกลับ"
      >
        <MdKeyboardArrowLeft />
      </button>
      
      {/* แสดงจุดไข่ปลาถ้ามีหน้าก่อนหน้านี้อีก */}
      {startPage > 1 && (
        <span className="pagination-ellipsis">...</span>
      )}
      
      {/* หมายเลขหน้า */}
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`pagination-link ${currentPage === number ? 'pagination-active' : ''}`}
          aria-current={currentPage === number ? 'page' : undefined}
        >
          {number}
        </button>
      ))}
      
      {/* แสดงจุดไข่ปลาถ้ามีหน้าต่อจากนี้อีก */}
      {endPage < totalPages && (
        <span className="pagination-ellipsis">...</span>
      )}
      
      {/* ปุ่มถัดไป */}
      <button
        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
        className={`pagination-link pagination-navigate ${currentPage === totalPages ? 'pagination-disabled' : ''}`}
        disabled={currentPage === totalPages}
        aria-label="ถัดไป"
      >
        <MdKeyboardArrowRight />
      </button>
      
      {/* ปุ่มไปหน้าสุดท้าย */}
      <button
        onClick={() => paginate(totalPages)}
        className={`pagination-link pagination-navigate ${currentPage === totalPages ? 'pagination-disabled' : ''}`}
        disabled={currentPage === totalPages}
        aria-label="ไปหน้าสุดท้าย"
      >
        <span>&#187;</span> {/* สัญลักษณ์ >> */}
      </button>
    </div>
  );
};

export default Pagination;