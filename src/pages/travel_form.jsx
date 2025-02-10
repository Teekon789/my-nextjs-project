import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from 'axios';

import { format } from 'date-fns';
import { th } from 'date-fns/locale';

import provinces from '../components/travel-form/provinces'
import dynamic from 'next/dynamic'; // ใช้ Dynamic Imports พร้อม { ssr: false } 

// ใช้ Dynamic Imports สำหรับ component ที่เป็น named export TripDetails
const DP_Section = dynamic(() => import("../components/travel-form/DP_Section"), { ssr: false });
const TripDetails = dynamic(() => import("../components/travel-form/TripDetails"), { ssr: false });
const PersonalInfoSection = dynamic(() => import("../components/travel-form/PersonalInfoSection").then(mod => mod.PersonalInfoSection), { ssr: false });
const ExpenseSection = dynamic(() => import("../components/travel-form/ExpenseSection").then(mod => mod.ExpenseSection), { ssr: false });
const TravelersSection = dynamic(() => import("../components/travel-form/TravelersSection").then(mod => mod.TravelersSection), { ssr: false });

// ฟังก์ชันแปลงวันที่และเวลาเป็นไทย
const formatThaiDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return format(date, "d MMMM yyyy HH:mm", { locale: th }) + " น.";
  
};

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
   
    trip_details: '',
    province: '',
    traveler_name: '',
    traveler_name1: '',
    traveler_name2: '',
    traveler_relation: '',
    sendTo: '',
    // วันที่
    trip_date: '',
    departure_date: '',
    return_date: '', 
    travelers: []
  });

  const router = useRouter();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function validateUser() {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (!storedToken || !storedUser) {
        router.push('/');
        return;
      }
      try {
        const res = await fetch('/api/auth/validateToken', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          }
        });
        if (res.status === 401) {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`
            }
          });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/');
          return;
        }
        const data = await res.json();
        setToken(storedToken);
        setUser(storedUser);
      } catch (error) {
        console.error('Error validating token:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    }
    validateUser();
  }, []);

  if (isLoading) return <p>กำลังโหลด...</p>;

  const handleTravelerChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      travelers: prevData.travelers.map((traveler, i) =>
        i === index ? { ...traveler, [name]: value } : traveler
      ),
    }));
  };

  const handleAddTraveler = () => {
    setFormData((prevData) => ({
      ...prevData,
      travelers: [
        ...prevData.travelers,
        {
          traveler_name: "",
          personnel_type: "",
          traveler_relation: "",
          email: "",
          phone: "",
        },
      ],
    }));
  };

  const handleRemoveTraveler = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      travelers: prevData.travelers.filter((_, i) => i !== index),
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
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8 font-[Kanit]">
      <div className="max-w-5xl mx-auto">
        <div className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl overflow-hidden border border-orange-100 transition-all duration-300 hover:shadow-orange-200/40">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 px-8 py-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"></div>
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center tracking-wide relative z-10">
              รายละเอียดการเดินทาง
            </h1>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white/10"></div>
          </div>
  
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            <div className="grid grid-cols-1 gap-8">
              {/* Personal Info Section */}
              <div className="backdrop-blur-sm bg-white/80 p-8 rounded-2xl border border-orange-100 shadow-lg transition-all duration-300 
              hover:shadow-orange-100/60">
                <h2 className="text-2xl font-semibold text-orange-800 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  ข้อมูลส่วนตัว
                </h2>
                <PersonalInfoSection 
                formData={formData} 
                handleInputChange={handleInputChange} />
              </div>
  
              {/* Expense Section */}
              <div className="backdrop-blur-sm bg-white/80 p-8 rounded-2xl border border-orange-100 shadow-lg transition-all duration-300 
              hover:shadow-orange-100/60">
                <h2 className="text-2xl font-semibold text-orange-800 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  ข้อมูลค่าใช้จ่าย
                </h2>
                <ExpenseSection 
                  formData={formData} 
                  handleInputChange={handleInputChange}
                  calculateTotalBudget={calculateTotalBudget}
                />
              </div>
  
              {/* Trip Details */}
              <div className="backdrop-blur-sm bg-white/80 p-8 rounded-2xl border border-orange-100 shadow-lg transition-all duration-300 
              hover:shadow-orange-100/60">
                <h2 className="text-2xl font-semibold text-orange-800 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  ข้อมูลการเดินทาง
                </h2>
                <TripDetails 
                  formData={formData} 
                  handleInputChange={handleInputChange} />
                  
                </div>
  
              {/* DP_Section */}
              <div className="backdrop-blur-sm bg-white/80 p-8 rounded-2xl border border-orange-100 shadow-lg transition-all duration-300 
              hover:shadow-orange-100/60">
                <h2 className="text-2xl font-semibold text-orange-800 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  วันที่และสถานที่
                </h2>
                <DP_Section 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                  provinces={provinces} 
                  formatThaiDateTime={formatThaiDateTime} 
                />
              </div>
  
              {/* Travelers Section */}
              <div className="backdrop-blur-sm bg-white/80 p-8 rounded-2xl border border-orange-100 shadow-lg transition-all duration-300 
              hover:shadow-orange-100/60">
                <h2 className="text-2xl font-semibold text-orange-800 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  ข้อมูลผู้ร่วมเดินทาง
                </h2>
                <TravelersSection 
                  formData={formData}
                  handleTravelerChange={handleTravelerChange}
                  handleRemoveTraveler={handleRemoveTraveler}
                  handleAddTraveler={handleAddTraveler}
                />
              </div>
  
              {/* Total Budget */}
              <div className="backdrop-blur-sm bg-white/80 p-8 rounded-2xl border border-orange-100 shadow-lg transition-all duration-300 
              hover:shadow-orange-100/60">
                <h2 className="text-2xl font-semibold text-orange-800 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  งบประมาณ
                </h2>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    รวมงบประมาณทั้งหมด
                  </label>
                  <input
                    type="text"
                    value={`${formData.total_budget } บาท`}
                    readOnly
                    className="w-full p-4 border border-orange-200 rounded-xl shadow-sm bg-orange-50 font-semibold text-lg"
                  />
                </div>
              </div>
            </div>
  
            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="group px-12 py-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-lg font-semibold rounded-xl shadow-lg 
                hover:from-orange-500 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transform transition-all 
                duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 relative overflow-hidden"
              >
                <span className="relative z-10">
                  {isLoading ? 'กำลังโหลด...' : 'บันทึกการเดินทาง'}
                </span>
                <div className="absolute inset-0 -translate-y-full group-hover:translate-y-0 bg-gradient-to-r from-amber-500 to-orange-500 
                transition-transform duration-300"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TravelForm;