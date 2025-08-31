import { Router } from 'express';
import multer, { diskStorage } from 'multer';
import { uploadFile, listFiles, readFileContent, deleteFile } from '../controllers/fileController.js';

const router = Router();

// Configure multer for file storage
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

// File upload routes
router.post('/upload', upload.single('file'), uploadFile);
router.get('/list', listFiles);
router.get('/read/:id', readFileContent);
router.delete('/delete/:id', deleteFile);

export default router;