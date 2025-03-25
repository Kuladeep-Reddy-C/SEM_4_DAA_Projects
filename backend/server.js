import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fileRoutes from './routes/fileRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/files', fileRoutes);
dotenv.config();

console.log("MongoDB URI:", process.env.MONGODB_URI);  // Debugging line
if (!process.env.MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is not defined in .env file");
  process.exit(1); // Exit the process
}
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
