//PostPopup.tsx

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FiX } from 'react-icons/fi';
import DetailRow from '@/components/DetailRow';
import { formatThaiDateTime } from '@/utils/dateUtils';
import clsx from 'clsx';

// ใช้ dynamic import แบบ client-side only สำหรับ PDFDownloadButton
const PDFDownloadButton = dynamic(
  () => import('@/components/PDFDownloadButton'),
  { 
    ssr: false,
    loading: () => <div className="text-gray-400">กำลังโหลด...</div>
  }
);

const SEND_TO_MAPPING = {
  'dean': 'คณบดี',
  'head': 'หัวหน้าภาควิชา',
  'director': 'ผู้อำนวยการ'
};


interface Traveler {
  traveler_name?: string;
  personnel_type?: string;
  traveler_relation?: string;
  email?: string;
  phone?: string;
}

interface PostProps {
  post: {
    contract_number?: string;
    fullname?: string;
    personnel_type?: string;
    department?: string;
    email?: string;
    phone?: string;
    fund_source?: string;
    province?: string;
    trip_date?: string;
    trip_date_end?: string;
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
    agency_name?: string;
    travelers?: Traveler[];
    status?: string;
    reject_reason?: string;
    approvedAt?: string;
    approvedBy?: string;
    approverName?: string;
    rejectedAt?: string;
    rejectedBy?: string;
    rejectorName?: string;
    sendTo?: 'dean' | 'head' | 'director';

  };
  onClose: () => void;
}



const PostPopup: React.FC<PostProps> = ({ post, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showTravelers, setShowTravelers] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // ตรวจสอบว่าอยู่ใน client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Toggle แสดง/ซ่อนรายละเอียด
  const handleToggleDetails = () => setShowDetails(prev => !prev);
  const handleToggleTravelers = () => setShowTravelers(prev => !prev);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-2 sm:p-4 overflow-hidden">
      <div className="relative w-[95%] sm:w-[90%] max-w-[600px] max-h-[90vh] bg-white p-3 sm:p-5 rounded-lg shadow-lg overflow-y-auto mx-auto z-[1000] 
      transition-all duration-300 ease-in-out text-center">
        
          {/* ปุ่มด้านบน */}
          <div className="sticky top-2 right-2 flex justify-end gap-4 z-10">
          <button 
            onClick={onClose} 
            title="ปิดหน้าต่าง"
            className="flex items-center justify-center text-red-500 hover:text-red-600 transition-all duration-300 p-1"
          >
            <FiX size={20} />
          </button>
          
          {/* ปุ่มดาวน์โหลด PDF - ใช้ dynamic import แทน */}
          {isClient && <PDFDownloadButton post={post} />}
        </div>

         {/* ส่วนแสดงสถานะ */}
         <div className="mt-4 mb-6">
          <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">สถานะเอกสาร</h2>
            
            {/* แสดงผู้รับเอกสาร */}
            <div className="text-sm text-gray-600 mb-2">
              ส่งถึง: {SEND_TO_MAPPING[post.sendTo] || 'ไม่ระบุ'}
            </div>
            
            {/* แสดงสถานะ */}
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              post.status === "pending" ? "bg-yellow-100 text-yellow-700" :
              post.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
              "bg-red-100 text-red-700"
            }`}>
              {post.status === "pending" ? "รอการอนุมัติ" :
               post.status === "Approved" ? "อนุมัติแล้ว" :
               "ไม่อนุมัติ"}
            </div>

            {/* รายละเอียดการอนุมัติ */}
            {post.status === "Approved" && post.approvedAt && (
              <div className="text-sm text-gray-600">
                <p>ผู้อนุมัติ: {SEND_TO_MAPPING[post.sendTo]}</p>
                <p>วันที่อนุมัติ: {formatThaiDateTime(post.approvedAt)}</p>
              </div>
            )}

            {/* รายละเอียดการปฏิเสธ */}
            {post.status === "Rejected" && (
              <div className="w-full max-w-md p-3 bg-red-50 rounded-lg">
                <p className="font-medium text-red-800">เหตุผลที่ไม่อนุมัติ</p>
                <p className="text-red-600 mt-1">{post.reject_reason}</p>
                {post.rejectedAt && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>ผู้ปฏิเสธ: {SEND_TO_MAPPING[post.sendTo]}</p>
                    <p>วันที่ปฏิเสธ: {formatThaiDateTime(post.rejectedAt)}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* เนื้อหาหลัก */}
        <div className="mt-4">
          <h1 className="text-xl sm:text-2xl text-black font-bold mb-4 sm:mb-6">
            บันทึกรายละเอียดการเดินทาง
          </h1>

          {/* ข้อมูลการเดินทาง */}
          <div className="flex flex-col space-y-2">
            <DetailRow label="เลขสัญญา:" value={post.contract_number} />
            <DetailRow label="ชื่อเต็ม:" value={post.fullname} />
            <DetailRow label="ตำแหน่ง:" value={post.personnel_type} />
            <DetailRow label="ส่วนราขการ:" value={post.department} />
            <DetailRow label="ที่:" value={post.agency_name} />
            <DetailRow label="อีเมล:" value={post.email} />
            <DetailRow label="เบอร์โทรศัพท์:" value={post.phone} />
            <DetailRow label="แหล่งเงิน:" value={post.fund_source} />
            <DetailRow label="จังหวัด:" value={post.province} />
            <DetailRow label="วันที่ไปราชการ:" value={formatThaiDateTime(post.trip_date)} />
            <DetailRow label="วันที่สิ้นสุดการเดินทางไปราชการ:" value={formatThaiDateTime(post.trip_date_end)} />
            <DetailRow label="วันที่ออกเดินทาง:" value={formatThaiDateTime(post.departure_date)} />
            <DetailRow label="วันที่กลับ:" value={formatThaiDateTime(post.return_date)} />

            {/* ส่วนแสดงงบประมาณ */}
            <DetailRow
              label="จำนวนเงินรวม:"
              value={`${post.total_budget?.toLocaleString('th-TH') || '0'} บาท`}
              action={
                <button onClick={handleToggleDetails} className="text-sm">
                  <span className={clsx("transition-transform duration-200 block", { "rotate-180": showDetails })}>
                    ▼
                  </span>
                </button>
              }
            />

            {/* รายละเอียดค่าใช้จ่าย */}
            {showDetails && (
              <div className="space-y-3 mb-4">
                <DetailRow
                  label="ค่าเบี้ยเลี้ยง:"
                  value={`${post.allowance?.toLocaleString('th-TH') || '0'} บาท`}
                />
                <DetailRow
                  label="ค่าที่พัก:"
                  value={`${post.accommodation?.toLocaleString('th-TH') || '0'} บาท`}
                />
                <DetailRow
                  label="ค่าพาหนะ:"
                  value={`${post.transportation?.toLocaleString('th-TH') || '0'} บาท`}
                />
                <DetailRow
                  label="ค่าใช้จ่ายอื่นๆ:"
                  value={`${post.expenses?.toLocaleString('th-TH') || '0'} บาท`}
                />
              </div>
            )}

            <DetailRow label="เดินทางไปปฏิบัติงานเกี่ยวกับ:" value={post.traveler_name1} />
            <DetailRow label="รายละเอียดการเดินทาง:" value={post.trip_details} />
            <DetailRow label="สถานที่เดินทางไปปฏิบัติงาน:" value={post.traveler_name2} />
          </div>

          {/* ส่วนผู้ร่วมเดินทาง */}
          {post.travelers && post.travelers.length > 0 && (
            <button 
              onClick={handleToggleTravelers}
              className="text-gray-600 cursor-pointer underline mx-auto my-6"
            >
              {showTravelers ? 'ซ่อนผู้ร่วมเดินทาง' : 'แสดงผู้ร่วมเดินทาง'}
            </button>
          )}

          {showTravelers && post.travelers && post.travelers.length > 0 && (
            <div className="border-t border-black/50 w-full my-6" />
          )}

          {/* รายชื่อผู้ร่วมเดินทาง */}
          {showTravelers && post.travelers && post.travelers.length > 0 ? (
            post.travelers.map((traveler, index) => (
              <div key={index} className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold mb-4">ผู้ร่วมเดินทาง {index + 1}</h2>
                <DetailRow label="ชื่อผู้เดินทาง:" value={traveler.traveler_name} />
                <DetailRow label="ประเภทบุคลากร:" value={traveler.personnel_type} />
                <DetailRow label="หน่วยงาน:" value={traveler.traveler_relation} />
                <DetailRow label="อีเมล:" value={traveler.email} />
                <DetailRow label="เบอร์โทรศัพท์:" value={traveler.phone} />
                <div className="border-t border-black/50 w-full my-6" />
              </div>
            ))
          ) : (
            showTravelers && (
              <p className="text-center my-5">ไม่มีข้อมูลผู้ร่วมเดินทาง</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPopup;
