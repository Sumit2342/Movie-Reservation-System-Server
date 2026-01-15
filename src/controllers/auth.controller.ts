import type { Request, Response } from "express";
import * as AuthService from "../services/auth.service.js";

export const login = async (req: Request, res: Response) => {
  try {
    console.log("Request Body:", req.body);
    const { accessToken, refreshToken, user } = await AuthService.loginUser(
      req.body
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Set to false if testing on localhost without HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ status: "success", data: { accessToken } });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ status: "Fail", message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({ status: "success", data: { user } });
  } catch (error: any) {
    res.status(error.status).json({ status: "Fail", message: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw (new Error("No refresh token provided").cause = 401);
    }
    const { accessToken } = await AuthService.refreshAccessToken(refreshToken);
    res.status(200).json({ status: "success", data: { accessToken } });
  } catch (error: any) {
    res.status(error.status).json({ status: "Fail", message: error.message });
  }
};
