import { useState, useEffect } from 'react';

interface PrepareDocumentProps {
  delayMs?: number;
}

/**
 * Custom hook ที่จะรอให้แน่ใจว่าเอกสารพร้อมสำหรับการ render
 * โดยจะรอเวลาที่กำหนดหลังจาก component mount
 */
export const usePrepareDocument = ({ delayMs = 300 }: PrepareDocumentProps = {}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // ตั้ง timeout เพื่อให้แน่ใจว่า component ได้ mount และ hydrate เรียบร้อยแล้ว
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return isReady;
};