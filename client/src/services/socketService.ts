import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:8080";

class SocketService {
  private socket: Socket | null = null;

  // Connect to backend
  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
      });

      this.socket.on("connect", () => {
        console.log("WebSocket connected!");
      });

      this.socket.on("disconnect", () => {
        console.log("WebSocket disconnected!");
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  //   Listen to an event
  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  //   Stop listening to an event
  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default new SocketService();
