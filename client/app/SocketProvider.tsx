"use client";
import { socket } from "@/lib/socket";
import React, { useEffect, useState } from "react";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
      console.log("Connected to Socket.IO:", socket.id);
    }
    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
      console.log("Disconnected from Socket.IO");
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("notification", (data) => {
      console.log("Notification:", data);
    });
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
  console.log("status=>", isConnected);
  console.log("transport=>", transport);
  return children;
}
