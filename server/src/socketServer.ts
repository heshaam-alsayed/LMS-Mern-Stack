import http from "http";
import { Server } from "socket.io";
import { authenticationSocket } from "./middlewares/socketAuth";

let io: Server;

export const initSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.use(authenticationSocket);

  io.on("connection", (socket) => {
    console.log("client connected");

    if (socket.data.user.role === "admin") {
      socket.join("admins");
      console.log("Admin joined admins room");
      console.log("Admin joined:", socket.id);
      console.log("Admin rooms:", socket.rooms);
    }
    socket.emit("welcome", {
      message: "Welcome to the Socket.IO server",
    });
    socket.on("disconnect", () => {
      console.log("client disconnected");
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
