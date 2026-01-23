import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { JWT_SOCKET_SECRET } from "../config/db.js";

export function socketAuth(socket: Socket, next: (err?: any) => void) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];
    if (!token) return next((new Error("Unauthorized").cause = 401));
    const payload = jwt.verify(token, JWT_SOCKET_SECRET) as {
      userId: string;
    };

    socket.data.userId = payload.userId;
    next();
  } catch (error: any) {
    next(new Error(error.message));
  }
}
