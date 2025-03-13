
/**
 * ฟังก์ชันแปลงวันที่เป็นรูปแบบไทย
 * @param dateString วันที่ในรูปแบบ string
 * @returns วันที่ในรูปแบบไทย
 */
export const formatThaiDateTime = (dateString?: string): string => {
    if (!dateString) return '';
    
    try {
      // ถ้าเป็นรูปแบบ dd/mm/yyyy ให้คืนค่าเดิม
      if (dateString.includes('/')) {
        return dateString;
      }
      
      const date = new Date(dateString);
      
      // ชื่อเดือนภาษาไทย
      const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      
      // แปลงเป็นรูปแบบ วันที่ เดือน พ.ศ.
      const day = date.getDate();
      const month = thaiMonths[date.getMonth()];
      const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
      
      return `${day} ${month} ${year}`;
    } catch (error) {
      // หากมีข้อผิดพลาดให้คืนค่าเดิม
      return dateString;
    }
  };
  