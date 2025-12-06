import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: "Not found" });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error("Unhandled error", { err });
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error"
  });
}