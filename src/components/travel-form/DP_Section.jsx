import React from 'react';
import { useState } from 'react';

const DP_Section = ({ formData, handleInputChange, provinces, formatThaiDateTime }) => {
  const [dates, setDates] = useState({
    trip_date: formData.trip_date || '',
    trip_time: '00:00',
    departure_date: formData.departure_date || '',
    departure_time: '00:00',
    return_date: formData.return_date || '',
    return_time: '00:00'
  });

  // ฟังก์ชันจัดการการเปลี่ยนแปลงวันที่และเวลา
  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    setDates(prev => ({
      ...prev,
      [name]: value
    }));

    // รวมวันที่และเวลา แล้วส่งกลับไปที่ parent
    const fieldBase = name.replace('_time', '_date');
    const isTime = name.includes('_time');
    const relatedField = isTime ? name.replace('_time', '_date') : name.replace('_date', '_time');
    
    if (isTime) {
      const combinedDateTime = `${dates[fieldBase]}T${value}`;
      handleInputChange({
        target: {
          name: fieldBase,
          value: combinedDateTime
        }
      });
    } else {
      const combinedDateTime = `${value}T${dates[relatedField]}`;
      handleInputChange({
        target: {
          name: name,
          value: combinedDateTime
        }
      });
    }
  };

  const fields = [
    {
      name: 'trip_date',
      label: 'วันที่ไปราชการ',
      type: 'datetime'
    },
    {
      name: 'departure_date',
      label: 'วันที่ออกเดินทาง',
      type: 'datetime'
    },
    {
      name: 'return_date',
      label: 'วันที่เดินทางกลับ',
      type: 'datetime'
    },
    {
      name: 'province',
      label: 'จังหวัด',
      type: 'select',
      options: provinces,
    }
  ];

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto p-4">
      {fields.map((field, index) => (
        <div key={index} className="group">
          {field.type === 'datetime' ? (
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
                    value={dates[field.name]}
                    onChange={handleDateTimeChange}
                    className="w-full h-[46px] px-4 border border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
                  />
                </div>
                <div className="w-full sm:w-32">
                  <input
                    type="time"
                    name={`${field.name.replace('_date', '_time')}`}
                    value={dates[`${field.name.replace('_date', '_time')}`]}
                    onChange={handleDateTimeChange}
                    className="w-full h-[46px] px-4 border border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500/80">
                {formatThaiDateTime(`${dates[field.name]}T${dates[`${field.name.replace('_date', '_time')}`]}`)}
              </p>
            </div>
          ) : (
            <>
              <label className="block text-base font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <select
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                className="w-full h-[46px] px-4 border border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
              >
                 <option value="" className="text-gray-500">กรุณาเลือกจังหวัด</option>
                  {field.options.map((option, i) => (
                    <option key={i} value={option} className="text-gray-700">
                      {option}
                    </option>
                  ))}
                </select>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default DP_Section;