
import React, { useState, useEffect, useCallback } from 'react'; // นำเข้า React
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
const PostsDashboard = dynamic(() => import("../components/approval/PostsDashboard"));
const PostsTable = dynamic(() => import("../components/approval/PostsTable"));
const DeletePermanentlyPopup = dynamic(() => import("../components/approval/dletepre"), { ssr: false });
const Pagination = dynamic(() => import("../components/approval/Pagination"));
const PostPopup = dynamic(() => import("../components/approval/PostPopup"));
const RejectionReasonDialog = dynamic(() => import("../components/approval/RejectionReasonDialog")); // นําเข้า RejectionReasonDialog
const PDB_Document = dynamic(() => import('../components/PDF/PDB_Document'), { //นําเข้า PDB_Document
  ssr: false, 
  loading: () => <span className="text-gray-500">กำลังโหลด...</span>
});
const MobileFriendlyPDFViewer = dynamic(() => import('../components/PDF/MobileFriendlyPDFViewer'), { // นําเข้า MobileFriendlyPDFViewer
  ssr: false,
  loading: () => <span className="text-gray-500">กำลังโหลด PDF Viewer...</span>
});


const Approval = () => {
  const router = useRouter(); // นำเข้า useRouter
  const [posts, setPosts] = useState([]);// เพิ่มตัวแปร state สำหรับเก็บโพสต์
  const [currentUser, setCurrentUser] = useState({ username: "-", role: "-" }); // กำหนดค่าเริ่มต้นของ currentUser
  const [searchQuery, setSearchQuery] = useState("");// เพิ่มตัวแปร state สำหรับการค้นหา
  const [statusFilter, setStatusFilter] = useState("");// เพิ่มตัวแปร state สำหรับการกรองสถานะ
  const [currentPosts, setCurrentPosts] = useState([]);// เพิ่มตัวแปร state สำหรับการเก็บโพสต์ที่แสดง
  const [showPopup, setShowPopup] = useState(false);// เพิ่มตัวแปร state สำหรับการแสดง Popup
  const [showDocument, setShowDocument] = useState(false);// เพิ่มตัวแปร state สำหรับการแสดงเอกสาร
  const [showDeletePopup, setShowDeletePopup] = useState(false);// เพิ่มตัวแปร state สำหรับการแสดง Popup การลบ
  const [postsPerPage] = useState(10);// เพิ่มตัวแปร state สำหรับจำนวนโพสต์ต่อหน้า
  const [currentPage, setCurrentPage] = useState(1);// เพิ่มตัวแปร state สำหรับหน้าปัจจุบัน
  const [isLoading, setIsLoading] = useState(true);// เพิ่มตัวแปร state สำหรับการโหลดข้อมูล
  const [isClient, setIsClient] = useState(false); // เพิ่มตัวแปร state เพื่อตรวจสอบว่าเป็น client-side
  const [selectedPost, setSelectedPost] = React.useState(null); // ใช้ React.useState แทน useState
  const [currentView, setCurrentView] = useState('posts-table'); // เพิ่มตัวแปร state สำหรับการเปลี่ยนแสดงหน้า
  const [showRejectionDialog, setShowRejectionDialog] = useState(false); // เพิ่มตัวแปร state สำหรับการแสดง Dialog การปฏิเสธ
  const [postToReject, setPostToReject] = useState(null); // เพิ่มตัวแปร state สำหรับการเก็บโพสต์ที่จะปฏิเสธ


   // ตัวอย่างการตั้งค่า selectedPost
   useEffect(() => {
    setSelectedPost({
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      document: null,
      documentUrl: null,
    });
  }, []);

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


  {/* สร้างฟังก์ชัน handleLogout สำหรับการออกจากระบบ */}
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
  
  {/* สร้างฟังก์ชัน handleApprove สำหรับการอนุมัติโพสต์ */}
  const handleApprove = async (post) => {
    try {
      const response = await fetch(`/api/updatePost?_id=${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'Approved',
          approvedAt: new Date().toISOString(),
          approvedBy: currentUser.id,
          approverName: currentUser.username
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve post');
      }
  
      // ส่งการแจ้งเตือนไปยังผู้สร้างโพสต์
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: post.createdBy,
          senderId: currentUser.id,
          type: 'approved',
          message: `คำขอของคุณได้รับการอนุมัติโดย ${currentUser.fullname}`,
          postId: post._id
        })
      });
  
      toast.success("โพสต์ได้รับการอนุมัติ!");
      fetchPosts();
    } catch (error) {
      console.error('Error approving post:', error);
      toast.error(`เกิดข้อผิดพลาดในการอนุมัติ: ${error.message}`);
    }
  };
  

  {/* สร้างฟังก์ชัน handleReject สำหรับการปฏิเสธโพสต์ */}
  const handleReject = (post) => {
    setPostToReject(post);
    setShowRejectionDialog(true);
  };
  
  {/* สร้างฟังก์ชัน handleRejectSubmit สำหรับการส่งเหตุผลการปฏิเสธ */}
  const handleRejectSubmit = async (post, rejectReason) => {
    try {
      const response = await fetch(`/api/updatePost?_id=${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'Rejected',
          reject_reason: rejectReason
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject post');
      }
  
      // ส่งการแจ้งเตือนไปยังผู้สร้างโพสต์
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: post.createdBy,
          senderId: currentUser.id,
          type: 'rejected',
          message: `คำขอของคุณถูกปฏิเสธโดย ${currentUser.fullname}: ${rejectReason}`,
          postId: post._id
        })
      });
  
      toast.success("โพสต์ถูกปฏิเสธ!");
      fetchPosts();
    } catch (error) {
      console.error('Error rejecting post:', error);
      toast.error(`เกิดข้อผิดพลาดในการปฏิเสธ: ${error.message}`);
    }
  };
  
  {/* สร้างฟังก์ชัน handleViewPost สำหรับการแสดงโพสต์ */}
  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowPopup(true);
  };
  
  {/* สร้างฟังก์ชัน handleDelete สำหรับการลบโพสต์ */}
  const handleDelete = (post) => {
    setSelectedPost(post);
    setShowDeletePopup(true);
  };

 
  {/* สร้างฟังก์ชัน handleDeletePermanently สำหรับการลบโพสต์อย่างถาวร */}
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


      // เลือกหน้าที่จะแสดง
  const renderCurrentView = () => {
    switch(currentView) {
      case 'posts-table':
        return (
          <PostsTable 
            currentPosts={currentPosts}
              currentUser={currentUser}
              onApprove={handleApprove}
              onReject={handleReject}
              onView={handleViewPost}
              onDelete={handleDelete}
              onViewPDF={handleViewPDF}
              onNavigateToPostsDashboard={() => setCurrentView('posts-dashboard')}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onChangeView={setCurrentView} 
          />
        );
      case 'posts-dashboard':
        return (
          <PostsDashboard 
            posts={posts}
            currentUser={currentUser}
            onNavigateToPostsTable={() => setCurrentView('posts-table')}
          />
        );
      default:
        return null;
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50">
     <ApprovalHeader 
      currentUser={currentUser} 
      handleLogout={handleLogout}
    >
    </ApprovalHeader>
      
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

      

            {renderCurrentView()}

            

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
                  
                  <div className="flex-1 p-2 sm:p-4 overflow-auto">
                    <MobileFriendlyPDFViewer post={selectedPost} />
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

            {showRejectionDialog && (
              <RejectionReasonDialog 
                isOpen={showRejectionDialog}
                onClose={() => setShowRejectionDialog(false)}
                onSubmit={handleRejectSubmit}
                post={postToReject}
              />
            )}

          {currentView === 'posts-table' && ( // ตรวจสอบ currentView  และแสดง Pagination ในหน้า posts-table เท่านั้น
            <div className="mt-6">
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={filteredPosts.length}
                currentPage={currentPage}
                paginate={paginate}
              />
            </div>
          )}

          </>
        )}
  
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

export default Approval;