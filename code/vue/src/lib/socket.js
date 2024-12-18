import { io } from "socket.io-client";

// Obtém a URL do WebSocket a partir das variáveis de ambiente
const socketURL = import.meta.env.VITE_WS_CONNECTION;
console.log("WebSocket URL:", socketURL);


const socket = io(socketURL, {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log(`WebSocket connected: ${socket.id}`);
});

socket.on("disconnect", () => {
  console.log("WebSocket disconnected");
});

export default socket;
