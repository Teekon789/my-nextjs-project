import { jsPDF } from "jspdf";
import { formatThaiDateTime, formatThaiDate } from '@/utils/dateUtils';

// แมปสำหรับแปลงชื่อตำแหน่งเป็นภาษาไทย
const sendToMapping = {
  dean: "คณบดี",
  head: "หัวหน้าภาควิชา",
  director: "ผู้อำนวยการ"
};

export const generateExpensePDF = async (post) => {
  // กำหนดค่าคงที่สำหรับการจัดวาง
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 8; // ลด margin เพื่อเพิ่มพื้นที่
  const lineSpacing = 6; // ลด lineSpacing เพื่อให้เนื้อหาเข้าในหน้าเดียว

  // สร้าง PDF
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  try {
    // โหลดฟอนต์
    console.log('เริ่มโหลดฟอนต์...');
    const fontResponse = await fetch('/fonts/THSarabunNew.ttf');
    
    if (!fontResponse.ok) {
      throw new Error(`ไม่พบไฟล์ฟอนต์ (HTTP ${fontResponse.status})`);
    }
  
    const fontData = await fontResponse.arrayBuffer();
    const fontBase64 = Buffer.from(fontData).toString('base64');
    
    doc.addFileToVFS('THSarabunNew.ttf', fontBase64);
    doc.addFont('THSarabunNew.ttf', 'THSarabunNew', 'normal');
    doc.setFont('THSarabunNew');

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการโหลดฟอนต์:', error.message);
    alert('ไม่สามารถโหลดฟอนต์ได้ กรุณาลองใหม่อีกครั้ง');
    return;
  }

  // โหลดรูปครุฑ
  const loadGarudaImage = async () => {
    try {
      const response = await fetch("/logo/Garuda.png");
      if (!response.ok) throw new Error(`โหลดรูปภาพไม่สำเร็จ: HTTP ${response.status}`);
  
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดรูป:", error.message);
      return null;
    }
  };

  const garudaBase64 = await loadGarudaImage();

  const drawUnderline = (text, x, y, width) => {
    text = text == null ? "" : String(text);
    const textWidth = doc.getTextWidth(text);
    const textX = x + (width - textWidth) / 2; // จัดข้อความให้อยู่ตรงกลางเส้น
    doc.line(x, y + 2, x + width, y + 2); // วาดเส้นใต้ก่อน
    doc.text(text, textX, y); // วาดข้อความภายหลัง
  };
  

  // ฟังก์ชันตรวจสอบการขึ้นหน้าใหม่
  const checkPageBreak = (currentY) => {
    if (currentY >= pageHeight - margin) {
      doc.addPage();
      return margin;
    }
    return currentY;
  };

  // วาดตราครุฑ
  const garudaWidth = 20; // ลดขนาดตราครุฑ
  const garudaHeight = 20;
  let currentY = margin - 5;
  doc.addImage(garudaBase64, "PNG", (pageWidth - garudaWidth) / 2, currentY, garudaWidth, garudaHeight);

  // หัวเรื่อง
  currentY += garudaHeight + 10; // ลดระยะห่าง
  doc.setFontSize(18); // ลดขนาดฟอนต์
  doc.text("บันทึกการเดินทางไปราชการ", pageWidth / 2, currentY, { align: "center" });

  // ข้อมูลเอกสาร
  doc.setFontSize(14); // ลดขนาดฟอนต์
  currentY += lineSpacing * 2;
  doc.text(`ที่ ${post.department}`, pageWidth - margin - 40, currentY);
  currentY += lineSpacing;
  doc.text(`วันที่ ${formatThaiDate(post.date123)}`, pageWidth - margin - 40, currentY);

  // เรื่องและผู้รับ
  currentY += lineSpacing * 2;
  doc.text("เรื่อง: ขออนุมัติเบิกค่าใช้จ่ายในการเดินทางไปราชการ", margin, currentY);
  currentY += lineSpacing * 1.5;
  doc.text(`เรียน: ${sendToMapping[post.sendTo]}`, margin, currentY);

  // ข้อมูลผู้ยื่น
  currentY += lineSpacing * 2;
  doc.text("ข้าพเจ้า", margin, currentY);
  drawUnderline(post.fullname, margin + 11, currentY, 76);
  
  doc.text("ตำแหน่ง", margin + 90, currentY);
  drawUnderline(post.personnel_type, margin + 102, currentY, 92);

  // สังกัดและผู้ร่วมเดินทาง
  currentY += lineSpacing * 1.5;
  doc.text("สังกัด", margin, currentY);
  drawUnderline(post.department, margin +11 , currentY, 76);

  doc.text("พร้อมด้วย", margin + 90, currentY);
  if (post.travelers && post.travelers.length > 0) {
    drawUnderline(post.travelers[0].traveler_name, margin + 120, currentY, 60);
  }

  // เพิ่มผู้ร่วมเดินทางที่เหลือ
  if (post.travelers && post.travelers.length > 1) {
    post.travelers.slice(1).forEach((traveler, index) => {
      currentY += lineSpacing;
      drawUnderline(`, ${traveler.traveler_name}`, margin, currentY, pageWidth - (margin * 2));
    });
  }

  // ข้อมูลการเดินทาง
  currentY += lineSpacing * 2;
  doc.text("เดินทางไปปฏิบัติงานจังหวัด", margin, currentY);
  drawUnderline(post.province, margin + 38, currentY, 157);

  currentY += lineSpacing * 1.5;
  doc.text("โดยเดินทางวันที่", margin, currentY);
  drawUnderline(formatThaiDateTime(post.departure_date), margin + 22, currentY, 85);

  doc.text("และเดินทางกลับวันที่", margin + 110, currentY);
  drawUnderline(formatThaiDateTime(post.return_date), margin + 138, currentY, 57);

  // รายละเอียดค่าใช้จ่าย
  currentY += lineSpacing * 1;
  doc.text("ข้าพเจ้าได้ขอเบิกค่าใช้จ่ายสำหรับการเดินทางไปราชการ ดังนี้", margin + 10, currentY);

  // ฟังก์ชันวาดรายการค่าใช้จ่าย
  const drawExpenseLine = (label, type, quantity, days, total) => {
    currentY += lineSpacing * 1.5;
    currentY = checkPageBreak(currentY);
    
    doc.text(label, margin, currentY);
    drawUnderline(type, margin + 20, currentY, 88);
    doc.text("จำนวน", margin + 110, currentY);
    drawUnderline(quantity, margin + 130, currentY, 15);
    doc.text("วัน", margin + 155, currentY);
    if (days) {
      drawUnderline(days, margin + 160, currentY, 15);
    }
    doc.text("รวม", margin + 185, currentY);
    drawUnderline(total.toLocaleString('th-TH'), margin + 195, currentY, 25);
    doc.text("บาท", margin + 225, currentY);
  };

  // วาดรายการค่าใช้จ่ายแต่ละประเภท
  currentY += lineSpacing * 2;
  drawExpenseLine("ค่าเบี้ยเลี้ยงเดินทางประเภท", post.allowance_type  , post.allowance_quantity, post.allowance_days, post.allowance);
  drawExpenseLine("ค่าที่พักประเภท", post.accommodation_type, post.accommodation_quantity, post.accommodation_days, post.accommodation);
  drawExpenseLine("ค่าพาหนะประเภท",post.transportation_type, post.Vehicle_quantity, null, post.transportation);
  drawExpenseLine("ค่าใช้จ่ายอื่นๆ", "", "", null, post.expenses);

  // รวมทั้งสิ้น
  currentY += lineSpacing * 2;
  doc.text("รวมทั้งสิ้น", pageWidth - margin - 80, currentY);
  drawUnderline(post.total_budget.toLocaleString('th-TH'), pageWidth - margin - 60, currentY, 40);
  doc.text("บาท", pageWidth - margin - 15, currentY);

  // รายละเอียดการเดินทาง
  currentY += lineSpacing * 2;
  currentY = checkPageBreak(currentY);
  doc.text("รายละเอียดการเดินทาง", margin + 10, currentY);
  
  currentY += lineSpacing * 1.5;
  doc.text("เรื่อง:", margin + 10, currentY);
  drawUnderline(post.trip_details, margin + 25, currentY, pageWidth - (margin * 2) - 25);

  currentY += lineSpacing * 1.5;
  doc.text("สถานที่ปฏิบัติงาน:", margin + 10, currentY);
  drawUnderline(post.traveler_name2, margin + 45, currentY, pageWidth - (margin * 2) - 45);

  // ลายเซ็น
  currentY += lineSpacing * 4;
  currentY = checkPageBreak(currentY);
  doc.text("ลงชื่อ........................................................", pageWidth - margin - 80, currentY);
  currentY += lineSpacing;
  doc.text(`(${post.fullname})`, pageWidth - margin - 80, currentY);
  currentY += lineSpacing;
  doc.text(`ตำแหน่ง ${post.personnel_type}`, pageWidth - margin - 80, currentY);
  currentY += lineSpacing;
  doc.text(`วันที่ ${formatThaiDate(post.date123)}`, pageWidth - margin - 80, currentY);

  // บันทึก PDF
  doc.save(`expense_report_${formatThaiDate(post.date123)}.pdf`);
};