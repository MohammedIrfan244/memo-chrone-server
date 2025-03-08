import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../lib/types/type";
import jwt from "jsonwebtoken";
import CustomError from "../lib/utils/CustomError";
import { logError } from "../lib/utils/logger";

const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new CustomError(401, "Unauthorized"));
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new CustomError(401, "Unauthorized"));
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        logError(err.message);
        return next(new CustomError(403, "Forbidden"));
      }
      const { userId } = user as { userId: string };
      req.user = userId;
      next();
    });
  } catch (error) {
    next(new CustomError(401, "Unauthorized"));
  }
};

export default verifyToken;
