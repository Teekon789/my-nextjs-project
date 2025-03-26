import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  // หน้าเอกสาร - แพดดิ้งและขนาดฟอนต์
  page: { 
    padding: 20,  // เพิ่มแพดดิ้ง
    fontFamily: 'THSarabunNew', 
    fontSize: 13
  },
  
  // ส่วนหัว - เพิ่มระยะห่าง
  header: {
    flexDirection: 'row',
    justifyContent: 'center', // จัดให้เนื้อหาอยู่ตรงกลาง
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center', // จัดให้ตราครุฑและข้อความอยู่ในแนวเดียวกัน
    width: '100%', // ให้ความกว้างเต็มหน้า
    position: 'relative', // ใช้สำหรับจัดตำแหน่งข้อความ
  },
  image: {
    width: 55,
    height: 55,
    marginRight: 10, // ระยะห่างระหว่างตราครุฑและข้อความ
    marginLeft: 40, // ขยับตราครุฑไปทางขวา 20 หน่วย
    marginTop: 15, // ขยับตราครุฑลง
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'THSarabunNew_Bold',
    position: 'absolute', // จัดตำแหน่งข้อความให้อยู่ตรงกลาง
    left: '50%', // ย้ายไปตรงกลาง
    transform: 'translateX(-50%)', // ปรับตำแหน่งให้ตรงกลางพอดี
  },
  documentInfo: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end',
    marginBottom: 12   // เพิ่มระยะห่าง 
  },
  documentInfoText: { 
    textAlign: 'right',
    fontSize: 13
  },

  // ส่วนหัวข้อเรื่อง - เพิ่มระยะห่าง
  subject: { 
    marginBottom: 12   // เพิ่มระยะห่าง
  },
  subjectText: { 
    fontSize: 13
  },

  // ส่วนข้อมูลส่วนตัว - เพิ่มระยะห่าง
  row: { 
    flexDirection: 'row', 
    marginBottom: 8,  // เพิ่มระยะห่าง
    alignItems: 'center' 
  },


  compactRow: {
    flexDirection: 'row', 
    marginBottom: 6,  // เพิ่มระยะห่าง
    alignItems: 'center' 
  },
  label: { 
    flexShrink: 0, 
    marginRight: 5    // เพิ่มระยะห่าง
  },

  label_123: { 
    flexShrink: 0, 
    marginRight: 5,    // เพิ่มระยะห่าง
    fontWeight: 'bold',
    fontFamily: 'THSarabunNew_Bold',
  },
  
  value: { 
    flex: 1, 
    alignSelf: 'stretch', 
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
    textAlign: 'center',
    marginLeft: 3,    // เพิ่มระยะห่าง
    marginRight: 5,   // เพิ่มระยะห่าง
    paddingBottom: 2,  // เพิ่มระยะห่าง

  },
  value_1: { 
    flex: 1, 
    alignSelf: 'stretch', 
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
    textAlign: 'justify',
    marginLeft: 15,
    marginRight: 5,   // เพิ่มระยะห่าง
    paddingBottom: 2, // เพิ่มระยะห่าง
    paddingLeft: 8,    // เพิ่มระยะห่าง
    paddingLeft : 3
  },
  value_2: { 
    flex: 1, 
    alignSelf: 'stretch', 
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
    textAlign: 'justify',
    marginLeft: 2,    // เพิ่มระยะห่าง
    marginRight: 5,   // เพิ่มระยะห่าง
    paddingBottom: 2 , // เพิ่มระยะห่าง
    paddingLeft : 5
  },

  value_3: { 
    flex: 1, 
    alignSelf: 'stretch', 
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
    textAlign: 'justify',
    marginLeft: 2,    // เพิ่มระยะห่าง
    marginRight: 5,   // เพิ่มระยะห่าง
    paddingBottom: 2,  // เพิ่มระยะห่าง
    paddingLeft : 5
    
  },

  // เส้นคั้นแถวข้อมูล - เพิ่มระยะห่าง
  underlineOnly_1: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    marginTop: 10,     // เพิ่มระยะห่าง
    marginBottom: 10    // เพิ่มระยะห่าง
  },  

  underlineOnly: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    marginTop: 10,     // เพิ่มระยะห่าง
    marginBottom: 6    // เพิ่มระยะห่าง
  },  

  // ส่วนรายการค่าใช้จ่าย - เพิ่มระยะห่าง
  section: { 
    marginTop: 15,    // เพิ่มระยะห่าง
    marginBottom: 10  // เพิ่มระยะห่าง
  },
  compactSection: {
    marginTop: 10,    // เพิ่มระยะห่าง
    marginBottom: 8   // เพิ่มระยะห่าง
  },
  
  // ส่วนของรายการเบิกค่าใช้จ่าย - เพิ่มระยะห่าง
  expenseRow: { 
    flexDirection: 'row', 
    marginBottom: 12,  // เพิ่มระยะห่าง
    alignItems: 'center'
  },
  compactExpenseRow: {
    flexDirection: 'row', 
    marginBottom: 8,   // เพิ่มระยะห่าง
    alignItems: 'center'
  },
  
  // ส่วนชื่อรายการค่าใช้จ่าย - เพิ่มระยะห่าง
  expenseAllowanceLabel: { 
    marginRight: 3,   // เพิ่มระยะห่าง
    marginLeft: 5     // เพิ่มระยะห่าง
  },
  expenseAccommodationLabel: {
    marginRight: 3,   // เพิ่มระยะห่าง
    marginLeft: 5     // เพิ่มระยะห่าง
  },
  expenseTransportLabel: {
    marginRight: 3,   // เพิ่มระยะห่าง
    marginLeft: 5     // เพิ่มระยะห่าง
  },
  expenseOtherLabel: { 
    marginRight: 3,   // เพิ่มระยะห่าง
    marginLeft: 5     // เพิ่มระยะห่าง
  },
  
  // ส่วนประเภทของรายการ - เพิ่มระยะห่าง
  expenseTypeUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    textAlign: 'center',
    alignItems: 'center',
    marginRight: 3,   // เพิ่มระยะห่าง
    flexGrow: 1
  },
  transportTypeUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
    marginRight: 5,   // เพิ่มระยะห่าง
    flexGrow: 1
  },
  transportQuantityUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '14%',
    alignItems: 'center',
    marginRight: 3    // เพิ่มระยะห่าง
  },
  otherExpenseTypeUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    
    marginRight: 3,   // เพิ่มระยะห่าง
    flexGrow: 1,
    paddingBottom: 12 // เพิ่มระยะห่าง
  },
  
  // "จำนวน" - ปรับระยะห่าง
  amountLabel: {
    width: 17,        // เพิ่มความกว้าง
    textAlign: 'justify',
    marginLeft: 0,   // ปรับระยะห่าง
    marginRight: 5,    // เพิ่มระยะห่าง
  },
  
  // ช่องกรอกจำนวน - เพิ่มระยะห่าง
  amountUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 30,        // เพิ่มความกว้าง
    textAlign: 'center',
    marginRight: 5    // เพิ่มระยะห่าง
  },
  
  // คำว่า "วัน" - ปรับระยะห่าง
  dayLabel: {
    width: 25,
    textAlign: 'center',
    marginLeft: -5    // ปรับระยะห่าง
  },
  
  // ช่องกรอกวัน - ปรับระยะห่าง
  dayUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '5%',      // เพิ่มความกว้าง
    textAlign: 'center',
    marginLeft: -2    // ปรับระยะห่าง
  },
  
  // ส่วนยอดรวม - ปรับระยะห่าง
  totalLabel: {
    width: 20,        // เพิ่มความกว้าง
    textAlign: 'right',
    marginRight: 5    // เพิ่มระยะห่าง
  },
  
  // ช่องกรอกจำนวนเงินรวม - เพิ่มระยะห่าง
  totalUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 60,        // เพิ่มความกว้าง
    textAlign: 'center',
    marginRight: 3    // เพิ่มระยะห่าง
  },
  
  // คำว่า "บาท" - ปรับระยะห่าง
  currencyLabel: {
    width: 30,        // เพิ่มความกว้าง
    textAlign: 'left'
  },
  
  // สำหรับยอดรวมทั้งสิ้น - เพิ่มระยะห่าง
  finalTotalRow: {
    flexDirection: 'row',
    marginTop: 10,     // เพิ่มระยะห่าง
    marginBottom: 10,  // เพิ่มระยะห่าง
    justifyContent: 'flex-end'
  },
  finalTotalLabel: {
    width: 80,        // เพิ่มความกว้าง
    textAlign: 'right',
    marginRight: 5    // เพิ่มระยะห่าง
  },
  finalTotalUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 60,        // เพิ่มความกว้าง
    textAlign: 'center',
    marginRight: 3,   // เพิ่มระยะห่าง
  
  },
  finalTotalCurrencyLabel: {
    width: 30,        // เพิ่มความกว้าง
    textAlign: 'left'
  },
  
  // ส่วนรายละเอียดการเดินทาง - เพิ่มระยะห่าง
  tripDetails: { 
    marginTop: 15,    // เพิ่มระยะห่าง
    marginBottom: 15  // เพิ่มระยะห่าง
  },
  compactTripDetails: {
    marginTop: 10,    // เพิ่มระยะห่าง
    marginBottom: 10  // เพิ่มระยะห่าง
  },
  
  // ส่วนลายเซ็น - เพิ่มระยะห่าง
  signature: { 
    marginTop: 10,    // เพิ่มระยะห่าง
    alignItems: 'flex-end' 
  },
  compactSignature: {
    marginTop: 6,     // เพิ่มระยะห่าง
    alignItems: 'flex-end' 
  },
  signatureText: { 
    textAlign: 'center',
    marginBottom: 6   // เพิ่มระยะห่าง
  },
  signatureLine: {
    textAlign: 'center',
    marginBottom: 15  // เพิ่มระยะห่าง
  }
});

export default styles;