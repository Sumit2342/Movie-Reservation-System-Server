import { ZodError } from "zod";
import { AppError } from "../Error/AppError.js";

export function errorHandler(err: any, req: any, res: any, next: any) {
  if (err instanceof ZodError) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({ status: false, message: err.message });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
