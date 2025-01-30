import React, { useState, useEffect } from 'react';

const PostGraph = ({ posts }) => {
  const [postCounts, setPostCounts] = useState([]);
  const [currentTime, setCurrentTime] = useState("");  // สำหรับเก็บเวลาเรียลไทม์

  useEffect(() => {
    // ฟังก์ชันเพื่อให้เวลาปัจจุบันอัปเดตทุกๆ 1 วินาที
    const interval = setInterval(() => {
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');  // เพิ่ม 0 ด้านหน้าวันถ้าวันน้อยกว่า 10
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');  // เดือนต้องเพิ่ม 1 เพราะ index เริ่มที่ 0
      const year = currentDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;  // รูปแบบวันที่ "DD/MM/YYYY"
      
      // ดึงเวลาในรูปแบบ "HH:MM:SS"
      const hours = currentDate.getHours().toString().padStart(2, '0');  // เพิ่ม 0 ด้านหน้าชั่วโมงถ้าน้อยกว่า 10
      const minutes = currentDate.getMinutes().toString().padStart(2, '0');  // เพิ่ม 0 ด้านหน้าถ้านาทีต่ำกว่า 10
      const seconds = currentDate.getSeconds().toString().padStart(2, '0');  // เพิ่ม 0 ด้านหน้าวินาทีถ้าน้อยกว่า 10
      const formattedTime = `${hours}:${minutes}:${seconds}`;  // รูปแบบเวลา "HH:MM:SS"

      setCurrentTime(`${formattedDate} ${formattedTime}`);  // อัพเดทเวลาเรียลไทม์
    }, 1000); // อัปเดตทุกๆ 1 วินาที

    // ทำความสะอาดเมื่อคอมโพเนนต์ถูก unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Array.isArray(posts) && posts.length > 0) {
      const groupedData = groupPostsByDate(posts);
      setPostCounts(groupedData);
    }
  }, [posts]);

  // ฟังก์ชันในการจัดกลุ่มโพสต์ตามวันที่
  const groupPostsByDate = (posts) => {
    const dateCounts = {};
    posts.forEach((post) => {
      const date = new Date(post.createdAt).toLocaleDateString(); // ดึงวันที่ของโพสต์
      const formattedDate = isNaN(Date.parse(date)) ? 'วันที่ไม่ถูกต้อง' : date; // เปลี่ยนคำถ้าวันที่ไม่ถูกต้อง
      if (dateCounts[formattedDate]) {
        dateCounts[formattedDate]++;
      } else {
        dateCounts[formattedDate] = 1;
      }
    });

    const dates = Object.keys(dateCounts);
    const counts = Object.values(dateCounts);

    return { dates, counts };
  };

  return (
    <div style={styles.container}>
      <div style={styles.counterContainer}>
        {postCounts.dates && postCounts.dates.map((date, index) => (
          <div key={date} style={styles.counterBox}>
            {/* แสดงเวลาเรียลไทม์แทนวันที่ */}
            <div style={styles.date}>{currentTime}</div>
            <div style={styles.count}>
              <span style={styles.countNumber}>{postCounts.counts[index]}</span>
              <span style={styles.countLabel}>โพสต์</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    width: '100%',
    display: 'flex',
    marginLeft: '1%',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  counterContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  counterBox: {
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  date: {
    fontSize: '20px',
    color: '#555',
    fontWeight: '600',
    marginBottom: '10px',
  },
  count: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  countNumber: {
    fontSize: '40px',
    fontWeight: '700',
    color: '#0070f3',
    animation: 'countAnimation 1s ease-in-out',
  },
  countLabel: {
    fontSize: '18px',
    color: '#555',
    marginTop: '5px',
  },
};

export default PostGraph;
