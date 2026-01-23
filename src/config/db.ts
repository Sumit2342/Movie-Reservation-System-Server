import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
export const JWT_ACCESS_SECRET = process.env.JWT_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const JWT_SOCKET_SECRET = process.env.JWT_SOCKET_SECRET!;
export const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
export const REFRESH_TOKEN_ABSOLUTE_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;
