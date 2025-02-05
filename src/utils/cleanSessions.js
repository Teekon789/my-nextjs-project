export async function cleanupSessions() {
    try {
      await dbConnect();
      
      const result = await Session.deleteMany({
        $or: [
          { expiresAt: { $lt: new Date() } },
          { 
            isActive: false,
            endedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        ]
      });
  
      console.log(`Cleaned up ${result.deletedCount} old sessions`);
      return result.deletedCount;
    } catch (error) {
      console.error('Session cleanup error:', error);
      throw error;
    }
  }
  
  // 4. เพิ่ม API Route สำหรับ Cleanup (pages/api/maintenance/cleanup-sessions.js)
  import { cleanupSessions } from '../../../utils/cleanSessions';
  
  export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    // ตรวจสอบ secret key เพื่อความปลอดภัย
    if (req.headers['x-cleanup-key'] !== process.env.CLEANUP_SECRET) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const deletedCount = await cleanupSessions();
      res.status(200).json({ 
        success: true, 
        deletedCount,
        message: `Cleaned up ${deletedCount} old sessions` 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Cleanup failed', 
        error: error.message 
      });
    }
  }