import cron from "node-cron";
import moment from "moment-timezone";
import { reminderService } from "./reminderService.js";

export const cronService = {
  startInternalCronScheduler() {
    console.log("🕒 Starting internal cron scheduler...");

    // Schedule reminder processing every 2 minutes
    cron.schedule(
      "*/2 * * * *",
      async () => {
        console.log("🔄 Internal cron: Processing reminder emails...");
        try {
          const response = await reminderService.processReminders();
          console.log("✅ Internal cron completed:", response);
        } catch (error) {
          console.error("❌ Internal cron error:", error);
        }
      },
      {
        scheduled: true,
        timezone: "UTC",
      }
    );

    // Health check every 5 minutes
    cron.schedule(
      "*/5 * * * *",
      () => {
        console.log(`💓 Internal heartbeat: ${new Date().toISOString()}`);
      },
      {
        scheduled: true,
        timezone: "UTC",
      }
    );

    console.log("✅ Internal cron scheduler started successfully");
  },

  getStatus() {
    const now = moment.utc();
    return {
      status: "active",
      currentTime: now.format("YYYY-MM-DD HH:mm:ss") + " UTC",
      platform: "Railway",
      cronScheduler: "node-cron (internal)",
      uptime: process.uptime(),
      serverRunning: true,
      message: "Internal cron scheduler is active",
      nodeVersion: process.version,
      timestamp: now.toISOString(),
    };
  },
};
