const handleApprove = async (post) => {
  try {
    // ทำงานทั้ง 3 อย่างพร้อมกัน
    const [updatePostResponse, updateNotificationResponse, createNotificationResponse] = await Promise.all([
      // 1. อัปเดตสถานะโพสต์
      fetch(`/api/updatePost?_id=${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      }),

      // 2. อัปเดตการแจ้งเตือนเก่า
      fetch(`/api/notifications?postId=${post._id}`, {
        method: 'PUT'
      }),

      // 3. สร้างการแจ้งเตือนใหม่
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: post.userId,
          type: 'post_approved',
          message: 'โพสต์ของคุณได้รับการอนุมัติแล้ว',
          postId: post._id,
          senderId: session?.user?._id
        })
      })
    ]);

    if (!updatePostResponse.ok) throw new Error('Failed to approve post');

    toast.success("โพสต์ได้รับการอนุมัติ!");
    fetchPosts();
  } catch (error) {
    console.error('Error:', error);
    toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
  }
};

const handleDeletePermanently = async () => {
  if (!selectedPost) return;

  try {
    const [deleteResponse, updateNotifResponse, createNotifResponse] = await Promise.all([
      // 1. ลบโพสต์
      fetch(`/api/deletePost?_id=${selectedPost._id}`, {
        method: 'DELETE'
      }),

      // 2. อัปเดตการแจ้งเตือนเก่า
      fetch(`/api/notifications?postId=${selectedPost._id}`, {
        method: 'PUT'
      }),

      // 3. สร้างการแจ้งเตือนใหม่
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedPost.userId,
          type: 'post_rejected',
          message: 'โพสต์ของคุณไม่ได้รับการอนุมัติ',
          postId: selectedPost._id,
          senderId: session?.user?._id
        })
      })
    ]);

    if (!deleteResponse.ok) throw new Error('Failed to delete post');

    toast.success("ลบโพสต์สำเร็จ!");
    setShowDeletePopup(false);
    fetchPosts();
  } catch (error) {
    console.error('Error:', error);
    toast.error("เกิดข้อผิดพลาดในการลบโพสต์");
  }
};