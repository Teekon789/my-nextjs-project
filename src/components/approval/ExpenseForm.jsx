import React, { useRef } from 'react';
import { FiX, FiPrinter } from 'react-icons/fi';
import { formatThaiDateTime, formatThaiDate } from '@/utils/dateUtils'; 
import Garuda from '@/logo/Garuda.png';
import Image from 'next/image';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ExpenseForm = ({ post, onClose }) => {
  const printAreaRef = useRef(null);

  if (!post) {
    return <div className="font-sarabun">กำลังโหลดข้อมูล...</div>;
  }

  // ฟังก์ชันสร้าง PDF
  const generatePDF = async () => {
    const input = document.getElementById("printArea");
    
    // กำหนดค่าคงที่สำหรับกระดาษ A4 (มิลลิเมตร)
    const a4Width = 210;
    const a4Height = 297;
    const margin = 0; // ลดขอบลงเพื่อให้เนื้อหาเต็มหน้า
    
    // ปรับ scale เพื่อความคมชัด แต่ไม่ส่งผลต่อขนาดสุดท้าย
    const scale = 3;
    
    const canvas = await html2canvas(input, {
      scale: scale,
      useCORS: true,
      logging: true,
      allowTaint: true,
      letterRendering: true,
      width: input.offsetWidth,
      height: input.offsetHeight
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true
    });
    
    // คำนวณขนาดเพื่อให้พอดีกับกระดาษ A4 โดยไม่บีบเนื้อหา
    pdf.addImage(imgData, "PNG", margin, margin, a4Width - 2*margin, a4Height - 2*margin, '', 'FAST');
    
    pdf.save("Expense_Report.pdf");
  };
  
  

  //เปลี่ยนชื่อไทย
  const sendToMapping = {
    dean: "คณบดี",
    head: "หัวหน้าภาควิชา",
    director: "ผู้อำนวยการ"
  };

  return (
   // คอนเทนเนอร์หลัก - ปรับแต่งสำหรับการพิมพ์
   <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 font-sarabun print:static print:bg-white print:p-0 ">
   {/* กล่องเนื้อหาหลัก - ปรับขนาดและสไตล์สำหรับการพิมพ์ */}
   <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible print:shadow-none print:rounded-none">
     {/* ส่วนหัว - ซ่อนปุ่มควบคุมเมื่อพิมพ์ */}
     <div className="sticky top-0 bg-gray-50 px-6 py-3 border-b flex justify-between items-center print:hidden">
       <h2 className="text-gray-700 font-medium">เอกสารเดินทางไปราชการ</h2>
       <div className="flex gap-2">
         <button onClick={generatePDF} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
           <FiPrinter className="w-5 h-5 text-gray-600" />
         </button>
         <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
           <FiX className="w-5 h-5 text-gray-600" />
         </button>
       </div>
     </div>

        {/* พื้นที่เนื้อหาสำหรับพิมพ์ - ปรับระยะขอบและการจัดวาง */}
        <div id="printArea" className="p-8 md:p-12 print:p-10">
          {/* เพิ่ม padding สำหรับการพิมพ์เพื่อไม่ให้เนื้อหาทับกับเส้นขอบ */}
          <div className="max-w-4xl mx-auto space-y-8 text-gray-800 print:max-w-none">
            {/* ส่วนหัวเอกสาร */}
            <div className="text-center space-y-4">
              <div className="mx-auto w-24 h-24 mb-4 print:w-20 print:h-20">
                <Image
                  src={Garuda}
                  alt="Logo"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain print:w-20 print:h-20"
                />
              </div>
              <h1 className="text-2xl font-bold print:text-xl">บันทึกการเดินทางไปราชการ</h1>
            </div>


           {/* ส่วนข้อมูลเอกสาร */}
          <div className="text-right space-y-1">
            <p>ที่ {post.department}</p>
            <p>วันที่ {formatThaiDate(post.date123)}</p>
          </div>

            {/* Contract Details */}
            <div className="space-y-4 border-b pb-6">
              <div>
                <p>เรื่อง: ขออนุมัติเบิกค่าใช้จ่ายในการเดินทางไปราชการ</p>
                <p>เรียน: {sendToMapping[post.sendTo]}</p>
              </div>
              
              <div className="text-start">
                {/* แถวแรก - ข้อมูลผู้ยื่นและตำแหน่ง */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start">
                    <span className="flex-shrink-0 whitespace-nowrap">ข้าพเจ้า</span>
                    <span className="border-b border-gray-400 pb-1 print:pb-0  flex-grow text-center px-4 min-h-[24px]">{post.fullname}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="flex-shrink-0 whitespace-nowrap">ตำแหน่ง</span>
                    <span className="border-b border-gray-400 pb-1 print:pb-0 flex-grow text-center px-4 min-h-[24px]">{post.personnel_type}</span>
                  </div>
                </div>

                {/* แถวที่สอง - สังกัดและผู้ร่วมเดินทาง */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <span className="flex-shrink-0 whitespace-nowrap">สังกัด</span>
                    <span className="border-b border-gray-400   pb-1 print:pb-0 flex-grow text-center px-4 min-h-[24px]">{post.department}</span>
                  </div>
                  
                  {/* ผู้ร่วมเดินทางคนแรก */}
                  <div className="flex items-start">
                    <span className="flex-shrink-0 whitespace-nowrap">พร้อมด้วย</span>
                    <span className="border-b border-gray-400  pb-1 print:pb-0 flex-grow text-center px-4 min-h-[24px]">
                      {post.travelers && post.travelers.length > 0 ? post.travelers[0].traveler_name : '\u00A0'}
                    </span>
                  </div>
                </div>

                {/* ผู้ร่วมเดินทางคนที่ 2 เป็นต้นไป - แยกออกมาจาก grid และจัดให้อยู่ด้านซ้ายเต็มแถว */}
                {post.travelers && post.travelers.length > 1 && post.travelers.slice(1).map((traveler, index) => (
                  <div key={index} className="mt-1 flex">
                    <div className="w-full border-b border-gray-400  pb-1 print:pb-0  text-justify px-4 min-h-[24px]">,{traveler.traveler_name}</div>
                  </div>
                ))}
              </div>

              {/* แถวที่3 */}
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 whitespace-nowrap">เดินทางไปปฏิบัติงานจังหวัด</span>
                <span className="border-b border-gray-400  pb-1 print:pb-0  flex-grow text-center px-4 min-h-[24px]">{post.province}</span>
              </div>

              {/* แถวที่4 */}     
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <span className="flex-shrink-0 whitespace-nowrap">โดยเดินทางวันที่</span>
                  <span className="border-b border-gray-400  pb-1 print:pb-0 flex-grow text-center px-2 min-h-[24px]">{formatThaiDateTime(post.departure_date)}</span>
                </div>
                <div className="flex items-center">
                  <span className="flex-shrink-0 whitespace-nowrap">และเดินทางกลับวันที่</span>
                  <span className="border-b border-gray-400  pb-1 print:pb-0 flex-grow text-center px-2 min-h-[24px]">{formatThaiDateTime(post.return_date)}</span>
                </div>
              </div>
            </div>

            {/* Budget Details */}
            <div className="mb-6 space-y-4">
              <h2 className="font-sarabun translate-x-10">ข้าพเจ้าได้ขอเบิกค่าใช้จ่ายสำหรับการเดินทางไปราชการ ดังนี้</h2>
            </div>
                        
            {/* Allowance */}
            <div className="flex items-center w-full">
              <span className="mr-2">ค่าเบี้ยเลี้ยงเดินทางประเภท</span>
              <span className="flex-grow border-b text-center border-gray-400  px-2  pb-1 print:pb-0 min-h-[24px]">{post.allowance_type}</span>
              <span className="ml-2">จำนวน</span>
              <span className="w-12 text-center border-b border-gray-400  pb-1 print:pb-0 min-h-[24px]">{post.allowance_quantity}</span>
              <span className="ml-2">วัน</span>
              <span className="w-16 text-center border-b border-gray-400  pb-1 print:pb-0 min-h-[24px]">{post.allowance_days}</span>
              <span className="ml-2">รวม</span>
              <span className="w-20 text-center border-b border-gray-400  pb-1 print:pb-0 min-h-[24px]">{`${post.allowance.toLocaleString('th-TH')}`}</span>
              <span className="ml-2">บาท</span>
            </div>

            {/* Accommodation */}
            <div className="flex items-center w-full">
              <span className="mr-2">ค่าที่พักประเภท</span>
              <span className="flex-grow border-b text-center border-gray-400 px-2  pb-1 print:pb-0 min-h-[24px]">{post.accommodation_type}</span>
              <span className="ml-2">จำนวน</span>
              <span className="w-12 text-center border-b border-gray-400  pb-1 print:pb-0 min-h-[24px]">{post.accommodation_quantity}</span>
              <span className="ml-2">วัน</span>
              <span className="w-16 text-center border-b border-gray-400  pb-1 print:pb-0 min-h-[24px]">{post.accommodation_days}</span>
              <span className="ml-2">รวม</span>
              <span className="w-20 text-center border-b border-gray-400  pb-1 print:pb-0 min-h-[24px]">{`${post.accommodation.toLocaleString('th-TH')}`}</span>
              <span className="ml-2">บาท</span>
            </div>

            {/* Transportation */}
            <div className="flex items-center w-full">
              <span className="mr-2">ค่าพาหนะประเภท</span>
              <span className="flex-grow border-b text-center border-gray-400 px-2  pb-1 print:pb-0 min-h-[24px]">{post.transportation_type}</span>
              <span className="ml-2">จำนวน</span>
              <span className="w-[139px] text-center border-b border-gray-400  pb-1 print:pb-0 min-h-[24px]">{post.Vehicle_quantity}</span>
              <span className="ml-2">รวม</span>
              <span className="w-20 text-center border-b border-gray-400  pb-1 print:pb-0 min-h-[24px]">{`${post.transportation.toLocaleString('th-TH')}`}</span>
              <span className="ml-2">บาท</span>
            </div>

            {/* Other Expenses */}
            <div className="flex items-end w-full">
              <span className="mr-2 whitespace-nowrap">ค่าใช้จ่ายอื่นๆ</span>
              <div className="flex-grow border-b border-gray-400 mb-px  pb-1 print:pb-0 min-h-[24px]"></div>
              <span className="ml-2">รวม</span>
              <span className="w-20 text-center border-b border-gray-400 mb-px  pb-1 print:pb-0 min-h-[24px]">{`${post.expenses.toLocaleString('th-TH')}`}</span>
              <span className="ml-2">บาท</span>
            </div>

            <div className="w-full font-sarabun border-b pb-6 ">
              <div className="flex justify-end">
                <span className=" mr-2">รวมทั้งสิ้น</span>
                <span className="w-[74px] text-center border-b border-gray-600  px-1 font-bold  pb-1 print:pb-0 min-h-[24px]">{`${post.total_budget.toLocaleString('th-TH')}`}</span>
                <span className="ml-2  ">บาท</span>
              </div>
            </div>

            

            {/* Trip Details */}
            <div className="space-y-4 ">
              <h2 className="translate-x-10">รายละเอียดการเดินทาง</h2>
              <div className="pl-8 space-y-2">
                <div className="flex items-center w-full">
                  <span className="flex-shrink-0 whitespace-nowrap">เรื่อง:</span>
                  <span className="flex-grow border-b border-gray-400 text-center px-2 ml-2  pb-1 print:pb-0 min-h-[24px]">{post.trip_details}</span>
                </div>
                <div className="flex items-center w-full">
                  <span className="flex-shrink-0 whitespace-nowrap">สถานที่ปฏิบัติงาน:</span>
                  <span className="flex-grow border-b border-gray-400 text-center px-2 ml-2  pb-1 print:pb-0 min-h-[24px]">{post.traveler_name2}</span>
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="text-right space-y-2 pt-8">
              <p>ลงชื่อ.....................................................</p>
              <p>({post.fullname})</p>
              <p>ตำแหน่ง {post.personnel_type}</p>
              <p>วันที่ {formatThaiDate(post.date123)}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;