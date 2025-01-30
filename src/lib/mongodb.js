import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let isConnected = false;

async function connectWithRetry(retryCount = 1) {
  try {
    console.log(`Attempting to connect to MongoDB (Attempt ${retryCount})...`);

    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
    });

    console.log('MongoDB connected successfully');
    isConnected = true;
  } catch (error) {
    console.error('MongoDB connection error, retrying...', error);

    if (retryCount < 5) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      setTimeout(() => {
        connectWithRetry(retryCount + 1);
      }, delay);
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts');
    }
  }
}

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export async function connectMongoDB() {
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  await connectWithRetry();
}