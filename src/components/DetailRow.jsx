import React from 'react';

const DetailRow = ({ label, value, icon, action }) => (
  <div className="flex sm:flex-row flex-col text-base sm:text-lg text-gray-700 px-4 sm:px-8 py-2">
    {/* ส่วนของ Label */}
    <strong className="flex-shrink-0 w-full sm:w-[200px] text-left sm:pr-12 flex items-start min-w-[150px]">
      {icon && <span className="mr-2 text-gray-500">{icon}</span>}
      {label}
    </strong>

    {/* ส่วนของ Value และ Action */}
    <div className="flex-1 flex items-start sm:justify-start">
      <span className="break-words">{value || "-"}</span>
      {action && <span className="ml-1">{action}</span>}
    </div>
  </div>
);

export default DetailRow;
