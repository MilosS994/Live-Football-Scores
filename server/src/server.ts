import express, { Application } from "express";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import "dotenv/config";
import connectDB from "./config/db.js";
import { startLiveSyncJob } from "./jobs/syncJob.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";
import { initializeSocket } from "./socket/socket.js";

import matchRoutes from "./routes/match.routes.js";

const app: Application = express();
const server = createServer(app);

const PORT: number = Number(process.env.PORT) || 8080;

initializeSocket(server); // Initialize Socket.io
startLiveSyncJob(); // Start live sync

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/matches", matchRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(
        `Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
      );
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error starting the server:\n", error.message);
    } else {
      console.error("Unexpected error:\n", error);
    }
  }
};

startServer();
