import type { Request, Response } from "express";
import * as AuthService from "../services/auth.service.js";

export const login = async (req: Request, res: Response) => {
  try {
    console.log("Request Body:", req.body);
    const { accessToken, refreshToken, user } = await AuthService.loginUser(
      req.body,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT === "PRODUCTION" ? true : false, // Set to false if testing on localhost without HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await AuthService.storeHasedRefreshToken(refreshToken, user.id);

    res.status(200).json({ status: "success", data: { accessToken, user } });
  } catch (error: any) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({ status: "success", data: { user } });
  } catch (error: any) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw (new Error("No refresh token provided").cause = 401);
    }
    const { accessToken, newRefreshToken } =
      await AuthService.refreshAccessToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT === "PRODUCTION" ? true : false, // Set to false if testing on localhost without HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ status: "success", data: { accessToken } });
  } catch (error: any) {
    res.status(401).json({ status: "Fail", message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await AuthService.logoutUser(refreshToken);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT === "PRODUCTION",
      sameSite: "strict",
    });

    return res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    // Logout should never hard-fail
    return res.status(200).json({
      status: "success",
      message: "Logged out",
    });
  }
};

export const logoutAllDevices = async (req: Request, res: Response) => {
  try {
    await AuthService.logoutAll(req.user.sub);
    res.clearCookie("refreshToken");
    res.json({ status: "success" });
  } catch (error: any) {
    return res.status(500).json({ status: "fail", error: error.message });
  }
};
