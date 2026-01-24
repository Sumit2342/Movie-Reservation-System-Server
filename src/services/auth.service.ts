import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  prisma,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  REFRESH_TOKEN_EXPIRY_MS,
  REFRESH_TOKEN_ABSOLUTE_EXPIRY_MS,
} from "../config/db.js";
import crypto from "crypto";

import type { User } from "@prisma/client";

export const hashToken = (refreshToken: string) =>
  crypto.createHash("sha256").update(refreshToken).digest("hex");

export const registerUser = async (userData: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existingUser) throw (new Error("Account already exists!").cause = 400);

  const hashedPassword = await bcrypt.hash(userData.password, 12);
  return await prisma.user.create({
    data: { email: userData.email, password: hashedPassword },
  });
};

export const loginUser = async (userData: any) => {
  const user = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (!user || !(await bcrypt.compare(userData.password, user.password))) {
    throw (new Error("Invalid credentials").cause = 400);
  }

  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );
  const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken, user };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const payload = jwt.verify(
    refreshToken,
    JWT_REFRESH_SECRET,
  ) as jwt.JwtPayload;

  const userId = payload.sub;
  if (!userId) throw new Error("Invalid refresh token");

  const hashed = hashToken(refreshToken);

  const session = await prisma.refresh_Tokens.findUnique({
    where: { token_hash: hashed },
    include: { user: true },
  });

  if (!session) throw new Error("Refresh token revoked");

  const now = new Date();
  if (now > session.absolute_expires_at) {
    throw new Error("Session expired. Please login again");
  }

  const newRefreshToken = jwt.sign({ sub: userId }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  await prisma.refresh_Tokens.update({
    where: { id: session.id },
    data: {
      token_hash: hashToken(newRefreshToken),
      expires_at: new Date(now.getTime() + REFRESH_TOKEN_EXPIRY_MS),
    },
  });

  const accessToken = jwt.sign(
    { sub: userId, role: session.user.role },
    JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );

  return { accessToken, newRefreshToken };
};

export const storeHasedRefreshToken = async (
  refreshToken: string,
  id: string,
) => {
  const hashedRefreshToken = hashToken(refreshToken);
  const expireDate = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
  const absoluteExpireDate = new Date(
    Date.now() + REFRESH_TOKEN_ABSOLUTE_EXPIRY_MS,
  );
  console.log("storing refreshToken");
  await prisma.refresh_Tokens.create({
    data: {
      user_id: id,
      token_hash: hashedRefreshToken,
      expires_at: expireDate,
      absolute_expires_at: absoluteExpireDate,
    },
  });
};

export const logoutUser = async (refreshToken: string) => {
  const hashed = hashToken(refreshToken);

  await prisma.refresh_Tokens.deleteMany({
    where: { token_hash: hashed },
  });
};

export const logoutAll = async (userId: string) => {
  await prisma.refresh_Tokens.deleteMany({
    where: { user_id: userId },
  });
};
