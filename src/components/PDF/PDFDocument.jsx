'use client';

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { formatThaiDate, formatThaiDateTime } from '@/utils/dateUtils';
import styles from './styles_pdf';

// แมปสำหรับแปลงชื่อตำแหน่งเป็นภาษาไทย
const sendToMapping = {
  dean: "คณบดี",
  head: "หัวหน้าภาควิชา",
  director: "ผู้อำนวยการ"
};

// ลงทะเบียนฟอนต์
try {
  Font.register({
    family: 'THSarabunNew',
    src: '/fonts/THSarabunNew.ttf',
  });

  Font.register({
    family: 'THSarabunNew_Bold',
    src: '/fonts/THSarabunNew Bold.ttf',
  });
} catch (error) {
  console.error('Error registering fonts:', error);
}

const PDFDocument = ({ post }) => {
  // ตรวจสอบว่ามีข้อมูลหรือไม่ ถ้าไม่มีให้ใช้ค่าเริ่มต้นเป็นอ็อบเจ็กต์ว่าง
  const safePost = post || {};
  
  // เตรียมข้อมูล travelers โดยตรวจสอบค่า null/undefined
  const travelers = safePost.travelers || [];
  
  // ช่วยในการตรวจสอบค่าและส่งคืนค่าที่ปลอดภัย (แสดงเป็นเส้นขีดถ้าเป็นค่าว่าง)
  const getSafeValue = (value, defaultValue = '-') => {
    return (value !== null && value !== undefined && value !== '') ? value : defaultValue;
  };
  
  // ช่วยแปลงตัวเลขให้อยู่ในรูปแบบที่ปลอดภัย (แสดงเป็นเส้นขีดถ้าเป็นค่าว่าง)
  const getSafeNumber = (value, defaultValue = '-') => {
    if (value === null || value === undefined || value === '') return defaultValue;
    const parsedValue = parseFloat(value);
    return !isNaN(parsedValue) ? parsedValue.toLocaleString() : defaultValue;
  };
  
  // ตรวจสอบและแปลงค่าวันที่ (แสดงเป็นเส้นขีดถ้าเป็นค่าว่าง)
  const getSafeDate = (dateValue) => {
    try {
      return dateValue ? formatThaiDate(dateValue) : '-';
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };
  
  // ตรวจสอบและแปลงค่าวันที่และเวลา (แสดงเป็นเส้นขีดถ้าเป็นค่าว่าง)
  const getSafeDateTime = (dateTimeValue) => {
    try {
      return dateTimeValue ? formatThaiDateTime(dateTimeValue) : '-';
    } catch (error) {
      console.error('Error formatting date time:', error);
      return '-';
    }
  };

  // จัดการลิสต์ผู้ร่วมเดินทางให้กระชับขึ้น
  const formatTravelers = () => {
    if (!travelers.length) return '-';
    
    // แสดงชื่อผู้ร่วมเดินทางคนแรกแยก
    if (travelers.length === 1) {
      return getSafeValue(travelers[0].traveler_name);
    }
    
    // รวมชื่อผู้ร่วมเดินทางทุกคนในบรรทัดเดียว ถ้ามีหลายคน
    const names = travelers.map(t => getSafeValue(t.traveler_name, '')).filter(name => name && name !== '-');
    return names.length > 0 ? names.join(', ') : '-';
  };
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ตราครุฑและหัวเรื่อง */}
        <View style={styles.header}>
          <Image src={'/logo/Garuda.png'} style={styles.image} />
          <Text style={styles.title}>บันทึกการเดินทางไปราชการ</Text>
        </View>

        {/* ส่วนข้อมูลเอกสาร */}
        <View style={styles.documentInfo}>
          <View>
            <Text style={styles.documentInfoText}>ที่ {getSafeValue(safePost.department)}</Text>
            <Text style={styles.documentInfoText}>วันที่ {getSafeDate(safePost.date123)}</Text>
          </View>
        </View>

        {/* หัวข้อเรื่องและผู้รับ */}
        <View style={styles.subject}>
          <Text style={styles.subjectText}>เรื่อง: ขออนุมัติเบิกค่าใช้จ่ายในการเดินทางไปราชการ</Text>
          <Text style={styles.subjectText}>เรียน: {getSafeValue(safePost.sendTo) ? sendToMapping[safePost.sendTo] || safePost.sendTo : '-'}</Text>
        </View>

        {/* ข้อมูลผู้ยื่นและตำแหน่ง */}
        <View style={styles.row}>
          <Text style={styles.label}>ข้าพเจ้า</Text>
          <Text style={styles.value}>{getSafeValue(safePost.fullname)}</Text>
          <Text style={styles.label}>ตำแหน่ง</Text>
          <Text style={styles.value}>{getSafeValue(safePost.personnel_type)}</Text>
        </View>

        {/* สังกัดและผู้ร่วมเดินทาง - แสดงทั้งหมดในบรรทัดเดียว */}
        <View style={styles.row}>
          <Text style={styles.label}>สังกัด</Text>
          <Text style={styles.value}>{getSafeValue(safePost.department)}</Text>
          <Text style={styles.label}>พร้อมด้วย</Text>
          <Text style={styles.value}>{formatTravelers()}</Text>
        </View>

        {/* จังหวัดที่เดินทางไป */}
        <View style={styles.row}>
          <Text style={styles.label}>เดินทางไปปฏิบัติงานจังหวัด</Text>
          <Text style={styles.value}>{getSafeValue(safePost.province)}</Text>
        </View>

        {/* วันที่เดินไปราชการทางและวันที่กลับ */}
        <View style={styles.row}>
          <Text style={styles.label}>วันที่ไปราชการ</Text>
          <Text style={styles.value}>{getSafeDateTime(safePost.trip_date)}</Text>
          <Text style={styles.label}>สิ้นสุดวันที่</Text>
          <Text style={styles.value}>{getSafeDateTime(safePost.trip_date_end)}</Text>
        </View>

        {/* วันที่เดินทางและวันที่กลับ */}
        <View style={styles.row}>
          <Text style={styles.label}>โดยเดินทางวันที่</Text>
          <Text style={styles.value}>{getSafeDateTime(safePost.departure_date)}</Text>
          <Text style={styles.label}>กลับวันที่</Text>
          <Text style={styles.value}>{getSafeDateTime(safePost.return_date)}</Text>
        </View>

        <View style={styles.underlineOnly}></View>

        {/* ข้อความขอเบิกค่าใช้จ่าย */}
        <View style={styles.compactSection}>
          <Text>ข้าพเจ้าได้ขอเบิกค่าใช้จ่ายสำหรับการเดินทางไปราชการ ดังนี้</Text>
        </View>

        {/* ค่าเบี้ยเลี้ยงเดินทาง */}
        <View style={styles.compactExpenseRow}>
          <Text style={styles.expenseAllowanceLabel}>ค่าเบี้ยเลี้ยงเดินทางประเภท</Text>
          <View style={styles.expenseTypeUnderline}>
            <Text>{getSafeValue(safePost.allowance_type)}</Text>
          </View>
          <Text style={styles.amountLabel}>จำนวน</Text>
          <View style={styles.amountUnderline}>
            <Text>{getSafeNumber(safePost.allowance_quantity)}</Text>
          </View>
          <Text style={styles.dayLabel}>วัน</Text>
          <View style={styles.dayUnderline}>
            <Text>{getSafeNumber(safePost.allowance_days)}</Text>
          </View>
          <Text style={styles.totalLabel}>รวม</Text>
          <View style={styles.totalUnderline}>
            <Text>{getSafeNumber(safePost.allowance)}</Text>
          </View>
          <Text style={styles.currencyLabel}>บาท</Text>
        </View>

        {/* ค่าที่พัก */}
        <View style={styles.compactExpenseRow}>
          <Text style={styles.expenseAccommodationLabel}>ค่าที่พักประเภท</Text>
          <View style={styles.expenseTypeUnderline}>
            <Text>{getSafeValue(safePost.accommodation_type)}</Text>
          </View>
          <Text style={styles.amountLabel}>จำนวน</Text>
          <View style={styles.amountUnderline}>
            <Text>{getSafeNumber(safePost.accommodation_quantity)}</Text>
          </View>
          <Text style={styles.dayLabel}>วัน</Text>
          <View style={styles.dayUnderline}>
            <Text>{getSafeNumber(safePost.accommodation_days)}</Text>
          </View>
          <Text style={styles.totalLabel}>รวม</Text>
          <View style={styles.totalUnderline}>
            <Text>{getSafeNumber(safePost.accommodation)}</Text>
          </View>
          <Text style={styles.currencyLabel}>บาท</Text>
        </View>

        {/* ค่าพาหนะ */}
        <View style={styles.compactExpenseRow}>
          <Text style={styles.expenseTransportLabel}>ค่าพาหนะประเภท</Text>
          <View style={styles.expenseTypeUnderline}>
            <Text>{getSafeValue(safePost.transportation_type)}</Text>
          </View>
          <Text style={styles.amountLabel}>จำนวน</Text>
          <View style={styles.transportQuantityUnderline}>
            <Text>{getSafeNumber(safePost.transportation_quantity)}</Text>
          </View>
          <Text style={styles.totalLabel}>รวม</Text>
          <View style={styles.totalUnderline}>
            <Text>{getSafeNumber(safePost.transportation)}</Text>
          </View>
          <Text style={styles.currencyLabel}>บาท</Text>
        </View>

        {/* ค่าใช้จ่ายอื่นๆ */}
        <View style={styles.compactExpenseRow}>
          <Text style={styles.expenseOtherLabel}>ค่าใช้จ่ายอื่นๆ</Text>
          <View style={styles.otherExpenseTypeUnderline}>
            <Text>{getSafeValue(safePost.other_expenses_type)}</Text>
          </View>
          <Text style={styles.totalLabel}>รวม</Text>
          <View style={styles.totalUnderline}>
            <Text>{getSafeNumber(safePost.expenses)}</Text>
          </View>
          <Text style={styles.currencyLabel}>บาท</Text>
        </View>

        {/* รวมทั้งสิ้น */}
        <View style={styles.finalTotalRow}>
          <Text style={styles.finalTotalLabel}>รวมทั้งสิ้น</Text>
          <View style={styles.finalTotalUnderline}>
            <Text>{getSafeNumber(safePost.total_budget)}</Text>
          </View>
          <Text style={styles.finalTotalCurrencyLabel}>บาท</Text>
        </View>

        <View style={styles.underlineOnly}></View>

        {/* รายละเอียดการเดินทางแบบกระชับ */}
        <View style={styles.compactTripDetails}>
          <Text>รายละเอียดการเดินทาง</Text>
          
          <View style={[styles.compactRow, {marginTop: 5}]}>
            <Text style={styles.label}>เรื่อง:</Text>
            <Text style={styles.value_2}>{getSafeValue(safePost.trip_details)}</Text>
          </View>
          
          <View style={styles.compactRow}>
            <Text style={styles.label}>สถานที่ปฏิบัติงาน:</Text>
            <Text style={styles.value_2}>{getSafeValue(safePost.traveler_name2)}</Text>
          </View>
        </View>

        {/* ลายเซ็น */}
        <View style={styles.compactSignature}>
          <Text style={styles.signatureLine}>ลงชื่อ...........................................................</Text>
          <Text style={styles.signatureText}>({getSafeValue(safePost.fullname, 'วาคิม สุทธิ')})</Text>
          <Text style={styles.signatureText}>ตำแหน่ง {getSafeValue(safePost.personnel_type, 'เจ้าฝ่ายกิจกรรม')}</Text>
          <Text style={styles.signatureText}>วันที่ {getSafeDate(safePost.date123)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;