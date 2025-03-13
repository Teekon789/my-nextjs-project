
// DetailRow.tsx - คอมโพเนนต์สำหรับแสดงข้อมูลในรูปแบบแถว

import React, { ReactNode } from 'react';

interface DetailRowProps {
  label: string;
  value?: string | number | null;
  action?: ReactNode;
}

/**
 * คอมโพเนนต์สำหรับแสดงข้อมูลในรูปแบบแถว Label: Value
 */
const DetailRow: React.FC<DetailRowProps> = ({ label, value, action }) => {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="font-medium text-gray-700">{label}</div>
      <div className="flex items-center">
        <div className="text-right">{value !== undefined && value !== null ? value : '-'}</div>
        {action && <div className="ml-2">{action}</div>}
      </div>
    </div>
  );
};

export default DetailRow;