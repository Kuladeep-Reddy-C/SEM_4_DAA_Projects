import fs from 'fs/promises';  // ✅ Correct import
import File from '../models/file.js'; // ✅ Correct import

// Upload File
export async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newFile = new File({
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    });

    await newFile.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: newFile
    });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
}

// List Files
export async function listFiles(req, res) {
  try {
    const files = await File.find().sort({ uploadedAt: -1 }); // ✅ Fixed
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error listing files', error: error.message });
  }
}

// Read File Content
export async function readFileContent(req, res) {
  try {
    const file = await File.findById(req.params.id); // ✅ Fixed
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const content = await fs.readFile(file.path, 'utf-8');
    res.json({ filename: file.filename, content });
  } catch (error) {
    res.status(500).json({ message: 'Error reading file', error: error.message });
  }
}

// Delete File
export async function deleteFile(req, res) {
  try {
    const file = await File.findById(req.params.id); // ✅ Fixed
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Remove file from filesystem
    await fs.unlink(file.path);

    // Remove file from database
    await File.findByIdAndDelete(req.params.id); // ✅ Fixed

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
}
