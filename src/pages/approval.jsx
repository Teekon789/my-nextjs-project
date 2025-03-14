import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

import dynamic from "next/dynamic";
// โหลดคอมโพเนนท์แบบ Dynamic Imports 
const ApprovalHeader = dynamic(() => import("../components/approval/ApprovalHeader"));
const DashboardStats = dynamic(() => import("../components/approval/DashboardStats"));
const SearchFilter = dynamic(() => import("../components/approval/SearchFilter"));
const PostsTable = dynamic(() => import("../components/approval/PostsTable"));

const PostPopup = dynamic(() => import("../components/approval/PostPopup"));
const DeletePermanentlyPopup = dynamic(() => import("../components/approval/dletepre"), { ssr: false });

const PDFDocument = dynamic(() => import("../components/PDF/PDFDocument"), { ssr: false });
const Pagination = dynamic(() => import("../components/approval/Pagination"));

// Dynamic import สำหรับ PDF components ซึ่งต้องทำงานที่ client-side เท่านั้น
const PDFViewerComponent = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), { ssr: false });

//นําเข้า PDB_Document
const PDB_Document = dynamic(() => import('../components/PDF/PDB_Document'), {
  ssr: false,
  loading: () => <span className="text-gray-500">กำลังโหลด...</span>
});


const MobileFriendlyPDFViewer = dynamic(() => import('../components/PDF/MobileFriendlyPDFViewer'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-600">กำลังโหลดเอกสาร...</p>
      </div>
    </div>
  )
});


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
  const [isClient, setIsClient] = useState(false); // เพิ่มตัวแปร state เพื่อตรวจสอบว่าเป็น client-side

  useEffect(() => {
    // ตรวจสอบว่าโค้ดทำงานใน client-side
    setIsClient(true);
    // จำลองโหลดข้อมูล
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

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
      router.push('/');
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
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && !user) {
      localStorage.removeItem('token');
      router.push('/');
    }
  }, [router]);
  
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
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
  
      // ส่ง Request Logout ไปยัง Backend เพื่อยกเลิก Session
      await axios.post('/api/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // ลบ Token และ User ออกจาก localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('ally-supports-cache');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      // รีเซ็ต State ของ User
      setCurrentUser(null);
  
      // นำทางกลับไปยังหน้า Login
      router.push('/');
  
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  // เปลี่ยนชื่อฟังก์ชัน handleDocument เป็น handleViewPDF
  const handleViewPDF = (post) => {
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
  
  // ประกาศ linkHref และตรวจสอบว่า token กับ user ถูกกำหนดแล้ว
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
 
  useEffect(() => {
    // ดึงค่าจาก localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(storedUser);
  }, []);
  
  // ตรวจสอบว่าค่ามีหรือไม่
  const linkHref =
    token && user
      ? `/travel_form?token=${encodeURIComponent(token)}&user=${encodeURIComponent(user)}`
      : "/travel_form";


      

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50">
      <ApprovalHeader currentUser={currentUser} handleLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          // แสดง Skeleton UI ระหว่างโหลด
          <div className="space-y-6 animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-1/3"></div>
            <div className="h-40 bg-gray-300 rounded"></div>
            <div className="h-8 bg-gray-300 rounded w-2/3"></div>
            <div className="h-20 bg-gray-300 rounded"></div>
          </div>
        ) : (
          // แสดงเนื้อหาหลักเมื่อโหลดเสร็จ
          <>
            <DashboardStats 
              stats={getDashboardStats()} 
              onCardClick={handleCardClick} 
            />
            
            <SearchFilter 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onStatusChange={setStatusFilter}
              linkHref={linkHref}
            />
            
            <PostsTable 
              currentPosts={currentPosts}
              currentUser={currentUser}
              onApprove={handleApprove}
              onReject={handleReject}
              onView={handleViewPost}
              onDelete={handleDelete}
              onDocument={handleViewPDF} // เปลี่ยน props จาก onDocument เป็น onViewPDF
            />
  
            {showPopup && selectedPost && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
                  <PostPopup post={selectedPost} onClose={() => setShowPopup(false)} />
                </div>
              </div>
            )}
  
          {/* PDFViewer ที่แสดง PDFDocument - รองรับทั้งหน้าจอคอมพิวเตอร์และมือถือด้วย Tailwind CSS */}
          {showDocument && selectedPost && isClient && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[95vh] sm:h-[90vh] mx-auto flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-b">
                  <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-0 truncate w-full sm:w-auto">
                    PDF เอกสาร
                  </h2>
                  
                  <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
                    <PDB_Document post={selectedPost} className="w-full sm:w-auto" />         
                    <button 
                      onClick={() => setShowDocument(false)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center justify-center w-full sm:w-auto"
                    >
                      <span className="text-sm sm:text-base">ปิดเอกสาร</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 p-2 sm:p-4 overflow-hidden">
                  <MobileFriendlyPDFViewer post={selectedPost} />
                </div>
                
                <div className="sm:hidden p-2 border-t flex justify-center space-x-3">
                  <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <div className="text-sm bg-gray-100 px-3 py-2 rounded">
                    หน้า <span className="font-medium">1</span> จาก <span className="font-medium">10</span>
                  </div>
                  <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
            
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
  
            <div className="mt-6">
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={filteredPosts.length}
                currentPage={currentPage}
                paginate={paginate}
              />
            </div>
          </>
        )}
  
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

export default Approval;