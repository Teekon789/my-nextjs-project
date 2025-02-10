const TripDetails = ({ formData, handleInputChange }) => {
    // อาร์เรย์ของฟิลด์ที่ต้องการแสดง
    const fields = [
      {
        name: 'trip_details',
        label: 'รายละเอียดการเดินทาง',
        placeholder: 'กรุณากรอกรายละเอียดการเดินทาง',
      },
      {
        name: 'traveler_name1',
        label: 'เดินทางไปปฏิบัติงานเกี่ยวกับ',
        placeholder: 'กรุณากรอกหัวข้อการปฏิบัติงาน',
      },
      {
        name: 'traveler_name2',
        label: 'สถานที่เดินทางไปปฏิบัติงาน',
        placeholder: 'กรุณากรอกสถานที่ปฏิบัติงาน',
      },
    ];
  
    return (
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium mb-2">
              {field.label}
            </label>
            <textarea
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              className="w-full p-4 border border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
              rows={4}
            />
          </div>
        ))}
      </div>
    );
  };
  
  export default TripDetails;
  