import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moment from "moment-timezone";

// Import configurations
import { corsOptions } from "./src/config/cors.js";
import { initializeFirebase } from "./src/config/database.js";

// Import middleware
import {
  errorHandler,
  timeoutMiddleware,
  requestLogger,
} from "./src/middleware/errorHandler.js";
import { requireFirebase } from "./src/middleware/auth.js";

// Import services
import { cronService } from "./src/services/cronService.js";
import { reminderService } from "./src/services/reminderService.js";
import { generateInvoicePDFPuppeteer } from "./src/services/pdfService.js";

// Import controllers
import { emailController } from "./src/controllers/emailController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Log startup environment
console.log("🔧 Starting Rex Vets Email Server:");
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

// Middleware
app.use(errorHandler);
app.use(timeoutMiddleware);
app.use(cors(corsOptions));
app.use(express.json());
app.options("*", cors(corsOptions));
app.use(requestLogger);

// ==================== ROUTES ====================

// Health check endpoints
app.get(["/", "/health"], (req, res) => {
  try {
    res.json({
      status: "OK",
      message: "Rex Vets Email Server is running",
      timestamp: new Date().toISOString(),
      platform: "Railway",
      services: {
        firebase: "Connected",
        firestore: "Connected",
        nodemailer: "Ready",
      },
      environment: {
        hasFirebaseConfig: !!process.env.FIREBASE_PROJECT_ID,
        hasSMTPConfig: !!process.env.SMTP_HOST,
        nodeVersion: process.version,
        platform: process.platform,
        port: PORT,
      },
    });
  } catch (error) {
    console.error("❌ Health check error:", error);
    res.status(500).json({
      status: "error",
      message: "Health check failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.get("/api/heartbeat", (req, res) => {
  const now = moment.utc();
  res.json({
    status: "alive",
    timestamp: now.toISOString(),
    serverTime: now.format("YYYY-MM-DD HH:mm:ss") + " UTC",
    platform: "Railway",
    uptime: process.uptime(),
    message: "Server is running and healthy",
  });
});

// CORS test endpoints
app.get("/test-cors", (req, res) => {
  res.json({
    message: "CORS test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    method: req.method,
  });
});

app.post("/test-cors", (req, res) => {
  res.json({
    message: "CORS POST test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    method: req.method,
    body: req.body,
  });
});

// Email endpoints - using controllers
app.post("/sendWelcomeEmailParent", emailController.sendWelcomeEmail);
app.post(
  "/sendBookingConfirmation",
  requireFirebase,
  emailController.sendBookingConfirmation
);
app.post(
  "/sendRescheduleAppointmentConfirmation",
  requireFirebase,
  emailController.sendRescheduleConfirmation
);
app.post("/sendPaymentEmail", emailController.sendPaymentEmail);
app.post("/sendRequestAccpetedEmail", emailController.sendRequestAcceptedEmail);
app.post("/sendHelpAskingMail", emailController.sendHelpRequest);
app.post("/sendDonationThankYou", emailController.sendDonationThankYou);

// Cron job endpoints
app.get("/api/cron/process-reminders", requireFirebase, async (req, res) => {
  try {
    console.log("🔄 Cron job triggered: Processing reminder emails...");
    const result = await reminderService.processReminders();

    console.log(
      `✅ Cron job completed: Processed ${result.processedCount} reminders, sent ${result.sentCount} emails`
    );
    res.json({
      success: true,
      message: `Processed ${result.processedCount} reminders, sent ${result.sentCount} emails`,
      ...result,
      serverTime: moment.utc().format("YYYY-MM-DD HH:mm:ss") + " UTC",
      platform: "Railway",
    });
  } catch (error) {
    console.error("❌ Error in cron job:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.get("/api/cron/status", requireFirebase, async (req, res) => {
  try {
    const reminders = await reminderService.getReminders(10);
    const pendingReminders = reminders.filter((r) => !r.reminderSent);
    const sentReminders = reminders.filter((r) => r.reminderSent).slice(0, 5);

    res.json({
      status: "healthy",
      currentTime: moment.utc().format("YYYY-MM-DD HH:mm:ss") + " UTC",
      platform: "Railway",
      cronJobStatus: {
        endpoint: "/api/cron/process-reminders",
        lastCheck: new Date().toISOString(),
        pendingRemindersCount: pendingReminders.length,
        recentSentCount: sentReminders.length,
      },
      pendingReminders: pendingReminders.map((r) => ({
        id: r.id,
        parentEmail: r.parentEmail,
        appointmentDate: r.appointmentDate,
        appointmentTime: r.appointmentTime,
        createdAt: r.scheduledAt,
      })),
      recentSentReminders: sentReminders.map((r) => ({
        id: r.id,
        parentEmail: r.parentEmail,
        appointmentDate: r.appointmentDate,
        appointmentTime: r.appointmentTime,
        sentAt: r.sentAt || "Unknown",
      })),
    });
  } catch (error) {
    console.error("❌ Error in cron status endpoint:", error);
    res.status(500).json({
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Debug endpoints
app.get("/api/debug/reminders", requireFirebase, async (req, res) => {
  try {
    const reminders = await reminderService.getReminders(20);
    res.json({
      success: true,
      currentTimeUTC: moment.utc().format(),
      timezone: "UTC",
      totalReminders: reminders.length,
      reminders,
    });
  } catch (error) {
    console.error("❌ Error in debug endpoint:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/debug/cron-status", (req, res) => {
  res.json(cronService.getStatus());
});

// Test endpoints
app.post("/api/test/trigger-reminder", requireFirebase, async (req, res) => {
  try {
    const { reminderId } = req.body;
    if (!reminderId) {
      return res.status(400).json({
        success: false,
        error: "reminderId is required",
      });
    }

    const reminderData = await reminderService.sendTestReminder(reminderId);
    res.json({
      success: true,
      message: "Test reminder sent successfully",
      reminderData,
    });
  } catch (error) {
    console.error("❌ Error in test endpoint:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/api/test/internal-cron", requireFirebase, async (req, res) => {
  try {
    const result = await reminderService.processReminders();
    res.json({
      success: true,
      message: "Internal cron executed successfully",
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in internal cron test:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.post("/api/test/create-appointment", requireFirebase, async (req, res) => {
  try {
    const appointmentTime = moment().add(15, "minutes");

    const reminderData = {
      appointmentDate: appointmentTime.format("YYYY-MM-DD"),
      appointmentTime: appointmentTime.format("h:mm A"),
      appointmentTimeUTC: appointmentTime.utc().toISOString(),
      doctorTimezone: "America/New_York",
      userTimezone: "America/New_York",
      parentEmail: "test@example.com",
      parentName: "Test Parent",
      doctorName: "Test Doctor",
      doctorEmail: "test.doctor@example.com",
      meetingLink: "https://meet.example.com/test",
      isTest: true,
    };

    const reminderId = await reminderService.createReminder(reminderData);

    res.json({
      success: true,
      message: "Test appointment created",
      reminderId,
      reminderData,
    });
  } catch (error) {
    console.error("❌ Error creating test appointment:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/test-email", emailController.testEmail);

app.post("/test-donation", (req, res) => {
  console.log("🧪 Test donation endpoint called");
  res.status(200).json({
    success: true,
    message: "Test donation endpoint working!",
    receivedData: {
      hasBody: !!req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      contentType: req.headers["content-type"],
      origin: req.headers.origin,
    },
    timestamp: new Date().toISOString(),
  });
});

app.post("/test-pdf", async (req, res) => {
  try {
    const testData = {
      donorName: "Test User",
      amount: "25.00",
      receiptNumber: "TEST_123",
      isRecurring: false,
      badgeName: "Champion",
      date: "2025-07-01",
      paymentMethod: "Credit Card",
    };

    const pdfBuffer = await generateInvoicePDFPuppeteer(testData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="test-receipt.pdf"'
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ Test PDF generation failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔒 CORS origins configured`);

  // Start internal cron scheduler
  cronService.startInternalCronScheduler();
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
