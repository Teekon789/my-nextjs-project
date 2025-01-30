import { connectMongoDB } from '../../lib/mongodb';
import Post from '../../models/post';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { _id } = req.query;

  if (req.method === 'PUT') {
    try {
      await connectMongoDB();
      if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: 'Invalid or missing _id' });
      }
      const updatedPost = await Post.findByIdAndUpdate(_id, req.body, { new: true });
      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}