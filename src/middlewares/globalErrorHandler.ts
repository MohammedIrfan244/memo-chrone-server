import { Request, Response, NextFunction } from "express";
import { logError } from "../lib/utils/logger";

interface ICustomError extends Error {
  statusCode?: number;
  status?: string;
}

const globalErrorHandler = (
  err: ICustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const status = err.status || "error";
  const method = req.method;
  const endpoint = req.path;
  logError(
    method + " - " + "-" + statusCode + "-" + endpoint + " - " + message
  );
  res.status(statusCode).json({ status, message });
};

export default globalErrorHandler;
