import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Image from 'next/image';
import mn_1 from '@/logo/mn_1.png';
const ApprovalHeader = ({ currentUser, handleLogout }) => {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Image
              src={mn_1}
              alt="Logo"
              className="w-16 h-16 text-3xl text-blue-600"
              priority={true}  // ให้โหลดภาพทันที
            />
            <h1 className="text-2xl font-bold text-gray-800 relative">
              มหาวิทยาลัยนเรศวร
              <span className="absolute bottom-0 right-0 w-1/2 border-b-4 border-orange-500/85"></span>
            </h1>
          </div>
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaUserCircle className="text-gray-600 text-xl" />
                <span className="text-gray-700">{currentUser.fullname}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ApprovalHeader;