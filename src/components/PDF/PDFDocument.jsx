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

Font.register({
  family: 'THSarabunNew',
  src: '/fonts/THSarabunNew.ttf',
});

Font.register({
  family: 'THSarabunNew_Bold',
  src: '/fonts/THSarabunNew Bold.ttf', // นําเข้าฟ้อนต์ตัวหนา
});



const PDFDocument = ({ post }) => {
  // ตรวจสอบว่ามีข้อมูลหรือไม่ ถ้าไม่มีให้ใช้ค่าเริ่มต้น
  const safePost = post || {};
  
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
            <Text style={styles.documentInfoText}>ที่ {safePost.department}</Text>
            <Text style={styles.documentInfoText}>วันที่ {formatThaiDate(safePost.date123)}</Text>
          </View>
        </View>

        {/* หัวข้อเรื่องและผู้รับ */}
        <View style={styles.subject}>
          <Text style={styles.subjectText}>เรื่อง: ขออนุมัติเบิกค่าใช้จ่ายในการเดินทางไปราชการ</Text>
          <Text style={styles.subjectText}>เรียน: {sendToMapping[safePost.sendTo]}</Text>
        </View>

        {/* ข้อมูลผู้ยื่นและตำแหน่ง */}
        <View style={styles.row}>
          <Text style={styles.label}>ข้าพเจ้า</Text>
          <Text style={styles.value}>{safePost.fullname}</Text>
          <Text style={styles.label}>ตำแหน่ง</Text>
          <Text style={styles.value}>{safePost.personnel_type}</Text>
        </View>

        {/* สังกัดและผู้ร่วมเดินทาง */}
        <View style={styles.row}>
          <Text style={styles.label}>สังกัด</Text>
          <Text style={styles.value}>{safePost.department}</Text>
          <Text style={styles.label}>พร้อมด้วย</Text>
          <Text style={styles.value}>
            {safePost.travelers && safePost.travelers.length > 0 
              ? safePost.travelers[0].traveler_name 
              : ''}
          </Text>
        </View>

        {/* ผู้ร่วมเดินทางคนที่ 2 เป็นต้นไป (ถ้ามี) */}
        {safePost.travelers && safePost.travelers.length > 1 && safePost.travelers.slice(1).map((traveler, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}></Text>
            <Text style={styles.value_1}>{traveler.traveler_name}</Text>
          </View>
        ))}

        {/* จังหวัดที่เดินทางไป */}
        <View style={styles.row}>
          <Text style={styles.label}>เดินทางไปปฏิบัติงานจังหวัด</Text>
          <Text style={styles.value}>{safePost.province || ''}</Text>
        </View>

        {/* วันที่เดินไปราชการทางและวันที่กลับ */}
        <View style={styles.row}>
          <Text style={styles.label}>วันที่ไปราชการ</Text>
          <Text style={styles.value}>{formatThaiDateTime(safePost.trip_date ||  '')}</Text>
          <Text style={styles.label}>และสิ้นสุดการไปราชการวันที่</Text>
          <Text style={styles.value}>{formatThaiDateTime(safePost.trip_date_end ||  '')}</Text>
        </View>

        {/* วันที่เดินทางและวันที่กลับ */}
        <View style={styles.row}>
          <Text style={styles.label}>โดยเดินทางวันที่</Text>
          <Text style={styles.value}>{formatThaiDateTime(safePost.departure_date ||  '')}</Text>
          <Text style={styles.label}>และเดินทางกลับวันที่</Text>
          <Text style={styles.value}>{formatThaiDateTime(safePost.return_date ||  '')}</Text>
        </View>

       
        <View style={styles.underlineOnly}>
        </View>

        {/* ข้อความขอเบิกค่าใช้จ่าย */}
        <View style={styles.section}>
          <Text>ข้าพเจ้าได้ขอเบิกค่าใช้จ่ายสำหรับการเดินทางไปราชการ ดังนี้</Text>
        </View>

             {/* ค่าเบี้ยเลี้ยงเดินทาง */}
        <View style={styles.expenseRow}>
          <Text style={styles.expenseAllowanceLabel}>ค่าเบี้ยเลี้ยงเดินทางประเภท</Text>
          <View style={styles.expenseTypeUnderline}>
            <Text>{safePost.allowance_type || ''}</Text>
          </View>
          <Text style={styles.amountLabel}>จำนวน</Text>
          <View style={styles.amountUnderline}>
            <Text>{Number(safePost.allowance_quantity ?? 0).toLocaleString()}</Text>
          </View>
          <Text style={styles.dayLabel}>วัน</Text>
          <View style={styles.dayUnderline}>
            <Text>{Number(safePost.allowance_days ?? 0).toLocaleString()}</Text>
          </View>
          <Text style={styles.totalLabel}>รวม</Text>
          <View style={styles.totalUnderline}>
            <Text>{Number(safePost.allowance ?? 0).toLocaleString()}</Text>
          </View>
          <Text style={styles.currencyLabel}>บาท</Text>
        </View>

        {/* ค่าที่พัก */}
        <View style={styles.expenseRow}>
          <Text style={styles.expenseAccommodationLabel}>ค่าที่พักประเภท</Text>
          <View style={styles.expenseTypeUnderline}>
            <Text>{safePost.accommodation_type || ''}</Text>
          </View>
          <Text style={styles.amountLabel}>จำนวน</Text>
          <View style={styles.amountUnderline}>
            <Text>{Number(safePost.accommodation_quantity ?? 0).toLocaleString()}</Text>
          </View>
          <Text style={styles.dayLabel}>วัน</Text>
          <View style={styles.dayUnderline}>
            <Text>{Number(safePost.accommodation_days ?? 0).toLocaleString()}</Text>
          </View>
          <Text style={styles.totalLabel}>รวม</Text>
          <View style={styles.totalUnderline}>
            <Text>{Number(safePost.accommodation ?? 0).toLocaleString()}</Text>
          </View>
          <Text style={styles.currencyLabel}>บาท</Text>
        </View>

        {/* ค่าพาหนะ */}
        <View style={styles.expenseRow}>
          <Text style={styles.expenseTransportLabel}>ค่าพาหนะประเภท</Text>
          <View style={styles.expenseTypeUnderline}>
            <Text>{safePost.transportation_type || ''}</Text>
          </View>
          <Text style={styles.amountLabel}>จำนวน</Text>
          <View style={styles.transportQuantityUnderline}>
            <Text>{Number(safePost.transportation_quantity ?? 0).toLocaleString()}</Text>
          </View>
          <Text style={styles.totalLabel}>รวม</Text>
          <View style={styles.totalUnderline}>
            <Text>{Number(safePost.transportation ?? 0).toLocaleString()}</Text>
          </View>
          <Text style={styles.currencyLabel}>บาท</Text>
        </View>

        {/* ค่าใช้จ่ายอื่นๆ */}
        <View style={styles.expenseRow}>
          <Text style={styles.expenseOtherLabel}>ค่าใช้จ่ายอื่นๆ</Text>
          <View style={styles.otherExpenseTypeUnderline}>
            <Text>{safePost.other_expenses_type || ''}</Text>
          </View>
          <Text style={styles.totalLabel}>รวม</Text>
          <View style={styles.totalUnderline}>
            <Text>{Number(safePost.expenses ?? 0).toLocaleString()}</Text>
          </View>
          <Text style={styles.currencyLabel}>บาท</Text>
        </View>

        {/* รวมทั้งสิ้น */}
        <View style={styles.finalTotalRow}>
          <Text style={styles.finalTotalLabel}>รวมทั้งสิ้น</Text>
          <View style={styles.finalTotalUnderline}>
            <Text>{Number(safePost.total_budget ?? 0).toLocaleString()}</Text>
          </View>
          <Text style={styles.finalTotalCurrencyLabel}>บาท</Text>
        </View>

        <View style={styles.underlineOnly}>
        </View>

          {/* รายละเอียดการเดินทาง */}
          <View style={styles.tripDetails}>
            <Text>รายละเอียดการเดินทาง</Text>
            
            <View style={[styles.row, {marginTop: 10}]}>
              <Text style={styles.label}>เรื่อง:</Text>
              <Text style={styles.value_2}>{safePost.trip_details || ''}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>สถานที่ปฏิบัติงาน:</Text>
              <Text style={styles.value_2}>{safePost.traveler_name2 || ''}</Text>
            </View>
          </View>

          {/* ลายเซ็น */}
          <View style={styles.signature}>
            <Text style={styles.signatureLine}>ลงชื่อ...........................................................</Text>
            <Text style={styles.signatureText}>({safePost.fullname || 'วาคิม สุทธิ'})</Text>
            <Text style={styles.signatureText}>ตำแหน่ง {safePost.personnel_type || 'เจ้าฝ่ายกิจกรรม'}</Text>
            <Text style={styles.signatureText}>วันที่ {formatThaiDate(safePost.date123 || '')}</Text>
          </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;