import { Server as socketServer } from "socket.io";
import { Server as httpServer } from "http";

let io: socketServer;

export const initializeSocket = (server: httpServer) => {
  io = new socketServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  // Handle client connections
  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Client subscribes on all matches
    socket.on("subscribe:all", () => {
      socket.join("all-matches"); // => Join room for all matches
      console.log(`Client ${socket.id} subscribed to ALL matches`);
    });

    // Client subscribes on specific match
    socket.on("subscribe:match", (matchId: string) => {
      socket.join(`match-${matchId}`); // => Join room for specific match
      console.log(`Client ${socket.id} subscribed to match ${matchId}`);
    });

    // Client unsubscribes from specific match
    socket.on("unsubscribe:match", (matchId: string) => {
      socket.leave(`match-${matchId}`); // => Leave room for specific match
      console.log(`Client ${socket.id} unsubscribed from match ${matchId}`);
    });

    // Client disconnects
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
  console.log("Socket.io server initialized");
  return io;
};

// Get the initialized Socket.io instance
export const getIO = (): socketServer => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Emit events to clients
export const emitMatchUpdate = (matchId: string, match: any) => {
  const io = getIO();

  io.to(`match:${matchId}`).emit("match:updated", match);

  io.to("all-matches").emit("match:updated", match);

  console.log(`Emitted 'match:updated' for match ${matchId}`);
};

// Emit score update to clients
export const emitScoreUpdate = (matchId: string, match: any) => {
  const io = getIO();

  io.to(`match:${matchId}`).emit("score:updated", match);
  io.to("all-matches").emit("score:updated", match);

  console.log(`Emitted 'score:updated' for match ${matchId}`);
};

// Emit status change to clients
export const emitStatusChange = (matchId: string, status: string) => {
  const io = getIO();

  io.to(`match:${matchId}`).emit("status:changed", { matchId, status });
  io.to("all-matches").emit("status:changed", { matchId, status });

  console.log(`Emitted 'status:changed' for match ${matchId}: ${status}`);
};

// Emit match event to clients
export const emitMatchEvent = (matchId: string, event: any) => {
  const io = getIO();

  io.to(`match:${matchId}`).emit("match:event", { matchId, event });
  io.to("all-matches").emit("match:event", { matchId, event });

  console.log(`Emitted 'match:event' for match ${matchId}`);
};

// Emit match creation to clients
export const emitMatchCreated = (match: any) => {
  const io = getIO();

  io.to("all-matches").emit("match:created", match);

  console.log(`Emitted 'match:created' for match ${match._id}`);
};

// Emit match deletion to clients
export const emitMatchDeleted = (matchId: string) => {
  const io = getIO();

  io.to("all-matches").emit("match:deleted", { matchId });
  io.to(`match:${matchId}`).emit("match:deleted", { matchId });

  console.log(`Emitted 'match:deleted' for match ${matchId}`);
};
