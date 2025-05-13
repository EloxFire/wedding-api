import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

// Establish the MongoDB connection
mongoose.connect(process.env.MONGO_URI || "", { dbName: "wedding"})
  .then(() => {
    console.log('[server]: Connected to database');
  })
  .catch((error) => {
    console.error('[server]: Error connecting to MongoDB :', error);
  });

// Export the Mongoose connection
export default mongoose.connection;
