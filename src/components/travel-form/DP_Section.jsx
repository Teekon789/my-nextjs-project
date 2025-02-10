import React from 'react';

const DP_Section = ({ formData, handleInputChange, provinces, formatThaiDateTime }) => {
  const fields = [
    {
      name: 'trip_date',
      label: 'วันที่ไปราชการ',
      type: 'date',
      timeName: 'trip_time',
      placeholder: 'วว/ดด/ปปปป'
    },
    {
      name: 'departure_date',
      label: 'วันที่ออกเดินทาง',
      type: 'date',
      timeName: 'departure_time',
      placeholder: 'วว/ดด/ปปปป'
    },
    {
      name: 'return_date',
      label: 'วันที่เดินทางกลับ',
      type: 'date',
      timeName: 'return_time',
      placeholder: 'วว/ดด/ปปปป'
    },
    {
      name: 'province',
      label: 'จังหวัด',
      type: 'select',
      options: provinces,
    },
  ];

  const combineDateTime = (date, time) => {
    if (!date || !time) return '';
    return `${date}T${time}`;
  };

  const inputClasses = "w-full h-[46px] px-4 border border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300";

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto p-4">
      {fields.map((field, index) => (
        <div key={index} className="group">
          {field.type === 'select' ? (
            <>
              <label className="block text-base font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <select
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                className={inputClasses}
              >
                <option value="">กรุณาเลือกจังหวัด</option>
                {field.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label className="text-base font-medium text-gray-700">
                  {field.label}
                </label>
                <div className="hidden sm:block w-32 text-base font-medium text-gray-700">
                  เวลา
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="w-full sm:flex-1">
                  <input
                    type="date"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className={inputClasses}
                  />
                </div>
                <div className="w-full sm:w-32">
                  <label className="block sm:hidden text-base font-medium text-gray-700 mb-2">
                    เวลา
                  </label>
                  <input
                    type="time"
                    name={field.timeName}
                    value={formData[field.timeName] || ''}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </div>
              </div>
              {field.type === 'date' && (
                <p className="text-sm text-gray-500/80">
                  {formatThaiDateTime(
                    combineDateTime(formData[field.name], formData[field.timeName])
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DP_Section;