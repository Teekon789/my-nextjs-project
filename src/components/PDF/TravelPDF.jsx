// TravelPDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { formatThaiDateTime } from '@/utils/dateUtils';

// ลงทะเบียนฟอนต์ Sarabun กับ PDF
try {
  Font.register({
    family: 'Sarabun',
    src: '/fonts/THSarabunNew.ttf',
    fontWeight: 'normal',
  });
  Font.register({
    family: 'Sarabun',
    src: '/fonts/THSarabunNew Bold.ttf',
    fontWeight: 'bold',
  });
} catch (error) {
  console.error('Failed to register fonts:', error);
}

// สร้าง Styles สำหรับ PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Sarabun',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
  },
  divider: {
    borderBottom: 1,
    borderColor: '#000',
    marginVertical: 10,
  },
  travelerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

// สร้าง Component PDF Document
const TravelPDF = ({ post }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>บันทึกรายละเอียดการเดินทาง</Text>
      
      {/* ข้อมูลการเดินทาง */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>เลขสัญญา:</Text>
          <Text style={styles.value}>{post.contract_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ชื่อเต็ม:</Text>
          <Text style={styles.value}>{post.fullname}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ตำแหน่ง:</Text>
          <Text style={styles.value}>{post.personnel_type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>สังกัด:</Text>
          <Text style={styles.value}>{post.department}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>อีเมล:</Text>
          <Text style={styles.value}>{post.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>เบอร์โทรศัพท์:</Text>
          <Text style={styles.value}>{post.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>แหล่งเงิน:</Text>
          <Text style={styles.value}>{post.fund_source}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>จังหวัด:</Text>
          <Text style={styles.value}>{post.province}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>วันที่ไปราชการ:</Text>
          <Text style={styles.value}>{formatThaiDateTime(post.trip_date)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>วันที่ออกเดินทาง:</Text>
          <Text style={styles.value}>{formatThaiDateTime(post.departure_date)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>วันที่กลับ:</Text>
          <Text style={styles.value}>{formatThaiDateTime(post.return_date)}</Text>
        </View>
      </View>

      {/* ส่วนงบประมาณ */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>จำนวนเงินรวม:</Text>
          <Text style={styles.value}>{post.total_budget.toLocaleString('th-TH')} บาท</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ค่าเบี้ยเลี้ยง:</Text>
          <Text style={styles.value}>{post.allowance.toLocaleString('th-TH')} บาท</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ค่าที่พัก:</Text>
          <Text style={styles.value}>{post.accommodation.toLocaleString('th-TH')} บาท</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ค่าพาหนะ:</Text>
          <Text style={styles.value}>{post.transportation.toLocaleString('th-TH')} บาท</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ค่าใช้จ่ายอื่นๆ:</Text>
          <Text style={styles.value}>{post.expenses.toLocaleString('th-TH')} บาท</Text>
        </View>
      </View>

      {/* รายละเอียดการเดินทาง */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>เดินทางไปปฏิบัติงานเกี่ยวกับ:</Text>
          <Text style={styles.value}>{post.traveler_name1}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>รายละเอียดการเดินทาง:</Text>
          <Text style={styles.value}>{post.trip_details}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>สถานที่เดินทางไปปฏิบัติงาน:</Text>
          <Text style={styles.value}>{post.traveler_name2}</Text>
        </View>
      </View>

      {/* ผู้ร่วมเดินทาง */}
      {post.travelers && post.travelers.length > 0 && (
        <View>
          <View style={styles.divider} />
          <Text style={styles.title}>ผู้ร่วมเดินทาง</Text>
          
          {post.travelers.map((traveler, index) => (
            <View key={`traveler-${index}`} style={styles.section}>
              <Text style={styles.travelerTitle}>ผู้ร่วมเดินทาง {index + 1}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>ชื่อผู้เดินทาง:</Text>
                <Text style={styles.value}>{traveler.traveler_name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>ประเภทบุคลากร:</Text>
                <Text style={styles.value}>{traveler.personnel_type}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>หน่วยงาน:</Text>
                <Text style={styles.value}>{traveler.traveler_relation}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>อีเมล:</Text>
                <Text style={styles.value}>{traveler.email}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>เบอร์โทรศัพท์:</Text>
                <Text style={styles.value}>{traveler.phone}</Text>
              </View>
              {index < post.travelers.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export default TravelPDF;