import moment from "moment-timezone";
import { admin, getFirestore } from "../config/database.js";

export const healthController = {
  async getHealth(req, res) {
    try {
      const firebaseStatus =
        admin.apps.length > 0 ? "Connected" : "Not initialized";
      let dbStatus = "Not connected";

      try {
        const db = getFirestore();
        dbStatus = db ? "Connected" : "Not connected";
      } catch (error) {
        dbStatus = "Error: " + error.message;
      }

      res.json({
        status: "OK",
        message: "Rex Vets Email Server is running",
        timestamp: new Date().toISOString(),
        platform: "Railway",
        services: {
          firebase: firebaseStatus,
          firestore: dbStatus,
          nodemailer: "Ready",
        },
        environment: {
          hasFirebaseConfig: !!process.env.FIREBASE_PROJECT_ID,
          hasSMTPConfig: !!process.env.SMTP_HOST,
          nodeVersion: process.version,
          platform: process.platform,
          port: process.env.PORT || 5000,
        },
      });
    } catch (error) {
      console.error("❌ Health check error:", error);
      res.status(500).json({
        status: "error",
        message: "Health check failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getHeartbeat(req, res) {
    const now = moment.utc();
    res.json({
      status: "alive",
      timestamp: now.toISOString(),
      serverTime: now.format("YYYY-MM-DD HH:mm:ss") + " UTC",
      platform: "Railway",
      uptime: process.uptime(),
      message: "Server is running and healthy",
    });
  },

  testCors(req, res) {
    res.json({
      message: "CORS test successful",
      origin: req.headers.origin,
      timestamp: new Date().toISOString(),
      method: req.method,
      body: req.method === "POST" ? req.body : undefined,
    });
  },
};
