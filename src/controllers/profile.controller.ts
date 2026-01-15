import type { Request, Response } from "express";
import { profileUser as ProfileService } from "../services/profile.service.js";

export const profile = async (req: Request, res: Response) => {
  try {
    console.log("Req User:", req.user);
    const user = await ProfileService(req.user.email);
    res.status(200).json({ status: "success", data: { user } });
  } catch (error: any) {
    res.status(error.status).json({ status: "Fail", message: error.message });
  }
};
