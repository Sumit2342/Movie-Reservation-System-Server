import { Server } from "socket.io";
import { server } from "../api/httpServer.js";
import { socketAuth } from "./socketAuth.js";
import { getYdoc } from "./yjsManager.js";
import * as Y from "yjs";

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(socketAuth);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("join-room", (roomId: string) => {
    const ydoc = getYdoc(roomId);
    socket.join(roomId);

    socket.on("yjs-update", (update: Uint8Array) => {
      if (!ydoc) return;
      Y.applyUpdate(ydoc, update);
      socket.to(roomId).emit("yjs-update", update);
    });
  });
});
