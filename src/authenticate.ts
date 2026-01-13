import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { SECRET } from "./index.js";
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
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch (error) {}
};
