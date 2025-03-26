export const PersonalInfoSection = ({ formData, handleInputChange }) => {
  
  // ฟังก์ชันจัดรูปแบบเบอร์โทรเป็น XXX-XXX-XXXX
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10); // ลบอักขระที่ไม่ใช่ตัวเลข และจำกัด 10 หลัก
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{0,4})$/); // จับกลุ่มตัวเลข
    return match ? `${match[1]}-${match[2]}-${match[3]}`.replace(/-$/, "") : cleaned;
  };

  // ฟังก์ชันที่ใช้สำหรับเปลี่ยนค่าเบอร์โทร
  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    handleInputChange({ target: { name: "phone", value: formattedValue } });
  };

  return (
    <div>
      {/* เลือกผู้อนุมัติ */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">เรียนถึง:</label>
        <select
          name="sendTo"
          value={formData.sendTo}
          onChange={handleInputChange}
          required
          className="w-full rounded-xl p-4 border-orange-200 shadow-sm focus:ring-2 focus:ring-orange-400 
          focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
        >
          <option value="">เลือกผู้อนุมัติ</option>
          <option value="dean">คณบดี</option>
          <option value="head">หัวหน้าภาควิชา</option>
          <option value="director">ผู้อำนวยการ</option>
        </select>
      </div>
      
      {/* Personal Information Fields */}
      {[
        { label: "ชื่อ-นามสกุล :", name: "fullname", type: "text", required: true, placeholder: "กรอกชื่อ-นามสกุล" },
        { label: "ตําแหน่ง :", name: "personnel_type", type: "text", placeholder: "ระบุตำแหน่ง" },
      ].map((field) => (
        <div key={field.name} className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            required={field.required}
            placeholder={field.placeholder}
            className="w-full rounded-xl border p-4 border-orange-200 shadow-sm focus:ring-2 focus:ring-orange-400 
            focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
          />
        </div>
      ))}

      {/* ส่วนราชการ และ ที่ ให้อยู่ในบรรทัดเดียวกัน */}
      <div className="flex space-x-4 mt-4">
        <div className="w-1/2">
          <label className="block mb-2 text-sm font-medium text-gray-700">ส่วนราชการ :</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            placeholder="ระบุหน่วยงาน/คณะ"
            className="w-full rounded-xl border p-4 border-orange-200 shadow-sm focus:ring-2 focus:ring-orange-400 
            focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
          />
        </div>
        <div className="w-1/2">
          <label className="block mb-2 text-sm font-medium text-gray-700">เลขที่อยู่ส่วนราขการ :</label>
          <input
            type="text"
            name="agency_name"
            value={formData.agency_name}
            onChange={handleInputChange}
            placeholder="เช่น วท0603.0402/982"
            className="w-full rounded-xl border p-4 border-orange-200 shadow-sm focus:ring-2 focus:ring-orange-400 
            focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
          />
        </div>
      </div>

      {/* คงเหลือส่วนอื่นๆ เหมือนเดิม */}
      {[
        { label: "อีเมล :", name: "email", type: "email", required: true, placeholder: "example@email.com" },
        { label: "เบอร์โทร :", name: "phone", type: "tel", required: true, placeholder: "XXX-XXX-XXXX" },
        { label: "แหล่งเงิน :", name: "fund_source", type: "text", required: true, placeholder: "เช่น กองทุนวิจัย" },
        { label: "เลขสัญญา :", name: "contract_number", type: "text", placeholder: "เลขที่สัญญา (ถ้ามี)" },
        { label: "วันที่ทําสัญญา :", name: "date123", type: "date", required: true, placeholder: "เลือกวันที่" }
      ].map((field) => (
        <div key={field.name} className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={field.name === "phone" ? handlePhoneChange : handleInputChange}
            required={field.required}
            placeholder={field.placeholder}
            className="w-full rounded-xl border p-4 border-orange-200 shadow-sm focus:ring-2 focus:ring-orange-400 
            focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
          />
        </div>
      ))}
    </div>
  );
};