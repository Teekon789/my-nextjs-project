import React, { useRef } from 'react';
import { FiX, FiPrinter } from 'react-icons/fi';
import styles from '@/styles/ExpenseForm.module.css';

const ExpenseForm = ({ post, onClose }) => {
  const printAreaRef = useRef(null);

  if (!post) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  const handlePrint = () => {
    const printContent = printAreaRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body { font-family: 'TH Sarabun New', sans-serif; line-height: 1.6; margin: 20px; }
            h1 { text-align: center; margin-bottom: 16px; }
            .section { margin-bottom: 16px; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className={styles.popupOverlay}>
      <div  className={styles.outerContainer}>
        {/* ปุ่มต่างๆ */}
        <div className={styles.iconContainer}>
        <button onClick={onClose} className={`${styles.iconButton} ${styles.closeButton}`}>
            <FiX size={20} />
          </button>
          <button className={styles.iconButton} onClick={handlePrint}>
            <FiPrinter size={20} />
          </button>
        </div>

        <div className=" m-8 ">  </div>

        <div className={styles.innerContainer} ref={printAreaRef}>
          <div className={styles.printContent}>
            {/* เอกสาร */}
            <h1>ใบเบิกค่าใช้จ่ายในการเดินทางไปราชการ</h1>
            <div className="text-right">
              <p>ที่ทำการ {post.department}</p>
              <p>วันที่ {post.trip_date}</p>
            </div>
            <div className="section">
              <p>สัญญาเงินยืมเลขที่ {post.contract_number}</p>
              <p>ชื่อผู้ยืม {post.fullname} จำนวนเงิน {post.total_budget} บาท</p>
            </div>
            <div className="section">
              <p>เรื่อง ขออนุมัติเบิกค่าใช้จ่ายในการเดินทางไปราชการ</p>
              <p>ตามคำสั่ง/บันทึกที่.........................ลงวันที่...........................</p>
              <p>ข้าพเจ้า {post.fullname}</p>
              <p>ตำแหน่ง {post.personnel_type}</p>
              <p>สังกัด {post.department}</p>
              <p>ขออนุมัติเบิกค่าใช้จ่ายดังรายการต่อไปนี้:</p>
            </div>
            <div className="section">
              <p>- ค่าเบี้ยเลี้ยงเดินทาง {post.accommodation_days} วัน รวม {post.allowance} บาท</p>
              <p>- ค่าเช่าที่พักประเภท {post.accommodation_type} รวม {post.accommodation} บาท</p>
              <p>- ค่าพาหนะ {post.transportation_type} รวม {post.transportation} บาท</p>
              <p>- ค่าใช้จ่ายอื่น รวม {post.expenses} บาท</p>
              <p className="font-bold">รวมทั้งสิ้น {post.total_budget} บาท</p>
            </div>
            <div className="text-right">
              <p>ลงชื่อ ................................................</p>
              <p>({post.fullname})</p>
              <p>ตำแหน่ง {post.personnel_type}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
