import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import Garuda from '@/logo/Garuda.png';


const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 40,
    backgroundColor: '#ffffff',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
  image: {
    width: 96,
    height: 96,
    alignSelf: 'center',
    marginBottom: 20,
  },
});



const ExpensePDF = ({ post }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Image src={Garuda} style={styles.image} />
        <Text style={styles.header}>บันทึกการเดินทางไปราชการ</Text>
        <Text style={styles.text}>ที่ {post.department}</Text>
        <Text style={styles.text}>วันที่ {formatThaiDate(post.date123)}</Text>
        <Text style={styles.text}>เรื่อง: ขออนุมัติเบิกค่าใช้จ่ายในการเดินทางไปราชการ</Text>
        <Text style={styles.text}>เรียน: {sendToMapping[post.sendTo]}</Text>
        {/* เพิ่มเนื้อหาอื่น ๆ ตามต้องการ */}
      </View>
    </Page>
  </Document>
);

export default ExpensePDF;