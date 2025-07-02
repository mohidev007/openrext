import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { corsOptions } from "./config/cors.js";
import { initializeFirebase } from "./config/database.js";
import { cronService } from "./services/cronService.js";
import {
  errorHandler,
  timeoutMiddleware,
  requestLogger,
} from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Log startup environment
console.log("🔧 Starting server with configuration:");
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- PORT: ${PORT}`);
console.log(
  `- Firebase Project: ${process.env.FIREBASE_PROJECT_ID || "Not configured"}`
);
console.log(`- SMTP Host: ${process.env.SMTP_HOST || "Not configured"}`);

// Initialize Firebase
try {
  initializeFirebase();
} catch (error) {
  console.error("❌ Firebase initialization failed:", error.message);
  console.error("Server will continue without Firebase functionality");
}

// Global error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});

// Middleware setup
app.use(errorHandler);
app.use(timeoutMiddleware);
app.use(cors(corsOptions));
app.use(express.json());
app.options("*", cors(corsOptions));
app.use(requestLogger);

// Routes
app.use("/", routes);

// Start server
const server = app
  .listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔒 CORS origins configured`);

    // Start internal cron scheduler
    cronService.startInternalCronScheduler();
  })
  .on("error", (error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

export default app;
