import { io, Socket } from "socket.io-client";
import { getSession } from "next-auth/react";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "http://localhost:3000";
const CHAT_NAMESPACE = "/chat";

let socket: Socket | null = null;

export const getChatSocket = async (): Promise<Socket> => {
  if (socket?.connected) return socket;

  const session = await getSession();
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No authentication token found");
  }

  socket = io(`${SOCKET_URL}${CHAT_NAMESPACE}`, {
    auth: {
      token: `Bearer ${token}`,
    },
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("Connected to chat socket");
  });

  socket.on("connect_error", (error: Error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("disconnect", (reason: string) => {
    console.log("Disconnected from chat socket:", reason);
  });

  return socket;
};

export const disconnectChatSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
