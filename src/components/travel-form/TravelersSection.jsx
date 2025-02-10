export const TravelersSection = ({ formData, handleTravelerChange, handleRemoveTraveler, handleAddTraveler }) => (
  <div className="col-span-2">
    {formData.travelers.map((traveler, index) => (
      <div key={index} className="traveler-form mb-4 p-4 border rounded-lg ">
        <label className="block mb-2 text-sm font-medium text-gray-700">ผู้ร่วมเดินทาง:</label>
        {[
          { name: "traveler_name", placeholder: "ชื่อผู้เดินทาง", type: "text" },
          { name: "personnel_type", placeholder: "ประเภทบุคลากร", type: "text" },
          { name: "traveler_relation", placeholder: "หน่วยงาน", type: "text" },
          { name: "email", placeholder: "อีเมล", type: "email" },
          { name: "phone", placeholder: "เบอร์โทร", type: "tel" }
        ].map(field => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={traveler[field.name] || ""}
            onChange={(e) => handleTravelerChange(index, e)}
            className="form-input mt-1 block w-3/4 mb-4 p-3 border-2 border-orange-200 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-300 ease-in-out mx-auto hover:border-orange-300"
          />
        ))}
        <button
          type="button"
          onClick={() => handleRemoveTraveler(index)}
          className="bg-gradient-to-r from-rose-400 via-red-500 to-orange-500 text-white 
                    px-6 py-3 rounded-xl shadow-lg hover:from-rose-500 hover:via-red-600 hover:to-orange-600 
                    focus:outline-none focus:ring-2 focus:ring-red-300 
                    active:scale-95 transition duration-300 ease-in-out transform"
        >
          ลบ
        </button>

      </div>
          ))}
          <button
          type="button"
          onClick={handleAddTraveler}
          className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-white 
                    px-6 py-3 rounded-xl shadow-lg hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-600 
                    focus:outline-none focus:ring-2 focus:ring-blue-300 
                    active:scale-95 transition duration-300 ease-in-out transform"
        >
          เพิ่มผู้เดินทาง
        </button>

  </div>
);