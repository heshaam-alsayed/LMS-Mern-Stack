"use client";

import { io } from "socket.io-client";
const endpoint = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
export const socket = io(endpoint, {
  withCredentials: true,
});
