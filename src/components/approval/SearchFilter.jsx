import { BsSearch } from "react-icons/bs";
import { FaFilter, FaPlus } from "react-icons/fa";
import Link from "next/link";
import Button from '@/components/ui/button';

const SearchFilter = ({ searchQuery, onSearchChange, onStatusChange, linkHref }) => {
  return (
    <div className="bg-slate-50 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 bg-slate-50/35 focus:ring-slate-600 focus:border-transparent"
              placeholder="ค้นหาด้วยชื่อเต็มหรือประเภทบุคลากร..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
            <select
              className="w-full md:w-48 pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 bg-slate-50/35 cursor-pointer focus:ring-slate-600 focus:border-transparent appearance-none"
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="">สถานะทั้งหมด</option>
              <option value="pending">รอการอนุมัติ</option>
              <option value="Approved">อนุมัติแล้ว</option>
              <option value="Rejected">ไม่อนุมัติ</option>
            </select>
          </div>
          <Link href={linkHref}>
            <Button className="px-6 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md flex items-center space-x-2">
              <FaPlus />
              <span>เพิ่มโพสต์ใหม่</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SearchFilter;