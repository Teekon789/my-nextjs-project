import React, { useState } from 'react';
import styles from '../styles/styles_DocumentRequestForm.module.css';  // ใช้ .module.css

const DocumentRequestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    idCard: '',
    reason: '',
    date: '',
    document: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      document: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, idCard, reason, date } = formData;
    alert(`คำขอของคุณถูกส่งแล้ว!\n\nชื่อ: ${name}\nบัตรประชาชน: ${idCard}\nเหตุผล: ${reason}\nวันที่: ${date}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerText}>ระบบส่งเอกสารขออนุญาตไปราชการออนไลน์</h1>
      </header>
      <div className={styles.formContainer}>
        <h2 className={styles.headerText2}>แบบฟอร์มขออนุญาต</h2>
        <form id="requestForm" onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>ชื่อ-นามสกุล</label>
            <input
              className={styles.inputField}  // ใช้ class inputField
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="idCard" className={styles.label}>เลขบัตรประชาชน</label>
            <input
              className={styles.inputField}  // ใช้ class inputField
              type="text"
              id="idCard"
              name="idCard"
              value={formData.idCard}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="reason" className={styles.label}>เหตุผลการขออนุญาต</label>
            <textarea
              className={styles.inputField}  // ใช้ class inputField
              id="reason"
              name="reason"
              rows="4"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="date" className={styles.label}>วันที่ขออนุญาต</label>
            <input
              className={styles.inputField}  // ใช้ class inputField
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="document" className={styles.label}>อัปโหลดเอกสาร</label>
            <input
              className={styles.inputField}  // ใช้ class inputField
              type="file"
              id="document"
              name="document"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* กรณีที่มีไฟล์ให้แสดงการพรีวิวไฟล์ */}
          {formData.document && formData.document.type.startsWith("image/") && (
            <div className={styles.previewWrapper}>
              <img
                className={styles.imagePreview}
                src={URL.createObjectURL(formData.document)}
                alt="Preview"
              />
            </div>
          )}
          {formData.document && formData.document.type === "application/pdf" && (
            <div className={styles.previewWrapper}>
              <embed
                className={styles.embedPreview}
                src={URL.createObjectURL(formData.document)}
                type="application/pdf"
              />
            </div>
          )}

          <button type="submit" className={styles.submitButton}>ส่งคำขอ</button>
        </form>
      </div>
    </div>
  );
};

export default DocumentRequestForm;
