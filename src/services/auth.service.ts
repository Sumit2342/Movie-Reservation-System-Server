import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config/db.js";

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

  const accessToken = jwt.sign({ email: user.email }, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ email: user.email }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken, user };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const payload = jwt.verify(
    refreshToken,
    JWT_REFRESH_SECRET
  ) as jwt.JwtPayload;

  if (!payload.email) {
    throw (new Error("Invalid refresh token").cause = 400);
  }
  const accessToken = jwt.sign({ email: payload.email }, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  return { accessToken };
};
