import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Use memory storage so we can process/compress files before saving
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

export const fileUpload = upload.single('file');

export default fileUpload;
