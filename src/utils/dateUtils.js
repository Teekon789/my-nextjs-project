

//วันที่และเวลา
export const formatThaiDateTime = (dateTime) => {
    if (!dateTime) return '';
    
    const date = new Date(dateTime);
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
  
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
  };
  
  // ใช้สำหรับแปลงสตริงวันที่ ISO 8601 ให้เป็นรูปแบบที่ไม่มี Z (ซึ่งหมายถึงเวลามาตรฐาน UTC)
  export const convertToThaiDate = (isoString) => {
    if (!isoString) return '';
    return isoString.replace('Z', '');
  };

// วันที่เฉยๆ
  export const formatThaiDate = (dateTime) => {
    if (!dateTime) return '';
    
    const date = new Date(dateTime);
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
  
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
  
    return `${day} ${month} ${year}`;
  };