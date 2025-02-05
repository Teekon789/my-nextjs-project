import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/user';
import Session from '../../../models/session';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { Server } from 'socket.io';

export default async function handler(req, res) {
    if (!res.socket.server.io) {
        console.log("🔧 Setting up Socket.IO...");
        const io = new Server(res.socket.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        res.socket.server.io = io;

        io.on('connection', (socket) => {
            console.log('✅ Client connected:', socket.id);

            socket.on('join', (userId) => {
                socket.join(userId);
                console.log(`🔗 User ${userId} joined room ${userId}`);
            });

            socket.on('deleteSession', async (userId) => {
                try {
                    console.log(`❌ Deleting session for user: ${userId}`);
                
                    await Session.deleteMany({ userId });
                
                    io.to(userId).emit('sessionDeleted', { 
                        message: 'Session ของคุณถูกลบแล้ว' 
                    });
                    console.log(`✅ sessionDeleted event sent to user ${userId}`);
                } catch (error) {
                    console.error('❌ Error deleting session:', error);
                    io.to(userId).emit('sessionDeleteFailed', { 
                        message: 'ไม่สามารถลบ session ได้' 
                    });
                }
            });

            socket.on('disconnect', () => {
                console.log('❌ Client disconnected:', socket.id);
            });
        });
    }

    try {
        await dbConnect();
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้งานนี้ในระบบ' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        const globalInvalidationToken = randomUUID();

        await Promise.all([
            User.findByIdAndUpdate(user._id, {
                $set: { 
                    globalInvalidationToken,
                    globalInvalidationTimestamp: new Date()
                }
            }),
            Session.deleteMany({ userId: user._id })
        ]);

        const io = res.socket.server.io;
        const userId = user._id.toString();
        console.log(`📢 Broadcasting forceLogout to ${userId}`);

        io.to(userId).emit('forceLogout', {
            type: 'SESSION_RESET',
            message: 'Session ของคุณถูกยกเลิกจากอุปกรณ์อื่น',
            userId: userId,
            globalInvalidationToken
        });

        io.to(userId).emit('sessionDeleted', {
            message: 'Session ของคุณถูกลบแล้ว',
            userId: userId
        });

        res.status(200).json({ 
            success: true,
            message: 'รีเซ็ต Session สำเร็จ กรุณาล็อกอินใหม่',
            globalInvalidationToken 
        });

    } catch (error) {
        console.error('❌ Reset session error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการรีเซ็ต Session' });
    }
}