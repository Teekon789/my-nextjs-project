const handleApprove = async (post) => {
  try {
    // อัปเดตสถานะโพสต์
    const response = await fetch(`/api/updatePost?_id=${post._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Approved' })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to approve post');
    }

    // อัปเดตสถานะการอ่านการแจ้งเตือนเก่าที่เกี่ยวข้องกับโพสต์นี้
    const updateNotificationResponse = await fetch(`/api/notifications?postId=${post._id}`, {
      method: 'PUT'
    });

    if (!updateNotificationResponse.ok) {
      console.error('Failed to update existing notifications');
    }

    // สร้างการแจ้งเตือนใหม่
    const newNotification = {
      recipientId: post.userId,
      type: 'post_approved',
      message: 'โพสต์ของคุณได้รับการอนุมัติแล้ว',
      postId: post._id,
      senderId: session?.user?._id
    };

    const notificationResponse = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotification)
    });

    if (!notificationResponse.ok) {
      console.error('Failed to create new notification');
    }

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
    // ลบโพสต์
    const response = await fetch(`/api/deletePost?_id=${selectedPost._id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    // อัปเดตสถานะการอ่านการแจ้งเตือนเก่า
    await fetch(`/api/notifications?postId=${selectedPost._id}`, {
      method: 'PUT'
    });

    // สร้างการแจ้งเตือนใหม่สำหรับการปฏิเสธ
    const newNotification = {
      recipientId: selectedPost.userId,
      type: 'post_rejected',
      message: 'โพสต์ของคุณไม่ได้รับการอนุมัติ',
      postId: selectedPost._id,
      senderId: session?.user?._id
    };

    const notificationResponse = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotification)
    });

    if (!notificationResponse.ok) {
      console.error('Failed to create rejection notification');
    }

    toast.success("ลบโพสต์สำเร็จ!");
    setShowDeletePopup(false);
    fetchPosts();
  } catch (error) {
    console.error('Error:', error);
    toast.error("เกิดข้อผิดพลาดในการลบโพสต์");
  }
};