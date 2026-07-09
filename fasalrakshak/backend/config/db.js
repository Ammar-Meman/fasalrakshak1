import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not defined in environment variables. Database features will be unavailable.');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ Error connecting to MongoDB: ${error.message}`);
    console.warn('The backend server will continue running without database features.');
  }
};

export default connectDB;
