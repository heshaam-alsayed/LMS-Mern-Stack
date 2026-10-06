import http from "http";
import { Server } from "socket.io";

import { authenticationSocket } from "./middlewares/socketAuth";
import { registerTicketHandlers } from "./socket/ticketHandlers";

let io: Server;

export const initSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
    maxHttpBufferSize: 32 * 1024 * 1024,
  });

  io.use(authenticationSocket);

  registerTicketHandlers(io);

  io.on("connection", (socket) => {
    const user = socket.data.user;

    // Personal notifications
    if (user?._id) {
      socket.join(`user:${user._id}`);
    }

    // Admin notifications
    if (user?.role === "admin") {
      socket.join("admins");
    }

    // Instructor notifications
    if (user?.role === "instructor") {
      socket.join(`instructor:${user._id}`);
    }

    socket.on("disconnect", () => {
      // no-op
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};