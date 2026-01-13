import express, { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "./Error/AppError.js";
import auth from "./authenticate.js";
import dotenv from "dotenv";

dotenv.config();

export type User = {
  email: string;
  password: string;
};

export const SECRET = process.env.JWT_SECRET!;
console.log("SECRET:", SECRET);
const app = express();
const port = 3000;

app.use(express.json());

const users: User[] = [];

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from server");
});

app.post("/register", async (req: Request, res: Response) => {
  try {
    if (users.some((user) => user.email === req.body.email)) {
      const err = new AppError("Account already exist with this email!", 400);
      throw err;
    }

    const user = {
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 12),
    };

    users.push(user);

    res.status(201).json({
      status: "success",
      message: "User registerd!",
      data: {
        user: {
          email: user.email,
        },
      },
    });
  } catch (error: any) {
    res.status(error.status).json({
      status: "Fail",
      message: error.message,
    });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const user = users.find((user) => user.email === req.body.email);
    if (!user) {
      const err = new AppError("No account with this email!", 400);
      throw err;
    } else if (await bcrypt.compare(req.body.password, user.password)) {
      const tokenPayload = {
        email: user.email,
      };
      const acessToken = jwt.sign(tokenPayload, SECRET);
      res.status(201).json({
        status: "success",
        message: "User Logged in!",
        data: {
          acessToken,
        },
      });
    } else {
      const err = new AppError("Password does not match", 400);
      throw err;
    }
  } catch (error: any) {
    const statusCode = error.status || 500;

    res.status(statusCode).json({
      status: "fail",
      message: error.message || "An unexpected error occurred",
    });
  }
});

app.get("/profile", auth, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Logged In User Information.",
    data: {
      user: {
        email: req.user.email,
      },
    },
  });
});

app.listen(port, () => {
  console.log("Server is listening at port ", port);
});
