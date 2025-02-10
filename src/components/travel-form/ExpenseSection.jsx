export const ExpenseSection = ({ formData, handleInputChange, calculateTotalBudget }) => (
  <div>
    {/* Expense Fields */}
    {[
      { label: "ค่าเบี้ยเลี้ยง :", name: "allowance", type: "number", hasBlur: true, placeholder: "กรอกค่าเบี้ยเลี้ยง" },
      { label: "ค่าที่พัก :", name: "accommodation", type: "number", hasBlur: true, placeholder: "กรอกค่าที่พัก" },
      { label: "ประเภทที่พัก :", name: "accommodation_type", type: "text", placeholder: "เช่น โรงแรม, โฮสเทล, รีสอร์ท" },
      { label: "ค่าพาหนะ :", name: "transportation", type: "number", hasBlur: true, placeholder: "กรอกค่าพาหนะ" }
    ].map((field) => (
      <div key={field.name}  className="mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-700 ">{field.label}</label>
        <input
          type={field.type}
          name={field.name}
          value={formData[field.name]}
          onChange={handleInputChange}
          onBlur={field.hasBlur ? calculateTotalBudget : undefined}
          min="0"
          placeholder={field.placeholder}
          className="w-full p-4 border border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
        />
      </div>
    ))}

    {/* Transportation Type */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700 mt-4">ประเภทพาหนะ :</label>
      <select
        name="transportation_type "
        value={formData.transportation_type}
        onChange={handleInputChange}
        className="w-full p-4 border border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
      >
        <option value="">เลือกพาหนะ</option>
        {["รถยนต์", "รถไฟ", "เครื่องบิน", "รถทัวร์", "รถตู้", "รถจักรยานยนต์"].map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>

    {/* Number of Days */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700 mt-4">จำนวนวัน :</label>
      <input
        type="number"
        name="accommodation_days"
        placeholder="เช่น 3 วัน"
        value={formData.accommodation_days}
        onChange={handleInputChange}
        min="0"
        className="w-full p-4 border border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
      />
    </div>

    {/* Additional Expenses */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700 mt-4">ค่าใช้จ่ายอื่นๆ :</label>
      <input
        type="number"
        name="expenses"
        placeholder="เช่น ค่าอาหาร, ค่าธรรมเนียมต่างๆ"
        value={formData.expenses}
        onChange={handleInputChange}
        onBlur={calculateTotalBudget}
        min="0"
        className="w-full p-4 border border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
      />
    </div>

    {/* Trip Type */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700 mt-4">เลือกประเภทการเดินทาง:</label>
      <div className="flex flex-col space-y-3">
        {[
          { id: "single-trip", value: "ไปเที่ยวเดียว", label: "ไปเที่ยวเดียว" },
          { id: "group-trip", value: "ไปกลับ", label: "ไปกลับ" }
        ].map(trip => (
          <div key={trip.id} className="flex items-center">
            <input
              type="radio"
              id={trip.id}
              name="trip_type"
              value={trip.value}
              checked={formData.trip_type === trip.value}
              onChange={handleInputChange}
              className="form-radio h-5 w-5 text-orange-600  border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white/70 hover:border-orange-300"
            />
            <label htmlFor={trip.id} className="ml-2 text-sm text-gray-700">{trip.label}</label>
          </div>
        ))}
      </div>
    </div>

    
  </div>
);
