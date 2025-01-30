import { connectMongoDB } from '../../lib/mongodb';
import Post from '../../models/post';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectMongoDB();
      const posts = await Post.find({});
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}