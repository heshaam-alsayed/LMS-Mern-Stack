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

    const user = socket.data.user;

    if (user.role === "admin") {
      socket.join("admins");

      console.log("Admin joined admins room");
    }

    if (user.role === "instructor") {
      socket.join(`instructor:${user._id}`);

      console.log(
        `Instructor joined room: instructor:${user._id}`,
      );
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