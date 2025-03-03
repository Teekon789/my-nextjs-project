import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { formatThaiDate, formatThaiDateTime } from '@/utils/dateUtils';

// แมปสำหรับแปลงชื่อตำแหน่งเป็นภาษาไทย
const sendToMapping = {
  dean: "คณบดี",
  head: "หัวหน้าภาควิชา",
  director: "ผู้อำนวยการ"
};

Font.register({
  family: 'THSarabunNew',
  src: '/fonts/THSarabunNew.ttf'
});

const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontFamily: 'THSarabunNew', 
    fontSize: 12 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 10 
  },
  image: { 
    width: 60, 
    height: 60, 
    alignSelf: 'center', 
    marginBottom: 10 
  },
  title: { 
    textAlign: 'center', 
    fontSize: 14, 
    fontWeight: 'bold',
    marginBottom: 10
  },
  documentInfo: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end',
    marginBottom: 15 
  },
  documentInfoText: { 
    textAlign: 'right',
    fontSize: 12
  },
  subject: { 
    marginBottom: 15
  },
  subjectText: { 
    fontSize: 12
  },
  row: { 
    flexDirection: 'row', 
    marginBottom: 8,
    alignItems: 'center' 
  },
  label: { 
    flexShrink: 0, 
    marginRight: 5 
  },
  value: { 
    flex: 1, 
    alignSelf: 'stretch', 
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
    textAlign: 'center', // จัดกลางข้อความในช่อง
    marginLeft: 2, 
    marginRight: 5, 
    paddingBottom: 2,
  },

  value_1: { 
    flex: 1, 
    alignSelf: 'stretch', 
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
    textAlign: 'justify', // จัดกลางข้อความในช่อง
    marginLeft: 20, 
    marginRight: 5, 
    paddingBottom: 2,
    paddingLeft: 10, // ขยับข้อความออกจากเส้นด้านซ้าย
  },

  value_2: { 
    flex: 1, 
    alignSelf: 'stretch', 
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
    textAlign: 'justify', // จัดกลางข้อความในช่อง
    marginLeft: 2, 
    marginRight: 5, 
    paddingBottom: 2,
  },

  section: { 
    marginTop: 15,
    marginBottom: 10
  },
  
  // ส่วนของรายการเบิกค่าใช้จ่าย - แก้ไขให้ช่องจำนวน วัน รวม บาท ตรงกัน
  expenseRow: { 
    flexDirection: 'row', 
    marginBottom: 12,
    alignItems: 'center'
  },
  
  // ส่วนชื่อรายการค่าใช้จ่าย - ปรับความกว้างให้เหมาะสม
  expenseAllowanceLabel: {
    width: '17%', 
    marginRight: 2,
  },
  expenseAccommodationLabel: {
    width: '10%', 
    marginRight: 2,
    marginLeft: 5,
  },
  expenseTransportLabel: {
    width: '12%', 
    marginRight: 2,
    marginLeft: 5,
  },
  expenseOtherLabel: {
    width: '9%', 
    marginRight: 2,
    marginLeft: 5,
  },
  
  // ส่วนประเภทของรายการ - ความกว้างแตกต่างกันไปตามรายการ
  expenseTypeUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    textAlign: 'center', // จัดกลางข้อความในช่อง
    alignItems: 'center',
    marginRight: 2,
    flexGrow: 1,
  },
  
  transportTypeUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
    marginRight: 5,
    flexGrow: 1,
  },

   // ปรับสไตล์สำหรับช่องจำนวนของค่าพาหนะโดยเฉพาะ
   transportQuantityUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '17%', // กำหนดความกว้างเท่ากับช่องวันและช่องกรอกวัน
    alignItems: 'center',
    marginRight: 0,
    
  },
  
  // ส่วนพาหนะพิเศษสำหรับแก้ไขปัญหาการจัดวาง
  transportRow: {
    flexDirection: 'row', 
    marginBottom: 12,
    alignItems: 'center'
  },
  
  
  
  // ขยายความกว้างของช่องพาหนะให้เชื่อมต่อกับช่องรวม
  transportSpacer: {
    flexGrow: 1,
  },
  
  otherExpenseTypeUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    textAlign: 'center', // จัดกลางข้อความในช่อง
    marginRight: 0,
    flexGrow: 1,
  },
  
  // ส่วนที่ต้องจัดให้ตรงกันทุกรายการ
  // คำว่า "จำนวน"
  amountLabel: {
    width: 50,
    textAlign: 'right',
    marginRight: 5,
  },
  
  // ช่องกรอกจำนวน
  amountUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 30,
    textAlign: 'center', // จัดกลางข้อความในช่อง
    marginRight: 5,
  },
  
  // คำว่า "วัน"
  dayLabel: {
    width: 30,
    textAlign: 'center',
  },
  
  // ช่องกรอกวัน
  dayUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '5%',
    textAlign: 'center', // จัดกลางข้อความในช่อง
  },
  
  // คำว่า "รวม"
  totalLabel: {
    width: 40,
    textAlign: 'right',
    marginRight: 5,
  },

  // ช่องกรอกจำนวนเงินรวม
  totalUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 60,
    textAlign: 'center', // จัดกลางข้อความในช่อง
    marginRight: 2,
  },

  // คำว่า "บาท"
  currencyLabel: {
    width: 30,
    textAlign: 'left',
  },
  
  // สำหรับยอดรวมทั้งสิ้น
  finalTotalRow: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    justifyContent: 'flex-end',
  },
  finalTotalLabel: {
    width: 80,
    textAlign: 'right',
    marginRight: 5,
  },
  finalTotalUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 60,
    textAlign: 'center', // จัดกลางข้อความในช่อง
    marginRight: 5,
  },
  finalTotalCurrencyLabel: {
    width: 30,
    textAlign: 'left',
  },
  
  tripDetails: { 
    marginTop: 15,
    marginBottom: 15
  },
  signature: { 
    marginTop: 30,
    alignItems: 'flex-end' 
  },
  signatureText: { 
    textAlign: 'center',
    marginBottom: 5
  },
  signatureLine: {
    textAlign: 'center',
    marginBottom: 15
  }
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

        {/* วันที่เดินทางและวันที่กลับ */}
        <View style={styles.row}>
          <Text style={styles.label}>โดยเดินทางวันที่</Text>
          <Text style={styles.value}>{formatThaiDateTime(safePost.departure_date ||  '')}</Text>
          <Text style={styles.label}>และเดินทางกลับวันที่</Text>
          <Text style={styles.value}>{formatThaiDateTime(safePost.return_date ||  '')}</Text>
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