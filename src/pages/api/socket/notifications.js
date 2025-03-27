//src/pages/api/socket/notifications.js

import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('Client connected');

    // รับ userId เพื่อให้ join room
    socket.on('register', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} registered`);
    });

    // รับการแจ้งเตือนใหม่
    socket.on('newNotification', (notification) => {
      io.to(notification.recipient).emit('receiveNotification', notification);
    });

    // รับการอัพเดทสถานะโพสต์
    socket.on('postStatusUpdated', (data) => {
      // กระจายข้อมูลไปยังทุกคนที่เกี่ยวข้อง
      io.emit('refreshPosts', {
        postId: data.postId,
        status: data.status
      });
    });
  });

  res.end();
};

export default SocketHandler;