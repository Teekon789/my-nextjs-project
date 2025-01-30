//approval.jsx
import { useState, useEffect, useCallback } from 'react';
import { AiOutlineEye } from "react-icons/ai";
import { FaSignOutAlt, FaFilter, FaPlus, FaUserCircle } from "react-icons/fa";
import { IoIosDocument } from "react-icons/io";
import { BsSearch } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from 'next/router';
import PostPopup from "../components/PostPopup";
import DeletePermanentlyPopup from "../components/dletepre";
import PostGraph from "../components/PostGraph";
import Pagination from "../components/Pagination";
import ExpenseForm from "../components/ExpenseForm";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image"; 
import mn_1 from "@/logo/mn_1.png";
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';


import { Check, X, Eye,Trash2, FileText } from "lucide-react";
import { Button } from '@heroui/react';


const Approval = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState({ username: "John Doe", role: "dean" }); // Mock user data
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPosts, setCurrentPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDocument, setShowDocument] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [postsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      console.log('Loading data...');
    }
  }, [isLoading]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      router.push('/login-page');
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/createPost");
      const data = await response.json();
  
      // ตรวจสอบว่า data เป็นอาร์เรย์หรือไม่
      if (!Array.isArray(data)) {
        console.error("Error: Data is not an array", data);
        return;
      }
  
      // กรองข้อมูลตามเงื่อนไข
      const filteredData = data.filter(post => {
        if (!currentUser) return false;
  
        if (post.createdBy === currentUser.id) {
          return post.visibility.creator;
        }
  
        if (post.sendTo === currentUser.role) {
          return post.visibility.approver;
        }
  
        if (currentUser.role === 'admin') {
          return true;
        }
  
        return false;
      });
  
      setPosts(filteredData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [currentUser]);
  
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  

  useEffect(() => {
    const filtered = posts.filter((post) => {
      const matchesStatus = statusFilter ? post.status === statusFilter : true;
      const matchesQuery =
        post.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.personnel_type?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesQuery;
    });

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    
    // พลิกลำดับรายการโพสให้ล่าสุดมาก่อน
    setCurrentPosts(filtered.reverse().slice(indexOfFirstPost, indexOfLastPost));
  }, [posts, statusFilter, searchQuery, currentPage, postsPerPage]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    router.push('/');
  };

  const handleDocument = (post) => {
    setSelectedPost(post);
    setShowDocument(true);
  };

  const handleApprove = async (post) => {
    try {
      const response = await fetch(`/api/updatePost?_id=${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Approved' })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve post');
      }
  
      toast.success("โพสต์ได้รับการอนุมัติ!");
      fetchPosts();
    } catch (error) {
      console.error('Error approving post:', error);
      toast.error(`เกิดข้อผิดพลาดในการอนุมัติ: ${error.message}`);
    }
  };

  const handleReject = async (post) => {
    try {
      const response = await fetch(`/api/updatePost?_id=${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Rejected' })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject post');
      }
  
      toast.success("โพสต์ถูกปฏิเสธ!");
      fetchPosts();
    } catch (error) {
      console.error('Error rejecting post:', error);
      toast.error(`เกิดข้อผิดพลาดในการปฏิเสธ: ${error.message}`);
    }
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowPopup(true);
  };

  const handleDelete = (post) => {
    setSelectedPost(post);
    setShowDeletePopup(true);
  };

  const handleDeletePermanently = async () => {
    if (!selectedPost) return;
  
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        toast.error("กรุณาเข้าสู่ระบบใหม่");
        return;
      }
  
      const user = JSON.parse(userString);
      const isCreator = selectedPost.createdBy === user.id;
      
      if (isCreator) {
        const confirmDelete = window.confirm(
          'คุณต้องการลบโพสต์นี้ออกจากระบบใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้'
        );
        if (!confirmDelete) return;
      }
  
      const response = await fetch('/api/deletePost', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId: selectedPost._id,
          userId: user.id,
          userRole: user.role
        })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }
  
      toast.success(data.message);
      setShowDeletePopup(false);
      fetchPosts();
  
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการลบโพสต์");
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredPosts = posts
  .filter((post) => {
    return (
      post.fullname.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter ? post.status === statusFilter : true)
    );
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date)); // เรียงใหม่ก่อนเก่า

  

  const getDashboardStats = useCallback(() => {
    return {
      totalPosts: posts.length,
      pendingApproval: posts.filter(p => p.status === "pending").length,
      approved: posts.filter(p => p.status === "Approved").length,
      rejected: posts.filter(p => p.status === "Rejected").length
    };
  }, [posts]);

  const handleCardClick = (key) => {
    if (key === "totalPosts") {
      setStatusFilter(null); // แสดงโพสต์ทั้งหมด
    } else if (key === "pendingApproval") {
      setStatusFilter("pending"); // กรองโพสต์สถานะรอการอนุมัติ
    } else if (key === "approved") {
      setStatusFilter("Approved"); // กรองโพสต์สถานะอนุมัติแล้ว
    } else if (key === "rejected") {
      setStatusFilter("Rejected"); // กรองโพสต์สถานะไม่อนุมัติ
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50">
    
      {/* ส่วนหัว (Header Section) */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50  shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* โลโก้และชื่อมหาวิทยาลัย (Logo and University Name) */}
            <div className="flex items-center space-x-4">
              <Image 
                src={mn_1} 
                alt="Logo MN_1" 
                className="w-16 h-16 text-3xl text-blue-600"
              />
              <h1 className="text-2xl font-bold text-gray-800 relative">
              มหาวิทยาลัยนเรศวร
              <span className="absolute bottom-0 right-0 w-1/2 border-b-4 border-orange-500/85"></span>
            </h1>

            </div>
  
            {/* ส่วนผู้ใช้ (User Section) - แสดงเมื่อมีผู้ใช้ล็อกอิน (Displayed when user is logged in) */}
            {currentUser && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaUserCircle className="text-gray-600 text-xl" />
                  <span className="text-gray-700">{currentUser.fullname}</span>
                </div>
                {/* ปุ่มล็อกเอาท์ (Logout Button) */}
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
  
      {/* ส่วนเนื้อหาหลัก (Main Content Section) */}
      <div className="container mx-auto px-4 py-8">
        {/* การ์ดแสดงสถิติ (Dashboard Stats Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(getDashboardStats()).map(([key, value]) => (
            <div
              key={key}
              className={`card hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer ${
                key === "totalPosts"
                  ? "card-totalPosts"
                  : key === "pendingApproval"
                  ? "card-pendingApproval"
                  : key === "approved"
                  ? "card-approved"
                  : key === "rejected"
                  ? "card-rejected"
                  : ""
              }`}
              onClick={() => handleCardClick(key)}
            >
              <h3 className="text-muted-foreground text-xs font-medium mb-2">
                {key === "totalPosts" && "จำนวนโพสต์ทั้งหมด"}
                {key === "pendingApproval" && "รอการอนุมัติ"}
                {key === "approved" && "อนุมัติแล้ว"}
                {key === "rejected" && "ไม่อนุมัติ"}
              </h3>
              <p className="text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>
  
        {/* ส่วนค้นหาและกรองข้อมูล (Search and Filter Section) */}
        <div className="bg-slate-50    rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 ">
            {/* ช่องค้นหา (Search Input) */}
            <div className="flex-1 w-full md:w-auto  ">
              <div className="relative ">
                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 " />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 bg-slate-50/35  
                   focus:ring-slate-600 focus:border-transparent"
                  placeholder="ค้นหาด้วยชื่อเต็มหรือประเภทบุคลากร..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
  
            {/* Dropdown กรองสถานะและปุ่มเพิ่มโพสต์ (Status Filter Dropdown and Add Post Button) */}
            <div className="flex space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer " />
                <select
                  className="w-full md:w-48 pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 bg-slate-50/35 cursor-pointer
                   focus:ring-slate-600 focus:border-transparent appearance-none"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">สถานะทั้งหมด</option>
                  <option value="pending">รอการอนุมัติ</option>
                  <option value="Approved">อนุมัติแล้ว</option>
                  <option value="Rejected">ไม่อนุมัติ</option>
                </select>
              </div>
              {/* ปุ่มเพิ่มโพสต์ใหม่ (Add New Post Button) */}
              <Link href="/travel_form">
                <Button className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600
                 text-white px-6 py-2 rounded-full transition-all shadow-md">
                  <FaPlus />
                  <span>เพิ่มโพสต์ใหม่</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
  
        {/* ตารางแสดงรายการโพสต์ (Posts Table Section) */}
        <div className="bg-slate-50  rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">รายการ
          
          </h2>
          <div className="overflow-x-auto">
          <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300/80">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">ชื่อเต็ม</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">ประเภทบุคลากร</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">รวม</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-600">เอกสาร</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-600">สถานะ</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-600">การกระทำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {currentPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-white/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/viewPost?id=${post._id}`}>
                        <div className="cursor-pointer">
                          <div className="font-medium text-slate-800">{post.fullname}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(post.updatedAt).toLocaleString('th-TH')}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{post.personnel_type}</td>
                    <td className="px-6 py-4 text-slate-600">{post.total_budget}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDocument(post)}
                        className="mx-auto flex items-center justify-center w-8 h-8 rounded-full 
                        bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-slate-600" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        post.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        post.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {post.status === "pending" ? "รอการอนุมัติ" :
                         post.status === "Approved" ? "อนุมัติแล้ว" :
                         "ไม่อนุมัติ"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        {currentUser && currentUser.role === "dean" && (
                          <>
                            <button
                              onClick={() => handleApprove(post)}
                              className="p-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 
                              text-emerald-700 transition-colors"
                              title="อนุมัติ"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(post)}
                              className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 
                              text-red-700 transition-colors"
                              title="ปฏิเสธ"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleViewPost(post)}
                          className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 
                          text-blue-700 transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {post.status !== "pending" && (
                          <button
                            onClick={() => handleDelete(post)}
                            className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 
                            text-pink-700 transition-colors"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Popup สำหรับดูรายละเอียดโพสต์ (Post Details Popup) */}
        {showPopup && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
              <PostPopup post={selectedPost} onClose={() => setShowPopup(false)} />
            </div>
          </div>
        )}
  
        {/* Popup สำหรับดูเอกสาร (Document Popup) */}
        {showDocument && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
              <ExpenseForm post={selectedPost} onClose={() => setShowDocument(false)} />
            </div>
          </div>
        )}
  
        {/* Popup สำหรับลบโพสต์ (Delete Post Popup) */}
        {showDeletePopup && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <DeletePermanentlyPopup
                post={selectedPost}
                onDelete={handleDeletePermanently}
                onClose={() => setShowDeletePopup(false)}
                successMessage="ลบโพสต์สำเร็จแล้ว!"
              />
            </div>
          </div>
        )}
  
        {/* Pagination Section */}
        <div className="mt-6">
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={filteredPosts.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
  
        {/* Toast Notifications */}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default Approval;