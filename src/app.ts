import express from "express";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);

export default app;
