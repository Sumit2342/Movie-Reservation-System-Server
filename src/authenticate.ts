import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { JWT_ACCESS_SECRET } from "./config/db.js";
export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized!!",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized!!",
    });

  try {
    jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
      if (err) res.status(403).json({ message: "Token expired or invalid" });
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(403).json({ message: "Token expired or invalid" });
  }
};
