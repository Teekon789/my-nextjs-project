import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../styles/ResultPage.module.css';
import { FiX, FiPrinter } from 'react-icons/fi';

const PostPopup = ({ post: initialPost, onClose }) => {
  const router = useRouter();
  const [post, setPost] = useState(initialPost);  // ใช้ initialPost แทน post
  const [showDetails, setShowDetails] = useState(false);
  const [showTravelers, setShowTravelers] = useState(false);



  useEffect(() => {
    if (router.query.id) {
      const fetchPost = async () => {
        try {
          const { data } = await axios.get(`/api/createPost/${router.query.id}`);
          setPost(data);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };
      fetchPost();
    }
  }, [router.query.id]);


  const handleToggleDetails = () => setShowDetails((prev) => !prev);
  const handleToggleTravelers = () => setShowTravelers((prev) => !prev);


  if (!post) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  


  return (    
    <div className={styles.popupOverlay}>      
    <div className={styles.popupContent}>
    <div className={styles.iconContainer}>
    <button onClick={onClose} className={`${styles.iconButton} ${styles.closeButton}`}>
      <FiX size={20} />
    </button>
    <button className={styles.iconButton}>
      <FiPrinter size={20} />
    </button>
  </div>
  
  <div className=" m-8 ">  </div>
  <div className={styles.container}>
  <h1 className="text-2xl text-black font-bold mb-6 font-sarabun">
          บันทึกรายละเอียดการเดินทาง
      </h1>
      <p className={styles.paragraph}>
      <strong>เลขสัญญา:</strong>
        <span>{post.contract_number}</span>
        </p>
        
        <p className={styles.paragraph}>
        <strong>ชื่อเต็ม:</strong>
        <span>{post.fullname}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>ตําแหน่ง:</strong>
        <span>{post.personnel_type}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>สังกัด:</strong>
        <span>{post.department}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>อีเมล:</strong>
        <span>{post.email}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>เบอร์โทรศัพท์:</strong>
        <span>{post.phone}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>แหล่งเงิน:</strong>
        <span>{post.fund_source}</span>
        </p>
  
  
        <p className={styles.paragraph}>
        <strong>จังหวัด:</strong>
        <span>{post.province}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>วันที่ไปราชการ:</strong>
        <span>{post.trip_date}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>วันที่ออกเดินทาง:</strong>
        <span>{post.departure_date}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>วันที่เดินทางกลับ:</strong>
        <span>{post.return_date}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>ประเภทที่พัก:</strong>
        <span>{post.accommodation_type}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>ประเภทพาหนะ:</strong>
        <span>{post.transportation_type}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>จํานวนเงินรวม: </strong>
        <l className={styles.total_budget123}>
            {post.total_budget} <t className={styles.total_budget456}> บาท</t>
            
            <button onClick={handleToggleDetails}
        className={styles.toggleButton} style={{
          transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)', // หมุนสามเหลี่ยม
        }}
      >
        ▼
            </button>
        </l>
        </p>
        {showDetails && (
          <div className={styles.details}>
            <p className={styles.paragraph}>
              <strong>ค่าเบี้ยเลี้ยง:</strong> {post.allowance} บาท
            </p>
            <p className={styles.paragraph}>
              <strong>ค่าที่พัก:</strong> {post.accommodation} บาท
            </p>
            <p className={styles.paragraph}>
              <strong>ค่าพาหนะ:</strong> {post.transportation} บาท
            </p>
            <p className={styles.paragraph}>
              <strong>ค่าใช้จ่ายอื่นๆ:</strong> {post.expenses} บาท
            </p>
            </div>
        )}
  
        <p className={styles.paragraph}>
        <strong>เดินทางไปปฏิบัติงานเกี่ยวกับ:</strong>
        <span>{post.traveler_name1}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>รายละเอียดการเดินทาง:</strong>
        <span>{post.trip_details}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>สถานที่เดินทางไปปฏิบัติงาน:</strong>
        <span>{post.traveler_name2}</span>
        </p>
  
        <p className={styles.paragraph}>
        <strong>ประเภทการเดินทาง:</strong>
        <span>{post.trip_type}</span>
        </p >
    
        <label className={styles.lb1} onClick={handleToggleTravelers}>
    {showTravelers ? 'ซ่อนผู้ร่วมเดินทาง' : 'แสดงผู้ร่วมเดินทาง'}
    </label>  
        {/* แสดงข้อมูลผู้ร่วมเดินทางเมื่อ showTravelers เป็น true */}
        {showTravelers && post.travelers && <hr className={styles.after} />}
        {showTravelers && post.travelers && post.travelers.length > 0 ? (
              post.travelers.map((traveler, index) => (        
            
            <div key={index} className={styles.traveler}>          
              <h2 className={styles.htr2}>ผู้ร่วมเดินทาง {index + 1}</h2>
              <p className={styles.paragraph}><strong>ชื่อผู้เดินทาง:</strong> {traveler.traveler_name}</p>
              <p className={styles.paragraph}><strong>ประเภทบุคลากร:</strong> {traveler.personnel_type}</p>
              <p className={styles.paragraph}><strong>หน่วยงาน:</strong> {traveler.traveler_relation}</p>
              <p className={styles.paragraph}><strong>อีเมล:</strong> {traveler.email}</p>
              <p className={styles.paragraph}><strong>เบอร์โทรศัพท์:</strong> {traveler.phone}</p>
              <div className={styles.after}></div>
              </div>
                ))
                ) : showTravelers && (
            <p className={styles.tp}>ไม่มีข้อมูลผู้ร่วมเดินทาง</p>
        ) }
     
      
    </div>
    
    </div>
    </div>
    
    
  );
  
};

export default PostPopup;
