import { Request } from "express";
import multer from "multer";

interface MulterFileFilterCallback  extends multer.FileFilterCallback {
  (error: Error | null, acceptFile: boolean): void;
}

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: MulterFileFilterCallback ) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only images are supported"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
});

export default upload;