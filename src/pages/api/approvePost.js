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
  
  const handleDeletePermanently = async () => {
    if (!selectedPost) return;
  
    try {
      const response = await fetch(`/api/deletePost?_id=${selectedPost._id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
  
      toast.success("ลบโพสต์สำเร็จแล้ว!");
      setShowDeletePopup(false);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error("เกิดข้อผิดพลาดในการลบโพสต์");
    }
  };