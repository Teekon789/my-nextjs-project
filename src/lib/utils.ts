// src/lib/utils.ts

// ฟังก์ชัน formatDate ที่รองรับการเลือก locale
export const formatDate = (date: Date, locale: string = 'en-US'): string => {
  // ตรวจสอบว่า date เป็นวันที่ที่ถูกต้องหรือไม่
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }
  return new Intl.DateTimeFormat(locale).format(date);
};

// ฟังก์ชัน calculateDaysBetween ที่รองรับการตรวจสอบวันที่ที่ไม่ถูกต้อง
export const calculateDaysBetween = (start: Date, end: Date): number => {
  // ตรวจสอบว่า start และ end เป็นวันที่ที่ถูกต้อง
  if (!(start instanceof Date) || !(end instanceof Date) || isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date');
  }

  const timeDiff = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// ฟังก์ชัน cn สำหรับการรวมคลาส พร้อมตรวจสอบค่าที่ไม่จำเป็น
export function cn(...classes: (string | undefined | false | null)[]): string {
  // กรองค่า undefined, false, null ออกก่อน แล้วรวมค่าคลาส
  return classes.filter((className) => className).join(' ');
}
