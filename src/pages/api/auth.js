import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const token = jwt.sign({ user: 'test' }, 'your-secret-key', { expiresIn: '1h' });
    return res.json({ token });
  } else if (req.method === 'GET') {
    return res.json({ message: 'API is working!' });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}