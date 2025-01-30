import React from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import styles from './Pagination.module.css';

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className={styles.pagination}>
        <li className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}>
          <button
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            className={`${styles.pageLink} ${styles.prevNext}`}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <MdKeyboardArrowLeft />
          </button>
        </li>

        {pageNumbers.map(number => (
          <li key={number} className={`${styles.pageItem} ${currentPage === number ? styles.active : ''}`}>
            <button 
              onClick={() => paginate(number)} 
              className={styles.pageLink}
            >
              {number}
            </button>
          </li>
        ))}

        <li className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}>
          <button
            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
            className={`${styles.pageLink} ${styles.prevNext}`}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <MdKeyboardArrowRight />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;