//TravelPDF.tsx

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// ลงทะเบียนฟอนต์
Font.register({
  family: 'THSarabun',
  fonts: [
    { src: '/fonts/THSarabunNew.ttf', fontWeight: 'normal' },
    { src: '/fonts/THSarabunNew Bold.ttf', fontWeight: 'bold' }
  ]
});

// ป้องกันการตัดคำภาษาไทย
Font.registerHyphenationCallback(word => [word]);

// กำหนดสไตล์
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'THSarabun',
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

// ฟังก์ชันเพื่อตรวจสอบและแปลงข้อมูลตัวเลขให้ปลอดภัย
const safeNumber = (value: any): string => {
  if (value === undefined || value === null) return '0';
  return typeof value === 'number' ? value.toLocaleString('th-TH') : '0';
};

// ฟังก์ชันเพื่อตรวจสอบและแปลงข้อมูลสตริงให้ปลอดภัย
const safeString = (value: any): string => {
  if (value === undefined || value === null) return '';
  return String(value);
};

interface Traveler {
  traveler_name?: string;
  personnel_type?: string;
  traveler_relation?: string;
  email?: string;
  phone?: string;
}

interface PostData {
  contract_number?: string;
  fullname?: string;
  personnel_type?: string;
  department?: string;
  email?: string;
  phone?: string;
  fund_source?: string;
  province?: string;
  trip_date?: string;
  departure_date?: string;
  return_date?: string;
  total_budget?: number;
  allowance?: number;
  accommodation?: number;
  transportation?: number;
  expenses?: number;
  traveler_name1?: string;
  trip_details?: string;
  traveler_name2?: string;
  travelers?: Traveler[];
}

// Helper for Thai date formatting
const formatThaiDateTime = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (e) {
    return dateString;
  }
};

// สร้าง Component PDF Document
const TravelPDF = ({ post }: { post?: PostData }) => {
  // ตรวจสอบว่ามี post หรือไม่ (ป้องกัน null props)
  const safePost = post || {};
  
  // ตรวจสอบว่ามี travelers หรือไม่
  const travelers = Array.isArray(safePost.travelers) ? safePost.travelers : [];
  
  // สร้าง empty document ถ้าไม่มีข้อมูล
  if (!safePost || Object.keys(safePost).length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>ไม่พบข้อมูลการเดินทาง</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>บันทึกรายละเอียดการเดินทาง</Text>
        
        {/* ข้อมูลการเดินทาง */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>เลขสัญญา:</Text>
            <Text style={styles.value}>{safeString(safePost.contract_number)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ชื่อเต็ม:</Text>
            <Text style={styles.value}>{safeString(safePost.fullname)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ตำแหน่ง:</Text>
            <Text style={styles.value}>{safeString(safePost.personnel_type)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>สังกัด:</Text>
            <Text style={styles.value}>{safeString(safePost.department)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>อีเมล:</Text>
            <Text style={styles.value}>{safeString(safePost.email)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>เบอร์โทรศัพท์:</Text>
            <Text style={styles.value}>{safeString(safePost.phone)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>แหล่งเงิน:</Text>
            <Text style={styles.value}>{safeString(safePost.fund_source)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>จังหวัด:</Text>
            <Text style={styles.value}>{safeString(safePost.province)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>วันที่ไปราชการ:</Text>
            <Text style={styles.value}>{safeString(formatThaiDateTime(safePost.trip_date))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>วันที่ออกเดินทาง:</Text>
            <Text style={styles.value}>{safeString(formatThaiDateTime(safePost.departure_date))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>วันที่กลับ:</Text>
            <Text style={styles.value}>{safeString(formatThaiDateTime(safePost.return_date))}</Text>
          </View>
        </View>

        {/* ส่วนงบประมาณ */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>จำนวนเงินรวม:</Text>
            <Text style={styles.value}>{safeNumber(safePost.total_budget)} บาท</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ค่าเบี้ยเลี้ยง:</Text>
            <Text style={styles.value}>{safeNumber(safePost.allowance)} บาท</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ค่าที่พัก:</Text>
            <Text style={styles.value}>{safeNumber(safePost.accommodation)} บาท</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ค่าพาหนะ:</Text>
            <Text style={styles.value}>{safeNumber(safePost.transportation)} บาท</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ค่าใช้จ่ายอื่นๆ:</Text>
            <Text style={styles.value}>{safeNumber(safePost.expenses)} บาท</Text>
          </View>
        </View>

        {/* รายละเอียดการเดินทาง */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>เดินทางไปปฏิบัติงานเกี่ยวกับ:</Text>
            <Text style={styles.value}>{safeString(safePost.traveler_name1)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>รายละเอียดการเดินทาง:</Text>
            <Text style={styles.value}>{safeString(safePost.trip_details)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>สถานที่เดินทางไปปฏิบัติงาน:</Text>
            <Text style={styles.value}>{safeString(safePost.traveler_name2)}</Text>
          </View>
        </View>

        {/* ผู้ร่วมเดินทาง (แสดงเมื่อมีข้อมูล) */}
        {travelers.length > 0 && (
          <View>
            <View style={styles.divider} />
            <Text style={styles.title}>ผู้ร่วมเดินทาง</Text>
            
            {travelers.map((traveler, index) => (
              <View key={`traveler-${index}`} style={styles.section}>
                <Text style={styles.travelerTitle}>ผู้ร่วมเดินทาง {index + 1}</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>ชื่อผู้เดินทาง:</Text>
                  <Text style={styles.value}>{safeString(traveler.traveler_name)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>ประเภทบุคลากร:</Text>
                  <Text style={styles.value}>{safeString(traveler.personnel_type)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>หน่วยงาน:</Text>
                  <Text style={styles.value}>{safeString(traveler.traveler_relation)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>อีเมล:</Text>
                  <Text style={styles.value}>{safeString(traveler.email)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>เบอร์โทรศัพท์:</Text>
                  <Text style={styles.value}>{safeString(traveler.phone)}</Text>
                </View>
                {index < travelers.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default TravelPDF;