import React from "react";
import styles from './DeletePermanentlyPopup.module.css';




const DeletePermanentlyPopup = ({ post, onDelete, onClose }) => {
  return (
    <div className={styles.popupWrapper}>
      <div className={styles.popupContent}>
        <h2 className={styles.popupHeader}>ยืนยันการลบโพสต์</h2>
       
        <p>คุณต้องการลบโพสต์ "<strong className={styles.popupHighlight}>{post?.fullname}</strong>" ใช่หรือไม่?</p>
        
        <div className={styles.popupActions}>
          <button className={styles.confirmBtn} onClick={() => onDelete(post)}>
            ลบ
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeletePermanentlyPopup;
