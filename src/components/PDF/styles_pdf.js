import { StyleSheet } from '@react-pdf/renderer';


const styles = StyleSheet.create({
    // หน้าเอกสาร
    page: { 
      padding: 30, 
      fontFamily: 'THSarabunNew', 
      fontSize: 12 
  
      // ส่วนหัว
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
      marginBottom: 10,
      fontFamily: 'THSarabunNew_Bold'
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
  
     // ส่วนหัวข้อเรื่อง
    subject: { 
      marginBottom: 15
    },
    subjectText: { 
      fontSize: 12
    },
  
     // ส่วนข้อมูลส่วนตัว
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

    // เส้นคั้นแถวข้อมูล
    underlineOnly: {
      borderBottomWidth: 1,       // ความหนาของเส้นล่าง
      borderBottomColor: '#ccc',  // สีของเส้น (สีเทาอ่อน)
      width: '100%',                 // ความยาวของเส้น 
      marginTop: 15,              // ระยะห่างด้านบน
      marginBottom: 5,            // ระยะห่างด้านล่าง 
    },  
  
     // ส่วนรายการค่าใช้จ่าย
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
      marginRight: 2,
      marginLeft: 5,
    },
    expenseAccommodationLabel: {
      marginRight: 2,
      marginLeft: 5,
    },
    expenseTransportLabel: {
       
      marginRight: 2,
      marginLeft: 5,
    },
    expenseOtherLabel: { 
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
      width: '14%', // กำหนดความกว้างเท่ากับช่องวันและช่องกรอกวัน
      alignItems: 'center',
      marginRight: 0,
      
    },
    
    // ส่วนพาหนะพิเศษสำหรับแก้ไขปัญหาการจัดวาง
    transportRow: {
      flexDirection: 'row', 
      marginBottom: 12,
      alignItems: 'center'
    },
    
    
    otherExpenseTypeUnderline: {
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      textAlign: 'center',
      marginRight: 0,
      flexGrow: 1,
      paddingBottom: 17, // เพิ่มพื้นที่ใต้ข้อความ
    },
    
    //  "จำนวน"
    amountLabel: {
      width: 30,
      textAlign: 'right',
      marginLeft: -5,
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
      marginLeft: -10,
    },
    
    // ช่องกรอกวัน
    dayUnderline: {
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      width: '5%',
      textAlign: 'center', // จัดกลางข้อความในช่อง
      marginLeft: -5,
    },

    
    // ส่วนยอดรวม
    totalLabel: {
      width: 20,
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
      marginTop: 10,
      marginBottom: 10,
      justifyContent: 'flex-end',
    },
    finalTotalLabel: {
      width: 80,
      textAlign: 'right',
      marginRight: 5,
    },
    finalTotalUnderline: {
      borderBottomWidth: 1, // เส้นใต้
      borderBottomColor: '#000', // สีของเส้นใต้ (ดำ)
      width: 56, // ความกว้างของช่อง
      textAlign: 'center', // จัดกลางข้อความ
      marginRight: 2, // ระยะห่างด้านขวา
      fontWeight: 'bold', // ทำให้ตัวอักษรเป็นตัวหนา
      fontFamily: 'THSarabunNew_Bold', // ใช้ฟอนต์ THSarabunNew_Bold
    },
    finalTotalCurrencyLabel: {
      width: 30,
      textAlign: 'left',
    },
  
     // ส่วนรายละเอียดการเดินทาง
    tripDetails: { 
      marginTop: 15,
      marginBottom: 15
    },
  
     // ส่วนลายเซ็น
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

  export default styles;