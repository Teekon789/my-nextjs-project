"use client";

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';

const provinces = [ "เลือกจังหวัด ",
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", 
  "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชัยนาท", "ชัยภูมิ", 
  "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", 
  "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา", 
  "นครศรีธรรมราช", "นครสวรรค์", "นราธิวาส", "นนทบุรี", "บึงกาฬ", 
  "บุรีรัมย์", "ประจวบคีรีขันธ์", "ปทุมธานี", "ปราจีนบุรี", "ปัตตานี", 
  "พะเยา", "พระนครศรีอยุธยา", "พังงา", "พัทลุง", "พิจิตร", 
  "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "พัทลุง", 
  "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "ยโสธร", "ยะลา", 
  "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี", "ลพบุรี", 
  "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", 
  "สงขลา", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", 
  "สระบุรี", "สิงห์บุรี", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", 
  "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", 
  "อุตรดิตถ์", "อุบลราชธานี", "อำนาจเจริญ", "อุดรธานี"
];

const TravelForm = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    personnel_type: '',
    department: '',
    email: '',
    phone: '',
    fund_source: '',
    contract_number: '',
    allowance: 0,
    accommodation: 0,
    transportation: 0,
    expenses: 0,
    total_budget: 0,
    trip_type: '',
    accommodation_type: '',
    accommodation_days: 0,
    transportation_type: '',
    date123: '',
    departure_date: '',
    return_date: '', 
    trip_details: '',
    province: '',
    traveler_name: '',
    traveler_name1: '',
    traveler_name2: '',
    traveler_relation: '',
    sendTo: '',
    trip_date: '',
    travelers: []
  });

  const router = useRouter();

  const handleTravelerChange = (index, e) => {
    const { name, value } = e.target;
    const newTravelers = [...formData.travelers];
    newTravelers[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      travelers: newTravelers
    }));
  };

  const handleAddTraveler = () => {
    setFormData((prevData) => ({
      ...prevData,
      travelers: [...prevData.travelers, { }]
    }));
  };

  const handleRemoveTraveler = (index) => {
    const newTravelers = formData.travelers.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      travelers: newTravelers
    }));
  };

  const parseAmount = (amount) => {
    return amount === "" || amount === null || amount === undefined || isNaN(amount) ? 0 : parseFloat(amount);
  };

  const calculateTotalBudget = () => {
    const allowance = parseAmount(formData.allowance);
    const accommodation = parseAmount(formData.accommodation);
    const transportation = parseAmount(formData.transportation);
    const expenses = parseAmount(formData.expenses);

    const total = allowance + accommodation + transportation + expenses;
    setFormData((prevData) => ({
      ...prevData,
      total_budget: total.toFixed(2)
    }));

    console.log("Allowance:", allowance);
    console.log("Accommodation:", accommodation);
    console.log("Transportation:", transportation);
    console.log("Expenses:", expenses);
    console.log("Total Budget:", total);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
  
    try {
      const userString = localStorage.getItem('user');
      if (!userString) throw new Error('User not found');
      const user = JSON.parse(userString);
  
      if (!formData.sendTo || !formData.fullname || !formData.email) {
        throw new Error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      }
  
      const postData = {
        ...formData,
        createdBy: user.id,
        creatorName: user.fullname,
        creatorDepartment: user.department || '',
        status: 'pending',
        personnel_type: formData.personnel_type || 'อาจารย์',
        total_budget: parseFloat(formData.total_budget) || 0
      };
  
      const response = await axios.post('/api/createPost', postData);
  
      if (response.data._id) {
        alert('บันทึกข้อมูลสำเร็จ');
        router.push(`/result?id=${response.data._id}`);
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error);
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (

    <div className="container mx-auto max-w-screen-md p-3 bg-gray-100 rounded-lg shadow-md">
   
      
      <div>
        <title>รายละเอียดการเดินทาง</title>
      </div>
      
      <h1 className="text-2xl font-bold mb-6 text-center">รายละเอียดการเดินทาง</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6 ">
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">

  <div>
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">เรียนถึง:</label>
      <select
        name="sendTo"
        value={formData.sendTo}
        onChange={handleInputChange}
        required
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      >
        <option value="">เลือกผู้อนุมัติ</option>
        <option value="dean">คณบดี</option>
        <option value="head">หัวหน้าภาควิชา</option>
        <option value="director">ผู้อำนวยการ</option>
      </select>
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">ชื่อ-นามสกุล :</label>
      <input
        type="text"
        name="fullname"
        value={formData.fullname}
        onChange={handleInputChange}
        required
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">ตําแหน่ง :</label>
      <input
        type="text"
        name="personnel_type"
        value={formData.personnel_type}
        onChange={handleInputChange}
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">สังกัด :</label>
      <input
        type="text"
        name="department"
        value={formData.department}
        onChange={handleInputChange}
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">อีเมล :</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        required
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">เบอร์โทร :</label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        required
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">แหล่งเงิน :</label>
      <input
        type="text"
        name="fund_source"
        value={formData.fund_source}
        onChange={handleInputChange}
        required
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">เลขสัญญา :</label>
      <input
        type="text"
        name="contract_number"
        value={formData.contract_number}
        onChange={handleInputChange}
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">วันที่ทําสัญญา :</label>
      <input
        type="date"
        name="date123"
        value={formData.date123}
        onChange={handleInputChange}
        required
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>

  <div>
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">ค่าเบี้ยเลี้ยง :</label>
      <input
        type="number"
        name="allowance"
        value={formData.allowance}
        onChange={handleInputChange}
        onBlur={calculateTotalBudget}
        min="0"
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">ค่าที่พัก :</label>
      <input
        type="number"
        name="accommodation"
        value={formData.accommodation}
        onChange={handleInputChange}
        onBlur={calculateTotalBudget}
        min="0"
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">ประเภที่พัก :</label>
      <input
        type="text"
        name="accommodation_type"
        value={formData.accommodation_type}
        onChange={handleInputChange}
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">ค่าพาหนะ :</label>
      <input
        type="number"
        name="transportation"
        value={formData.transportation}
        onChange={handleInputChange}
        onBlur={calculateTotalBudget}
        min="0"
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">ประเภทพาหนะ :</label>
      <select
        name="transportation_type"
        value={formData.transportation_type}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">เลือกพาหนะ</option>
        <option value="รถยนต์">รถยนต์</option>
        <option value="รถไฟ">รถไฟ</option>
        <option value="เครื่องบิน">เครื่องบิน</option>
        <option value="รถทัวร์">รถทัวร์</option>
        <option value="รถตู้">รถตู้</option>
        <option value="รถจักรยานยนต์">รถจักรยานยนต์</option>
      </select>
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">จํานวนวัน :</label>
      <input
        type="number"
        name="accommodation_days"
        placeholder="จำนวนวัน"
        value={formData.accommodation_days}
        onChange={handleInputChange}
        min="0"
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">ค่าใช้จ่ายอื่นๆ :</label>
      <input
        type="number"
        name="expenses"
        value={formData.expenses}
        onChange={handleInputChange}
        onBlur={calculateTotalBudget}
        min="0"
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <div className="col-span-2">
      <label className="block mb-2 text-sm font-medium text-gray-700">เลือกประเภทการเดินทาง:</label>
      <div className="flex flex-col space-y-3">
      {/* ปุ่ม "ไปเที่ยวเดียว" */}
      <div className="flex items-center">
        <input
          type="radio"
          id="single-trip"
          name="trip_type"
          value="ไปเที่ยวเดียว"
          checked={formData.trip_type === 'ไปเที่ยวเดียว'}
          onChange={handleInputChange}
          className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="single-trip" className="ml-2 text-sm text-gray-700">ไปเที่ยวเดียว</label>
      </div>
        {/* ปุ่ม "ไปกลับ" */}
      <div className="flex items-center">
        <input
          type="radio"
          id="group-trip"
          name="trip_type"
          value="ไปกลับ"
          checked={formData.trip_type === 'ไปกลับ'}
          onChange={handleInputChange}
          className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="group-trip" className="ml-2 text-sm text-gray-700">ไปกลับ</label>
      </div>

      </div>
    </div>
  </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">รายละเอียดการเดินทาง:</label>
            <textarea
              name="trip_details"
              value={formData.trip_details}
              onChange={handleInputChange}
               className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">เดินทางไปปฏิบัติงานเกี่ยวกับ :</label>
            <input
              type="text"
              name="traveler_name1"
              value={formData.traveler_name1}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">สถานที่เดินทางไปปฏิบัติงาน :</label>
            <input
              type="text"
              name="traveler_name2"
              value={formData.traveler_name2}
              onChange={handleInputChange}
               className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">วันที่ไปราชการ:</label>
            <input
              type="datetime-local"
              name="trip_date"
              value={formData.trip_date}
              onChange={handleInputChange}
               className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">วันที่ออกเดินทาง:</label>
            <input
              type="datetime-local"
              name="departure_date"
              value={formData.departure_date}
              onChange={handleInputChange}
               className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">วันที่เดินทางกลับ:</label>
           
            <input
              type="datetime-local"   
              name="return_date"

              value={formData.return_date}
              onChange={handleInputChange}
               className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">จังหวัด:</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            
            {formData.travelers.map((traveler, index) => (
              <div key={index} className="traveler-form mb-4 p-4 border rounded-lg">
                <label className="block mb-2 text-sm font-medium text-gray-700">ผู้ร่วมเดินทาง:</label>
                <input
                  type="text"
                  name="traveler_name"
                  placeholder="ชื่อผู้เดินทาง"
                  value={traveler.traveler_name}
                  onChange={(e) => handleTravelerChange(index, e)}
                  class="form-input mt-1 block w-3/4 mb-4 p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2
                  focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out mx-auto" 
                />
                <input
                  type="text"
                  name="personnel_type"
                  placeholder="ประเภทบุคลากร"
                  value={traveler.personnel_type}
                  onChange={(e) => handleTravelerChange(index, e)}
                 class="form-input mt-1 block w-3/4 mb-4 p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2
                  focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out mx-auto"
                />
                <input
                  type="text"
                  name="traveler_relation"
                  placeholder="หน่วยงาน"
                  value={traveler.traveler_relation}
                  onChange={(e) => handleTravelerChange(index, e)}
                  class="form-input mt-1 block w-3/4 mb-4 p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2
                  focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out mx-auto"
                />
               
               <input
                  type="email"
                  name="email"
                  placeholder="อีเมล"
                  value={traveler.email}
                  onChange={(e) => handleTravelerChange(index, e)}
                  class="form-input mt-1 block w-3/4 mb-4 p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2
                  focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out mx-auto"
                />


                <input
                  type="tel"
                  name="phone"
                  placeholder="เบอร์โทร"
                  value={traveler.phone}
                  onChange={(e) => handleTravelerChange(index, e)}
                  class="form-input mt-1 block w-3/4 mb-4 p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2
                  focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out mx-auto"
                />
                
                <button
  type="button"
  onClick={() => handleRemoveTraveler(index)}
  className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 active:scale-95 transition duration-200"
>
  ลบ
</button>
              </div>
            ))}
            <button
  type="button"
  onClick={handleAddTraveler}
  className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 transition duration-200"
>
  เพิ่มผู้เดินทาง
</button>
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">รวมงบประมาณ :</label>
            <input
              type="text"
              value={`${formData.total_budget} บาท`}
              readOnly
               className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2 text-center">
          <button
  type="submit"
  disabled={isLoading}
  className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95 transition duration-200"
>
  {isLoading ? 'กำลังโหลด...' : 'บันทึกการเดินทาง'}
</button>
          </div>
        </div>
      </form>
    </div>
  
  );
};
  export default TravelForm;