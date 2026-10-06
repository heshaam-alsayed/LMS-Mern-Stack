import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    files: 5,
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});