import { getFirestore } from "../config/database.js";

// Middleware to check Firebase status for endpoints that need it
export const requireFirebase = (req, res, next) => {
  try {
    const db = getFirestore();
    if (!db) {
      return res.status(503).json({
        error: "Database not available",
        message:
          "Firebase is not properly initialized. Please check environment variables.",
        timestamp: new Date().toISOString(),
      });
    }
    req.db = db;
    next();
  } catch (error) {
    return res.status(503).json({
      error: "Database not available",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
