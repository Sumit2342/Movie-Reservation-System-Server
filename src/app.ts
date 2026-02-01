import express from "express";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middleware/errorMiddleware.js";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // ALLOW cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);

app.use(errorHandler);

export default app;
