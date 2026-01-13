import { Request } from "express";
import { User } from "./index.ts";
declare global {
  namespace Express {
    interface Request {
      user?: any; // Or use a specific User interface if you have one
    }
  }
}
