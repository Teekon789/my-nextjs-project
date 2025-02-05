//middleware.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const jsonwebtoken = await import('jsonwebtoken'); // โหลดเฉพาะตอนรันบน Server
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ data: decoded });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
