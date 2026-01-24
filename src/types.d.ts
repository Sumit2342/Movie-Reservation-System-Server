import { Request } from "express";
import { User } from "./index.ts";

export interface User {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}
declare global {
  namespace Express {
    interface Request {
      user?: User; // Or use a specific User interfa
    }
  }
}
