import React, { useRef, useState } from 'react';
import { FiX, FiPrinter } from 'react-icons/fi';
import { MdFileDownload, MdPreview } from "react-icons/md";
import { formatThaiDateTime, formatThaiDate } from '@/utils/dateUtils';
import Garuda from '@/logo/Garuda.png';
import Image from 'next/image';

import PDFDocument from '@/components/PDF/PDFDocument';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

// แมปสำหรับแปลงชื่อตำแหน่งเป็นภาษาไทย
const sendToMapping = {
  dean: "คณบดี",
  head: "หัวหน้าภาควิชา",
  director: "ผู้อำนวยการ"
};

const ExpenseForm = ({ post, onClose }) => {
  const printAreaRef = useRef(null);
  const downloadLinkRef = useRef();
  const scrollContainerRef = useRef(null); // เก็บ ref สำหรับ container ที่ใช้เลื่อนแนวนอน
  const [viewPDF, setViewPDF] = useState(false); // สำหรับการสลับโหมดระหว่างดูเอกสาร HTML และ PDF

  if (!post) {
    return <div className="font-sarabun">กำลังโหลดข้อมูล...</div>;
  }

  const handlePrint = () => {
    downloadLinkRef.current?.click();
  };

  const fileName = `บันทึกการเดินทาง-${post.fullname}-${post.date123}.pdf`;
  
  // ฟังก์ชันสลับโหมดการแสดงผล
  const togglePDFView = () => {
    setViewPDF(!viewPDF);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 font-sarabun print:static print:bg-white print:p-0">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible">
        {/* ส่วนหัวของฟอร์ม */}
        <div className="sticky top-0 bg-gray-50 px-6 py-3 border-b flex flex-wrap md:flex-nowrap justify-between 
          items-center print:hidden container mx-auto max-w-screen-lg">
          <h2 className="text-gray-700 font-medium text-sm md:text-base">
            เอกสารเดินทางไปราชการ
          </h2>

          <div className="relative p-2">
            {/* ปุ่มปิด - ตรึงอยู่มุมขวาบนเสมอ */}
            <button 
              onClick={onClose} 
              className="absolute top-2 right-2 p-2 hover:bg-gray-200 rounded-lg transition-colors z-10"
              aria-label="ปิด"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>

            {/* กลุ่มปุ่มหลัก - เลื่อนไปทางซ้ายเพื่อเว้นที่ให้ปุ่มปิด */}
            <div className="pr-12 flex flex-wrap gap-2">
              {/* ปุ่มสลับโหมดการแสดงผล */}
              <button
                onClick={togglePDFView}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
              >
                <MdPreview className="w-5 h-5 text-gray-600" />
                <span>{viewPDF ? 'ดูเอกสาร HTML' : 'ดูเอกสาร PDF'}</span>
              </button>

              {/* ปุ่มดาวน์โหลด PDF */}
              <PDFDownloadLink
                ref={downloadLinkRef}
                document={<PDFDocument post={post} sendToMapping={sendToMapping} formatThaiDate={formatThaiDate} formatThaiDateTime={formatThaiDateTime} />}
                fileName={fileName}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
              >
                {({ loading }) => (
                  <>
                    <MdFileDownload className="w-5 h-5 text-gray-600" />
                    <span>{loading ? 'กำลังโหลด PDF...' : 'ดาวน์โหลด PDF'}</span>
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>

        {/* แสดงตัว PDF viewer หรือแบบฟอร์ม HTML ตามสถานะ viewPDF */}
        {viewPDF ? (
          <div className="w-full h-[80vh]">
            <PDFViewer width="100%" height="100%" className="border-none">
              <PDFDocument 
                post={post} 
                sendToMapping={sendToMapping} 
                formatThaiDate={formatThaiDate} 
                formatThaiDateTime={formatThaiDateTime} 
              />
            </PDFViewer>
          </div>
        ) : (
          /* พื้นที่สำหรับพิมพ์ - แบบฟอร์ม HTML ที่สามารถเลื่อนแนวนอนได้โดยไม่มีปุ่มเลื่อน */
          <div className="p-8 md:p-12 print:p-10">
            {/* Container ที่สามารถเลื่อนแนวนอนได้ */}
            <div 
              id="printArea" 
              ref={scrollContainerRef}
              className="overflow-x-auto hide-scrollbar" 
            >
              <div id="contentArea" className="min-w-[800px] max-w-4xl mx-auto space-y-8 text-gray-800 print:max-w-none">
                {/* ตราครุฑและหัวเรื่อง */}
                <div className="text-center space-y-4">
                  <div className="mx-auto w-24 h-24 mb-4 print:w-20 print:h-20">
                    <Image
                      src={Garuda}
                      alt="ตราครุฑ"
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                      priority
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
        )}
      </div>
    </div>
  );
};



export default ExpenseForm;