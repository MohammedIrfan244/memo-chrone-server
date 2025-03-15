import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { PassThrough } from "stream";
import CustomError from "../utils/CustomError";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  uploadedFile?: UploadApiResponse;
}

const uploadToCloudinary = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) return next();

    const buffer = req.file.buffer;
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "Aura_uploads",
      },
      (error: unknown, result?: UploadApiResponse) => {
        if (error || !result) {
          console.error("Error uploading file to Cloudinary:", error);
          return next(
            new CustomError(400, "Error uploading file to Cloudinary")
          );
        }

        req.uploadedFile = result;
        next();
      }
    );

    const bufferStream = new PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(uploadStream);
  } catch (error) {
    console.error(
      "Unexpected error while uploading file to Cloudinary:",
      error
    );
    return next(new CustomError(500, "Error uploading file to Cloudinary"));
  }
};

export default uploadToCloudinary;
