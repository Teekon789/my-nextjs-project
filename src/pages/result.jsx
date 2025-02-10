//result.jsx

import React from 'react'; // import React เท่านั้น
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'; // useState มาจากตรงนี้
import axios from 'axios';
import clsx from 'clsx';
import DetailRow from '@/components/DetailRow';
import { formatThaiDateTime } from '@/utils/dateUtils'; //แปลงเวลาเป็นไทย


const Result = () => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTravelers, setShowTravelers] = useState(false);
  const { id } = router.query; // ดึง id จาก query
  const [success, setSuccess] = useState(false); // สถานะการบันทึก
  const [error, setError] = useState(null); // สถานะข้อผิดพลาก
  
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

  // หากยังไม่มีข้อมูลโพสต์จะแสดงข้อความ "กำลังโหลด..."
  if (!post) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

   // ฟังก์ชันบันทึกข้อมูล
   
   const handleSave = async () => {
    try {
      
      // ส่งข้อมูลที่อัปเดตไปที่ API โดยใช้ PUT
      const response = await axios.put(`/api/createPost/${id}`, {
        fullname: post.fullname,
        personnel_type: post.personnel_type,
        email: post.email,
        // เพิ่มข้อมูลอื่น ๆ ที่ต้องการอัปเดต
      });

      console.log('Post updated successfully:', response.data);
      setSuccess(true); // การบันทึกสำเร็จ
      setError(null); // เคลียร์ข้อผิดพลาด

      // ทำการรีไดเร็กต์ไปที่หน้ารายละเอียดโพสต์ หรือ ไปหน้า Approval
      router.push(`/approval`); 
    } catch (error) {
      console.error('Error updating post:', error);
      setError('ไม่สามารถบันทึกข้อมูลได้');
    }
  };
   
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
            value={`${post.total_budget} บาท`}
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
              <DetailRow label="ค่าเบี้ยเลี้ยง:" value={`${post.allowance} บาท`} />
              <DetailRow label="ค่าที่พัก:" value={`${post.accommodation} บาท`} />
              <DetailRow label="ค่าพาหนะ:" value={`${post.transportation} บาท`} />
              <DetailRow label="ค่าใช้จ่ายอื่นๆ:" value={`${post.expenses} บาท`} />
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
          <button onClick={handleSave}>บันทึก
            
          </button>
          {success && <div>บันทึกข้อมูลสำเร็จ!</div>} {/* แสดงข้อความสำเร็จ */}
      {error && <div>{error}</div>} {/* แสดงข้อผิดพลาด */}
      </div>
    </div>   
    
  );
  
};

export default Result;
