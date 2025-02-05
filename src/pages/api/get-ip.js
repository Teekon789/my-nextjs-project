export default function handler(req, res) {
    const ip =
      req.headers["x-forwarded-for"] || // กรณีใช้ Proxy หรือ Load Balancer
      req.connection?.remoteAddress || // IP จาก TCP connection
      req.socket?.remoteAddress || // IP จาก Socket
      req.connection?.socket?.remoteAddress || "Unknown";
  
    res.json({ ip });
  }
  