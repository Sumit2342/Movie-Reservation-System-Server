import { Request } from "express";
import { User } from "./index.ts";

export interface User {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export interface MovieParams {
  id: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
