import { Schema, model } from 'mongoose';

const FileSchema = new Schema({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  path: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  size: {
    type: Number,
    required: true
  }
});

export default model('File', FileSchema);