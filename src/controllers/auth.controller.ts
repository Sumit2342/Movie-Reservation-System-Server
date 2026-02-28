import type { Request, Response } from "express";
import * as AuthService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ForbiddenError } from "../Error/httpErrors.js";

export const login = asyncHandler(async (req: Request, res: Response) => {
  console.log("Request Body:", req.body);
  const { accessToken, refreshToken, user } = await AuthService.loginUser(
    req.body,
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENVIRONMENT === "PRODUCTION" ? true : false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  await AuthService.storeHasedRefreshToken(refreshToken, user.id);

  res.status(200).json({ status: "success", data: { accessToken, user } });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.registerUser(req.body);
  res.status(201).json({ status: "success", data: { user } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ForbiddenError("No refresh token provided");
  }
  const { accessToken, newRefreshToken, user } =
    await AuthService.refreshAccessToken(refreshToken);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENVIRONMENT === "PRODUCTION" ? true : false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    data: {
      accessToken,
      user: { id: user.id, email: user.email, role: user.role },
    },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await AuthService.logoutUser(refreshToken);
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENVIRONMENT === "PRODUCTION" ? true : false,
    sameSite: "strict",
  });

  return res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

export const logoutAllDevices = asyncHandler(
  async (req: Request, res: Response) => {
    await AuthService.logoutAll(req.user.sub);
    res.clearCookie("refreshToken");
    res.json({ status: "success" });
  },
);
