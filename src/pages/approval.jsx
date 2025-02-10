
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';


import dynamic from "next/dynamic";
// โหลดแบบ Dynamic Imports 
const ApprovalHeader = dynamic(() => import("../components/approval/ApprovalHeader"));
const DashboardStats = dynamic(() => import("../components/approval/DashboardStats"));
const SearchFilter = dynamic(() => import("../components/approval/SearchFilter"));
const PostsTable = dynamic(() => import("../components/approval/PostsTable"));

const PostPopup = dynamic(() => import("../components/approval/PostPopup"), { ssr: false });
const DeletePermanentlyPopup = dynamic(() => import("../components/approval/dletepre"), { ssr: false });
const ExpenseForm = dynamic(() => import("../components/approval/ExpenseForm"));
const Pagination = dynamic(() => import("../components/approval/Pagination"));

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
  
  // เพิ่มการตรวจสอบ Token ก่อนเข้าหน้าต่างๆ
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // ถ้ามี Token แต่ไม่มี User ให้ล้างทั้งหมด
    if (token && !user) {
      localStorage.removeItem('token');
      router.push('/');
    }
  }, []);
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
          onDocument={handleDocument}
        />
        {showPopup && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
              <PostPopup post={selectedPost} onClose={() => setShowPopup(false)} />
            </div>
          </div>
        )}
        {showDocument && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
              <ExpenseForm post={selectedPost} onClose={() => setShowDocument(false)} />
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
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}
export default Approval;