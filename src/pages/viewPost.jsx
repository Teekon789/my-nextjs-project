
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import clsx from 'clsx';
import DetailRow from '@/components/DetailRow';
import { formatThaiDateTime } from '@/utils/dateUtils'; //แปลงเวลาเป็นไทย



const ViewPost = () => {
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showTravelers, setShowTravelers] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {
      // ตรวจสอบว่า id มีอยู่ใน query string หรือไม่
      if (router.query.id) {
        const fetchPost = async () => {
          try {
            const { data } = await axios.get(`/api/createPost/${router.query.id}`);
            setPost(data);  // เก็บข้อมูลโพสต์ใน state
  
          } catch (error) {
            console.error('Error fetching post:', error);
          }
        };
        fetchPost(); // เรียกฟังก์ชันเพื่อดึงข้อมูลโพสต์
      }
    }, [router.query.id]);  // ทำงานใหม่เมื่อค่า id เปลี่ยน
  
    const handleToggleDetails = () => setShowDetails((prev) => !prev);
    const handleToggleTravelers = () => setShowTravelers((prev) => !prev);

  //โหลดหน้า
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1000); // หน่วงเวลา 1 วินาที
      }, []);
    
      if (isLoading || !post) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[100px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mb-4"></div>
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        );
      }

     return (
      
      <div className="max-w-[1200px] mx-auto my-12 p-12 bg-gradient-to-br from-white to-gray-100 
                rounded-xl shadow-lg shadow-black/10 text-center font-sarabun
                transition-all duration-300">
       <h1 className="text-xl sm:text-2xl text-black font-bold mb-4 sm:mb-6">
            บันทึกรายละเอียดการเดินทาง
          </h1>

          {/* ข้อมูลการเดินทาง */}
          <div className="flex flex-col space-y-2">
            <DetailRow label="เลขสัญญา:" value={post.contract_number} />
            <DetailRow label="ชื่อเต็ม:" value={post.fullname} />
            <DetailRow label="ตำแหน่ง:" value={post.personnel_type} />
            <DetailRow label="สังกัด:" value={post.department} />
            <DetailRow label="อีเมล:" value={post.email} />
            <DetailRow label="เบอร์โทรศัพท์:" value={post.phone} />
            <DetailRow label="แหล่งเงิน:" value={post.fund_source} />
            <DetailRow label="จังหวัด:" value={post.province} />
            <DetailRow label="วันที่ไปราชการ:" value={formatThaiDateTime(post.trip_date)} />
            <DetailRow label="วันที่ออกเดินทาง:" value={formatThaiDateTime(post.departure_date)} />
            <DetailRow label="วันที่ออกเดินทาง:" value={formatThaiDateTime(post.return_date)} />

             {/* ส่วนแสดงงบประมาณ */}
             <DetailRow
            label="จำนวนเงินรวม:"
            value={`${post.total_budget.toLocaleString('th-TH')} บาท`}
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
                value={`${post.allowance.toLocaleString('th-TH')} บาท`}
              />
              <DetailRow
                label="ค่าที่พัก:"
                value={`${post.accommodation.toLocaleString('th-TH')} บาท`}
              />
              <DetailRow
                label="ค่าพาหนะ:"
                value={`${post.transportation.toLocaleString('th-TH')} บาท`}
              />
              <DetailRow
                label="ค่าใช้จ่ายอื่นๆ:"
                value={`${post.expenses.toLocaleString('th-TH')} บาท`}
              />
            </div>
          )}

            <DetailRow label="เดินทางไปปฏิบัติงานเกี่ยวกับ:" value={post.traveler_name1} />
            <DetailRow label="รายละเอียดการเดินทาง:" value={post.trip_details} />
            <DetailRow label="สถานที่เดินทางไปปฏิบัติงาน:" value={post.traveler_name2} />
          </div>

          {/* ส่วนผู้ร่วมเดินทาง */}
          <button 
            onClick={handleToggleTravelers}
            className="font-sarabun text-gray-600 cursor-pointer underline mx-auto my-6"
          >
            {showTravelers ? 'ซ่อนผู้ร่วมเดินทาง' : 'แสดงผู้ร่วมเดินทาง'}
          </button>

          {showTravelers && post.travelers && (
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
              <p className="text-center font-sarabun my-5">ไม่มีข้อมูลผู้ร่วมเดินทาง</p>
            )
          )}


<div>
<label>
  <Link href="/approval" passHref>
    <button className="mt-8 mb-2 px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md 
    hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition-all duration-200 underline">
      กลับ
    </button>
  </Link>
</label>

    </div>
    
        </div>
     
    );
    
  };

export default ViewPost;